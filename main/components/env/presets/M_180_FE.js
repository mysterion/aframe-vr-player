import { createEl } from "../../../utils.js";
import { PRESET } from "../constants.js";


AFRAME.registerComponent('m-fe-sphere-180', {
    schema: {
        fov: { type: 'number', default: 180 }, // 180-235
        detail: { type: 'number', default: 32 },
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
        let geometry = new THREE.SphereGeometry(100, d.detail, d.detail)

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

            uvAttribute.setXY(i, newU, newV);
        }
        uvAttribute.needsUpdate = true;

        object3D.geometry = geometry

    },
});

AFRAME.registerComponent(PRESET.M_180_FE, {
    schema: {
        fov: { type: 'number', default: 180 }, // 180-235
        detail: { type: 'number', default: 64 },
    },

    init: function () {
        let d = this.data
        let afov = d.fov - 180
        this.eye = createEl('a-entity', {
            geometry: `primitive:sphere;`,
            material: "shader: flat; src: #video; side: back;",
        })

        // remove other eye artifact ;)
        // TODO fix this, sometimes it doesnt work :(((((
        this.hideA = createEl('a-entity',
            {
                geometry: `primitive:sphere; radius: 99; segmentsWidth: 32; segmentsHeight: 8; thetaStart: 0; thetaLength: ${90 - afov / 2}`,
                material: "shader: flat; side: back; color: grey;",
                rotation: "90 0 0"

            })

        this.el.append(this.eye, this.hideA)
    },

    update: function (od) {
        let d = this.data

        this.eye.setAttribute('m-fe-sphere-180', { fov: d.fov })

        let afov = d.fov - 180
        this.hideA.setAttribute('geometry', `thetaLength: ${90 - afov / 2};`)

    },

    remove: function () {
        this.el.removeChild(this.eye)
        this.el.removeChild(this.hideA)
    },
});