import { ControlsHidden, ControlsShown, E_Controls } from "../../systems/Controls";
import { createElement } from "../../utils";

AFRAME.registerComponent('fe-sphere', {
    schema: {
        eye: { type: 'string', default: 'left' }, // L,R,Both
        fov: { type: 'number', default: 180 }, // 180-235
        side: { type: 'string', default: 'left' }, // LR
    },

    update: function (od) {
        let object3D = this.el.object3D.children[0]
        let d = this.data

        let fov = Math.PI
        if (d.fov) {
            let afov = d.fov - 180
            fov += (Math.PI / 180) * afov
        }
        let og = this.el.getAttribute("geometry")
        let geometry = new THREE.SphereGeometry(og.radius || 100, og.segmentsWidth || 32, og.segmentsHeight || 32)
        let t = { repeat: { x: 0.5, y: 1 }, offset: { x: 0, y: 0 } }

        if (d.side === "right") {
            t.offset.x += 0.5
        }

        geometry.rotateX(-Math.PI / 2)
        geometry.rotateY(Math.PI)
        let uvAttribute = geometry.attributes.uv;
        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i);
            const v = uvAttribute.getY(i);

            const theta = 2 * Math.PI * u;
            const phi = Math.PI * v;
            const r = phi / fov;

            const newU = 0.5 + r * Math.cos(theta)
            const newV = 0.5 + r * Math.sin(theta)

            uvAttribute.setXY(i, newU * t.repeat.x + t.offset.x, newV * t.repeat.y + t.offset.y);
        }
        uvAttribute.needsUpdate = true;

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

AFRAME.registerComponent('fisheye', {
    schema: {
        fov: { type: 'number', default: 180 }, // 180-235
        detail: { type: 'number', default: 32 },
        defaultEye: { type: 'string', default: 'left' }
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
        this.leftEye.setAttribute('fe-sphere', { eye: le, fov: 180, side: 'left' })
        this.rightEye.setAttribute('fe-sphere', { eye: re, fov: 180, side: 'right' })
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