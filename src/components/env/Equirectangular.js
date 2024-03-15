import { createElement } from "../../utils";

AFRAME.registerComponent('eq-sphere', {
    schema: {
        eye: { type: 'string', default: 'left' }, // L,R,Both
        fov: { type: 'number', default: 180 }, // 180, 360 TODO: 360
        side: { type: 'string', default: 'left' }, // LRTB TODO: TB
    },

    init: function () {
        let object3D = this.el.object3D.children[0]
        let d = this.data
        let og = this.el.getAttribute("geometry")
        let geometry = new THREE.SphereGeometry(og.radius || 100, og.segmentsWidth || 32, og.segmentsHeight || 32, Math.PI, Math.PI, 0, Math.PI)
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

AFRAME.registerComponent('equirectangular', {
    schema: {
        defaultEye: { type: 'string', default: 'left' },
        detail: { type: 'number', default: 32 },
        uiHidden: { type: 'boolean', default: false }
    },

    init: function () {
        this.leftEye = createElement('a-entity', {
            geometry: `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail};`,
            material: "shader: flat; src: #video; side: back;",
        })

        this.rightEye = createElement('a-entity', {
            geometry: `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail};`,
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

        this.leftEye.setAttribute('eq-sphere', { eye: le, fov: 180, side: 'left' })
        this.rightEye.setAttribute('eq-sphere', { eye: re, fov: 180, side: 'right' })

        this.leftEye.object3D.visible = lev
        this.rightEye.object3D.visible = rev
    },

    remove: function () {
        this.el.removeChild(this.leftEye)
        this.el.removeChild(this.rightEye)
    },

});