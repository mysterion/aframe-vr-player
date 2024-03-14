import { ControlsHidden, ControlsShown, E_Controls } from "../../systems/Controls";
import { createElement } from "../../utils";

AFRAME.registerComponent('eq-sphere', {
    schema: {
        eye: { type: 'string', default: 'left' }, // L,R,Both
        fov: { type: 'number', default: 180 }, // 180, 360 TODO: 360
        side: { type: 'string', default: 'left' }, // LRTB TODO: TB
    },

    update: function (od) {
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

        // layers logic
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
        detail: { type: 'number', default: 32 }
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

        this.onHide = AFRAME.utils.bind(this.onHide, this)
        this.el.sceneEl.addEventListener(E_Controls, this.onHide)

        this.el.append(this.leftEye, this.rightEye)
    },

    update: function (od) {
        let d = this.data
        console.log(d)
        let le = 'both', re = 'both'
        if (d.defaultEye === 'left') {
            re = 'right'
        } else {
            le = 'left'
        }
        this.leftEye.setAttribute('eq-sphere', { eye: le, fov: 180, side: 'left' })
        this.rightEye.setAttribute('eq-sphere', { eye: re, fov: 180, side: 'right' })
    },

    remove: function () {
        this.el.removeChild(this.leftEye)
        this.el.removeChild(this.rightEye)
        this.el.sceneEl.removeEventListener(E_Controls, this.onHide)
    },

    onHide: function (e) {
        let d = this.data
        console.log(d)
        if (e.detail === ControlsHidden) {
            if (d.defaultEye === 'left') {
                console.log('show right eye')
                this.rightEye.object3D.visible = true
            } else {
                console.log('show left eye')
                this.leftEye.object3D.visible = true
            }
        } else if (e.detail === ControlsShown) {
            if (d.defaultEye === 'left') {
                console.log('hide right eye')
                this.rightEye.object3D.visible = false
            } else {
                console.log('hide left eye')
                this.leftEye.object3D.visible = false
            }
        }
    }
});