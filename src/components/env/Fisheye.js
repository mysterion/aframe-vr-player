import { createElement } from "../../utils";

AFRAME.registerComponent('fe-sphere', {
    schema: {
        eye: { type: 'string', default: 'left' }, // L,R,Both
        fov: { type: 'number', default: 180 }, // 180-235
        side: { type: 'string', default: 'left' }, // LR
    },

    init: function () {
        let object3D = this.el.object3D.children[0]
        let d = this.data

        let fov = Math.PI
        let afov = d.fov - 180
        if (d.fov) {
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

AFRAME.registerComponent('fisheye', {
    schema: {
        fov: { type: 'number', default: 180 }, // 180-235
        detail: { type: 'number', default: 32 },
        defaultEye: { type: 'string', default: 'left' },
        uiHidden: { type: 'boolean', default: false }
    },

    init: function () {
        let d = this.data
        let afov = d.fov - 180
        this.leftEye = createElement('a-entity', {
            geometry: `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail};`,
            material: "shader: flat; src: #video; side: back;",
        })
        this.rightEye = createElement('a-entity', {
            geometry: `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail};`,
            material: "shader: flat; src: #video; side: back;",
        })

        // remove other eye artifact ;)
        this.hideA = createElement('a-entity',
        {
            geometry: `primitive:sphere; radius: 99; segmentsWidth: 32; segmentsHeight: 8; thetaStart: 0; thetaLength: ${90 - afov / 2}`,
            material: "shader: flat; side: back; color: grey",
            rotation: "90 0 0"

        })

        this.el.append(this.leftEye, this.rightEye, this.hideA)
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

        this.leftEye.setAttribute('fe-sphere', { eye: le, fov: d.fov, side: 'left' })
        this.rightEye.setAttribute('fe-sphere', { eye: re, fov: d.fov, side: 'right' })

        this.leftEye.object3D.visible = lev
        this.rightEye.object3D.visible = rev

        let afov = d.fov - 180
        this.hideA.setAttribute('geometry', `thetaLength: ${90 - afov / 2};`)

    },

    remove: function () {
        this.el.removeChild(this.leftEye)
        this.el.removeChild(this.rightEye)
        this.el.removeChild(this.hideA)
    },
});