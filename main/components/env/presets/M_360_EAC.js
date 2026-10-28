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

AFRAME.registerShader('youtube-eac', {
    schema: {
        src: { type: 'map', is: 'uniform' },
        faceWH: { type: 'vec2', default: { x: 1 / 3, y: 1 / 2 }, is: 'uniform' },
        vidWH: { type: 'vec2', default: { x: 1, y: 1 }, is: 'uniform' },
        seam: { type: 'number', default: 0, is: 'uniform' },
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform sampler2D src;
        uniform vec2 faceWH;
        uniform vec2 vidWH;
        const float PI = 3.141592653589793;
        uniform float seam;

        void main() {
            vec2 inset = vec2(seam) / vidWH;
            vec2 corner = vUv - mod(vUv, faceWH) + inset;
            vec2 faceWHadj = faceWH - inset * 2.0;
            vec2 p = (vUv - corner) / faceWHadj - 0.5;
            vec2 q = (2.0 / PI) * atan(2.0 * p) + 0.5;
            gl_FragColor = texture2D(src, corner + q * faceWHadj);
        }
    `,
});

const CONT_CORRECT = 2; // px, truncate discontinuous edges like videojs-vr

function applyEacUvs(geometry, vidW, vidH) {
    if (!(vidW > 0) || !(vidH > 0)) return;

    const insetX = CONT_CORRECT / vidW;
    const insetY = CONT_CORRECT / vidH;
    const uv = geometry.attributes.uv;

    for (let f = 0; f < 6; f++) {
        const t = EAC_TILES[FACE_ORDER[f]];
        const i = f * 4;

        // Keep UVs off the exact tile boundary so mod() always picks
        // this face's tile and bilinear filtering cannot bleed across.
        let minX = 1, maxX = 0, minY = 1, maxY = 0;
        for (const p of t) {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        }

        const inset = (p) => ({
            x: Math.min(Math.max(p.x, minX + insetX), maxX - insetX),
            y: Math.min(Math.max(p.y, minY + insetY), maxY - insetY),
        });

        const p0 = inset(t[3]);
        const p1 = inset(t[2]);
        const p2 = inset(t[0]);
        const p3 = inset(t[1]);

        // BoxGeometry verts: 0=TL, 1=TR, 2=BL, 3=BR
        uv.setXY(i + 0, p0.x, p0.y);
        uv.setXY(i + 1, p1.x, p1.y);
        uv.setXY(i + 2, p2.x, p2.y);
        uv.setXY(i + 3, p3.x, p3.y);
    }

    uv.needsUpdate = true;
}

AFRAME.registerComponent(PRESET.M_360_EAC, {
    schema: {
        uiHidden: { type: 'boolean', default: false },
    },

    init: function () {
        this.onMeta = AFRAME.utils.bind(this.onMeta, this);

        // minFilter: linear disables mipmap generation; mipmaps would
        // blend across the atlas tile boundaries at lower mip levels.
        this.eye = createEl('a-entity', {
            geometry: 'primitive:box; width:200; height:200; depth:200;',
            material: 'shader:youtube-eac; src:#video; side:back; seam:0; minFilter:linear;',
            rotation: '0 180 0',
        }, [], this.el);

        this.eye.addEventListener('loaded', () => {
            const mesh = this.eye.getObject3D('mesh');
            if (mesh && mesh.geometry) {
                applyEacUvs(mesh.geometry, El.video.videoWidth, El.video.videoHeight);
            }
        });

        El.video.addEventListener('loadedmetadata', this.onMeta);
        if (El.video.videoWidth) this.onMeta();
    },

    onMeta: function () {
        const w = El.video.videoWidth;
        const h = El.video.videoHeight;

        this.eye.setAttribute('material', {
            vidWH: { x: w || 1, y: h || 1 },
        });

        const mesh = this.eye.getObject3D('mesh');
        if (mesh && mesh.geometry) applyEacUvs(mesh.geometry, w, h);
    },

    remove: function () {
        El.video.removeEventListener('loadedmetadata', this.onMeta);
        if (this.eye.parentNode) this.el.removeChild(this.eye);
    },
});