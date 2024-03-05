// mode=180SbsEq,SbsFish
// eye=left,right,both
AFRAME.registerComponent('stereosphere', {

    schema: {
        eye: { type: 'string', default: 'left' },
        mode: { type: 'string', default: '180SbsEq' },
        side: { type: 'string', default: 'left' },
        fishFov: { type: 'int', default: 180 }
    },

    update: function (oldData) {
        let object3D = this.el.object3D.children[0];
        let data = this.data;
        if (data.mode === "180SbsEq") {
            let og = this.el.getAttribute("geometry")
            let geometry = new THREE.SphereGeometry(og.radius || 100, og.segmentsWidth || 32, og.segmentsHeight || 32, Math.PI, Math.PI, 0, Math.PI)
            let t = { repeat: { x: -0.5, y: 1 }, offset: { x: 0.5, y: 0 } }

            if (data.side === "right") {
                t.offset.x += 0.5
            }

            let uvAttribute = geometry.attributes.uv;
            for (let i = 0; i < uvAttribute.count; i++) {
                const u = uvAttribute.getX(i);
                const v = uvAttribute.getY(i);
                uvAttribute.setXY(i, u * t.repeat.x + t.offset.x, v * t.repeat.y + t.offset.y);
            }
            uvAttribute.needsUpdate = true;
            object3D.geometry = geometry
        } else if (data.mode === "SbsFish") {
            let fov = Math.PI
            if (data.fishFov) {
                let afov = data.fishFov - 180
                fov += (Math.PI / 180) * afov
            }
            let og = this.el.getAttribute("geometry")
            let geometry = new THREE.SphereGeometry(og.radius || 100, og.segmentsWidth || 32, og.segmentsHeight || 32)
            let t = { repeat: { x: 0.5, y: 1 }, offset: { x: 0, y: 0 } }

            if (data.side === "right") {
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
        }

        // layers logic
        if (data.eye === "left") {
            object3D.layers.set(1);
        } else if (data.eye === "right") {
            object3D.layers.set(2);
        } else {
            object3D.layers.set(0);
        }
    },
});