import { createEl } from "../../../utils.js";
import { PRESET } from "../constants.js";


AFRAME.registerComponent('eq-sphere-180', {
    schema: {
        eye: { type: 'string', default: 'left' },
        side: { type: 'string', default: 'left' },
        detail: {type: 'number', default: 32 }
    },

    init: function () {
        let object3D = this.el.object3D.children[0]
        let d = this.data
        let geometry = new THREE.SphereGeometry(100, d.detail, d.detail, Math.PI, Math.PI, 0, Math.PI)
        let t = { repeat: { x: -0.5, y: 1 }, offset: { x: 0.5, y: 0 } }

        if (d.side === "right") {
            t.offset.x += 0.5
        }

        let uv = geometry.attributes.uv;
        for (let i = 0; i < uv.count; i++) {
            const u = uv.getX(i);
            const v = uv.getY(i);
            uv.setXY(i, u * t.repeat.x + t.offset.x, v * t.repeat.y + t.offset.y);
        }
        uv.needsUpdate = true;
        object3D.geometry.dispose()
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

AFRAME.registerComponent(PRESET.SBS_180_EQR, {
    schema: {
        defaultEye: { type: 'string', default: 'left' },
        detail: { type: 'number', default: 32 },
        uiHidden: { type: 'boolean', default: false },
    },

    init: function () {
        this.leftEye = createEl('a-entity', {
            geometry: `primitive:sphere;`,
            material: "shader: flat; src: #video; side: back;",
        })

        this.rightEye = createEl('a-entity', {
            geometry: `primitive:sphere;`,
            material: "shader: flat; src: #video; side: back;",
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

        this.leftEye.setAttribute('eq-sphere-180', { eye: le, side: 'left' })
        this.rightEye.setAttribute('eq-sphere-180', { eye: re, side: 'right' })

        this.leftEye.object3D.visible = lev
        this.rightEye.object3D.visible = rev
    },

    remove: function () {
        this.el.removeChild(this.leftEye)
        this.el.removeChild(this.rightEye)
    },

});