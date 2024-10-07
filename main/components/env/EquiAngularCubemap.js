import { createEl } from "../../utils.js";

AFRAME.registerComponent('eac-sphere', {
    schema: {
        eye: { type: 'string', default: 'left' }, // L,R,Both
    },

    init: function () {
        let object3D = this.el.object3D.children[0]
        let d = this.data
        let og = this.el.getAttribute("geometry")
        let geometry = new THREE.BoxGeometry(200, 200, 200);
        // let t = { repeat: { x: -0.5, y: 1 }, offset: { x: 0.5, y: 0 } }

        // if (d.side === "right") {
        //     t.offset.x += 0.5
        // }
        const uv = geometry.attributes.position;
        const radius = 100;

        // for (let i = 0; i < uv.count; i++) {
        //     const x = uv.getX(i);
        //     const y = uv.getY(i);
        //     const z = uv.getZ(i);

        //     const length = Math.sqrt(x * x + y * y + z * z);

        //     const newX = (x / length) * radius;
        //     const newY = (y / length) * radius;
        //     const newZ = (z / length) * radius;

        //     uv.setXYZ(i, newX, newY, newZ);
        // }


        // UV mapping for each face (in 0 to 1 range)
        const uvArray = [
            // Left face
            0.0, 0.5,   // bottom left
            0.25, 0.5,  // bottom right
            0.25, 0.75, // top right
            0.0, 0.75,  // top left

            // Front face
            0.25, 0.5,  // bottom left
            0.5, 0.5,   // bottom right
            0.5, 0.75,  // top right
            0.25, 0.75, // top left

            // Right face
            0.5, 0.5,   // bottom left
            0.75, 0.5,  // bottom right
            0.75, 0.75, // top right
            0.5, 0.75,  // top left

            // Bottom face
            0.25, 0.0,  // bottom left
            0.5, 0.0,   // bottom right
            0.5, 0.5,   // top right
            0.25, 0.5,  // top left

            // Back face
            0.75, 0.5,  // bottom left
            1.0, 0.5,   // bottom right
            1.0, 0.75,  // top right
            0.75, 0.75, // top left

            // Top face
            0.25, 1.0,  // bottom left
            0.5, 1.0,   // bottom right
            0.5, 0.5,   // top right
            0.25, 0.5   // top left
        ];

        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));

        // Update the geometry's UVs
        geometry.attributes.uv.needsUpdate = true;


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

AFRAME.registerComponent('equiangularcubemap', {
    schema: {
        defaultEye: { type: 'string', default: 'left' },
        detail: { type: 'number', default: 10 },
        uiHidden: { type: 'boolean', default: false }
    },

    init: function () {
        this.leftEye = createEl('a-entity', {
            geometry: `primitive:box; width: ${this.data.detail}; height: ${this.data.detail}; depth: ${this.data.detail};`,
            material: "shader: flat; src: #video; side: back;",
        })

        this.rightEye = createEl('a-entity', {
            geometry: `primitive:box; width: ${this.data.detail}; height: ${this.data.detail}; depth: ${this.data.detail};`,
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

        this.leftEye.setAttribute('eac-sphere', { eye: le, fov: 180, side: 'left' })
        this.rightEye.setAttribute('eac-sphere', { eye: re, fov: 180, side: 'right' })

        this.leftEye.object3D.visible = lev
        this.rightEye.object3D.visible = rev
    },

    remove: function () {
        this.el.removeChild(this.leftEye)
        this.el.removeChild(this.rightEye)
    },

});