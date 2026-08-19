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

function applyEacUvs(geometry) {
    const uv = geometry.attributes.uv;
    for (let f = 0; f < 6; f++) {
        const t = EAC_TILES[FACE_ORDER[f]];
        const i = f * 4;
        // BoxGeometry verts: 0=TL, 1=TR, 2=BL, 3=BR
        uv.setXY(i + 0, t[3].x, t[3].y);
        uv.setXY(i + 1, t[2].x, t[2].y);
        uv.setXY(i + 2, t[0].x, t[0].y);
        uv.setXY(i + 3, t[1].x, t[1].y);
    }
    uv.needsUpdate = true;
}

AFRAME.registerComponent(PRESET.M_360_EAC, {
    schema: {
        uiHidden: { type: 'boolean', default: false },
    },

    init: function () {
        this.onMeta = AFRAME.utils.bind(this.onMeta, this);

        this.eye = createEl('a-entity', {
            geometry: 'primitive:box; width:200; height:200; depth:200;',
            material: 'shader:youtube-eac; src:#video; side:back; seam:0;',
            rotation: '0 180 0',
        }, [], this.el);

        this.eye.addEventListener('loaded', () => {
            const mesh = this.eye.getObject3D('mesh');
            if (mesh && mesh.geometry) applyEacUvs(mesh.geometry);
        });

        El.video.addEventListener('loadedmetadata', this.onMeta);
        if (El.video.videoWidth) this.onMeta();
    },

    onMeta: function () {
        this.eye.setAttribute('material', {
            vidWH: { x: El.video.videoWidth || 1, y: El.video.videoHeight || 1 },
        });
    },

    remove: function () {
        El.video.removeEventListener('loadedmetadata', this.onMeta);
        if (this.eye.parentNode) this.el.removeChild(this.eye);
    },
});