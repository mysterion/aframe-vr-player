import { createEl, rad, setAttr } from "../../utils";

AFRAME.registerComponent('eq-sphere', {
    schema: {
        eye: { type: 'string', default: 'left' }, // L,R,Both
        fov: { type: 'number', default: 180 }, // 180, 360 TODO: 360
        side: { type: 'string', default: 'left' }, // LRTB TODO: TB:LR
    },

    update: function (od) {
        let object3D = this.el.object3D.children[0]
        let d = this.data
        let og = this.el.getAttribute("geometry")

        if (d.fov === 180) {

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
            object3D.scale.x = 1
            object3D.rotation.y = rad(0)

        } else if (d.fov === 360) {

            let geometry = new THREE.SphereGeometry(og.radius || 100, og.segmentsWidth || 32, og.segmentsHeight || 32)
            let t = { repeat: { x: 1, y: 0.5 }, offset: { x: 0, y: 0 } }

            if (d.side === "top") { // left eye
                t.offset.y += 0.5
            }

            let uv = geometry.attributes.uv;
            for (let i = 0; i < uv.count; i++) {
                const u = uv.getX(i);
                const v = uv.getY(i);
                uv.setXY(i, u * t.repeat.x + t.offset.x, v * t.repeat.y + t.offset.y);
            }
            uv.needsUpdate = true;

            object3D.geometry = geometry
            object3D.scale.x = -1
            object3D.rotation.y = rad(-90)

        }

        this.el.setAttribute('stereo', `eye:${d.eye}`)
    },
});

AFRAME.registerComponent('equirectangular', {
    schema: {
        defaultEye: { type: 'string', default: 'left' },
        detail: { type: 'number', default: 32 },
        uiHidden: { type: 'boolean', default: false },
        side: { type: 'string', default: 'LR' }
    },

    init: function () {
        this.leftEye = createEl('a-entity', {
            geometry: `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail};`,
            material: "shader: flat; src: #video; side: back;",
        })

        this.rightEye = createEl('a-entity', {
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

        if (d.side === 'LR') {
            this.leftEye.setAttribute('eq-sphere', { eye: le, fov: 180, side: 'left' })
            this.rightEye.setAttribute('eq-sphere', { eye: re, fov: 180, side: 'right' })

        } else {
            this.leftEye.setAttribute('eq-sphere', { eye: le, fov: 360, side: 'top' })
            this.rightEye.setAttribute('eq-sphere', { eye: re, fov: 360, side: 'bottom' })

        }


        this.leftEye.object3D.visible = lev
        this.rightEye.object3D.visible = rev
    },

    remove: function () {
        this.el.removeChild(this.leftEye)
        this.el.removeChild(this.rightEye)
    },

});


AFRAME.registerComponent('equirectangular-mono', {
    schema: {
        detail: { type: 'number', default: 32 },
        fov: { type: 'number', default: 180 },
    },

    init: function () {
        this.eye = createEl('a-entity', {
            geometry: 'primitive: sphere;',
            material: "shader: flat; src: #video; side: back;",
        })

        this.el.append(this.eye)
    },
    update: function () {
        var geometry = `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail};`
        if (this.data.fov === 180) {
            geometry = `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail};phiStart : 180; phiLength : 180; thetaStart : 0; thetaLength : 180`
        }
        setAttr(this.eye, {
            geometry
        })
    },
    remove: function () {
        this.el.removeChild(this.eye)
    },

});