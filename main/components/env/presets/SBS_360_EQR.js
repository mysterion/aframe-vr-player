import { createEl } from "../../../utils.js";
import { PRESET } from "../constants.js";


AFRAME.registerComponent('eq-sphere-360', {
    schema: {
        eye: { type: 'string', default: 'left' }, // L,R,Both
        side: { type: 'string', default: 'left' }, // LR
    },

    init: function () {
        let object3D = this.el.object3D.children[0]
        let d = this.data

        let og = this.el.getAttribute("geometry")
        let geometry = new THREE.SphereGeometry(
            og.radius,
            og.segmentsWidth,
            og.segmentsHeight,
            0, 2*Math.PI, 0, Math.PI
        )
        
        let t = { repeat: { x: 1, y: 0.5 }, offset: { x: 0, y: 0.5 } }

        if (d.side === "right") {
            t.offset.y -= 0.5
        }

        let uvAttribute = geometry.attributes.uv;
        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i);
            const v = uvAttribute.getY(i);

            const newU = u * t.repeat.x + t.offset.x;
            const newV = v * t.repeat.y + t.offset.y;

            uvAttribute.setXY(i, newU, newV);
        }
        uvAttribute.needsUpdate = true;

        object3D.geometry = geometry

    },

    update: function (od) {
        let d = this.data
        let object3D = this.el.object3D.children[0]
        // layers
        if (d.eye === "left") {
            object3D.layers.set(1);
        } else if (d.eye === "right") {
            object3D.layers.set(2);
        } else {
            object3D.layers.set(0);
        }

    },
});

AFRAME.registerComponent(PRESET.TB_360_EQR, {
    schema: {
        detail: { type: 'number', default: 64 },
        defaultEye: { type: 'string', default: 'left' },
        uiHidden: { type: 'boolean', default: false }
    },

    init: function () {
        this.leftEye = createEl('a-entity', {
            geometry: `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail};`,
            material: "shader: flat; src: #video; side: back;",
            scale: "-1 1 1",
            rotation: "0 -90 0"
        })
        this.rightEye = createEl('a-entity', {
            geometry: `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail};`,
            material: "shader: flat; src: #video; side: back;",
            scale: "-1 1 1",
            rotation: "0 -90 0"
        })

        this.el.append(this.leftEye, this.rightEye)
    },

    update: function (od) {
        let d = this.data

        let le = 'left', re = 'right', lev = true, rev = true

        if (!d.uiHidden) {
            if (d.defaultEye === 'left') {
                rev = false
                le = 'both'
            } else {
                lev = false
                re = 'both'
            }
        }

        this.leftEye.setAttribute('eq-sphere-360', { eye: le, side: 'left' })
        this.rightEye.setAttribute('eq-sphere-360', { eye: re, side: 'right' })

        this.leftEye.object3D.visible = lev
        this.rightEye.object3D.visible = rev

    },

    remove: function () {
        this.el.removeChild(this.leftEye)
        this.el.removeChild(this.rightEye)
    },
});