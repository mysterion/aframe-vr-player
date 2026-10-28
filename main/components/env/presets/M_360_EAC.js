import { El } from "../../../elems.js";
import { createEl } from "../../../utils.js";
import { PRESET } from "../constants.js";

// videojs-vr EAC tiles: [bl, br, tr, tl]
// top row:    Right | Front | Left
// bottom row: Bottom | Back | Top   (rotated in the file)
const EAC_TILES = {
    right:  [{ x: 1 / 3, y: 0.5 }, { x: 0,     y: 0.5 }, { x: 0,     y: 1 }, { x: 1 / 3, y: 1 }],
    left:   [{ x: 1,     y: 0.5 }, { x: 2 / 3, y: 0.5 }, { x: 2 / 3, y: 1 }, { x: 1,     y: 1 }],
    top:    [{ x: 1,     y: 0.5 }, { x: 1,     y: 0 },   { x: 2 / 3, y: 0 }, { x: 2 / 3, y: 0.5 }],
    bottom: [{ x: 1 / 3, y: 0.5 }, { x: 1 / 3, y: 0 },   { x: 0,     y: 0 }, { x: 0,     y: 0.5 }],
    front:  [{ x: 2 / 3, y: 0.5 }, { x: 1 / 3, y: 0.5 }, { x: 1 / 3, y: 1 }, { x: 2 / 3, y: 1 }],
    back:   [{ x: 1 / 3, y: 0 },   { x: 1 / 3, y: 0.5 }, { x: 2 / 3, y: 0.5 }, { x: 2 / 3, y: 0 }],
};

// BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
const FACE_ORDER = ['right', 'left', 'top', 'bottom', 'front', 'back'];

// BoxGeometry vertex order inside a face: 0=TL, 1=TR, 2=BL, 3=BR
const FACE_UV_ORDER = [3, 2, 0, 1];

// How far each face is pulled in from its atlas tile, in source texels.
// 0.5 puts every sample exactly on a texel centre: the smallest crop that
// keeps bilinear filtering from blending the neighbouring face. The crop is
// symmetric, so faces stay aligned at the cube edges. Raise it (via
// `crop:1` in the material) if a source still shows a boundary line.
const EDGE_CROP = 0.5;

AFRAME.registerShader('youtube-eac', {
    schema: {
        src: { type: 'map', is: 'uniform' },
        faceWH: { type: 'vec2', default: { x: 1 / 3, y: 1 / 2 }, is: 'uniform' },
        vidWH: { type: 'vec2', default: { x: 1, y: 1 }, is: 'uniform' },
        crop: { type: 'number', default: EDGE_CROP, is: 'uniform' },
    },
    vertexShader: /* glsl */ `
        attribute vec2 tile; // atlas tile origin for this face
        varying vec2 vUv;
        varying vec2 vTile;
        void main() {
            vUv = uv;
            vTile = tile;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        varying vec2 vUv;
        varying vec2 vTile;
        uniform sampler2D src;
        uniform vec2 faceWH;
        uniform vec2 vidWH;
        uniform float crop;
        const float PI = 3.141592653589793;

        void main() {
            // Undo the EAC atan warp within this face. The tile origin comes
            // from a per-vertex attribute instead of mod(), so a UV landing
            // exactly on a tile boundary can never select the wrong tile.
            vec2 inset = vec2(crop) / vidWH;
            vec2 span = max(faceWH - inset * 2.0, vec2(0.0));

            vec2 p = (vUv - vTile) / faceWH - 0.5;
            vec2 q = (2.0 / PI) * atan(2.0 * p) + 0.5;

            // q = 0 / 1 lands on the first / last texel centre of the tile,
            // so filtering never reaches across into the next face.
            gl_FragColor = texture2D(src, vTile + inset + q * span);
        }
    `,
});

function applyEacUvs(geometry) {
    const uv = geometry.attributes.uv;

    let tile = geometry.attributes.tile;
    if (!tile || tile.count !== uv.count) {
        tile = new THREE.Float32BufferAttribute(new Float32Array(uv.count * 2), 2);
        geometry.setAttribute('tile', tile);
    }

    for (let f = 0; f < 6; f++) {
        const t = EAC_TILES[FACE_ORDER[f]];
        const i = f * 4;

        // Tile origin in UV space; the shader maps each face from here.
        const originX = Math.min(t[0].x, t[1].x, t[2].x, t[3].x);
        const originY = Math.min(t[0].y, t[1].y, t[2].y, t[3].y);

        for (let k = 0; k < 4; k++) {
            const p = t[FACE_UV_ORDER[k]];
            uv.setXY(i + k, p.x, p.y);
            tile.setXY(i + k, originX, originY);
        }
    }

    uv.needsUpdate = true;
    tile.needsUpdate = true;
}

AFRAME.registerComponent(PRESET.M_360_EAC, {
    schema: {
        uiHidden: { type: 'boolean', default: false },
    },

    init: function () {
        this.onMeta = AFRAME.utils.bind(this.onMeta, this);

        // minFilter: linear keeps mipmaps off; lower mip levels blend across
        // the atlas tiles at grazing angles.
        this.eye = createEl('a-entity', {
            geometry: 'primitive:box; width:200; height:200; depth:200;',
            material: 'shader:youtube-eac; src:#video; side:back; minFilter:linear;',
            rotation: '0 180 0',
        }, [], this.el);

        this.apply = () => {
            const mesh = this.eye.getObject3D('mesh');
            if (mesh && mesh.geometry) applyEacUvs(mesh.geometry);
        };

        this.eye.addEventListener('loaded', this.apply);

        El.video.addEventListener('loadedmetadata', this.onMeta);
        if (El.video.videoWidth) this.onMeta();
    },

    onMeta: function () {
        this.eye.setAttribute('material', {
            vidWH: {
                x: El.video.videoWidth || 1,
                y: El.video.videoHeight || 1,
            },
        });

        this.apply();
    },

    remove: function () {
        El.video.removeEventListener('loadedmetadata', this.onMeta);
        if (this.eye.parentNode) this.el.removeChild(this.eye);
    },
});
