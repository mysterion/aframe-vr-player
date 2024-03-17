import { E } from "../../main";
import { applyAttribs, createElement } from "../../utils";

const bgs = [
    {
        src: '/static/gltf/tropical_island/scene.gltf',
        position: '0 -4 -7',
        'animation-mixer': ''
    },
    {
        src: '/static/gltf/mountain_movie_lounge/scene.gltf',
        position: '0 -2.5 0',
        scale: '2 2 2'
    }

]

AFRAME.registerComponent('flat-2d', {
    schema: {
        eye: { type: 'string', default: 'left' },
    },

    init: function () {
        let object3D = this.el.object3D.children[0]
        let d = this.data
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

AFRAME.registerComponent('flat', {
    schema: {
        size: { type: 'string', default: 'M' },
    },

    init: function () {
        let d = this.data
        this.onVideoChange = AFRAME.utils.bind(this.onVideoChange, this)
        E.video.addEventListener("loadedmetadata", this.onVideoChange)
        this.size = {
            'S': { h: 4, w: 1.77777777778 * 4 },
            'M': { h: 5, w: 1.77777777778 * 5 },
            'L': { h: 6, w: 1.77777777778 * 6 },
        }
        this.eye = createElement('a-entity', {
            id: 'wanker',
            geometry: `primitive: plane; height: ${this.size[d.size].h}; width: ${this.size[d.size].w}`,
            material: `shader: flat; src: #video; side: front;`,
            position: "0 0 -4"
        })

        this.bg = createElement('a-gltf-model', bgs[Math.floor(Math.random() * 3)])

        this.el.append(this.eye, this.bg)
    },

    update: function (od) {
        let d = this.data

        applyAttribs(this.bg, bgs[Math.floor(Math.random() * bgs.length)])
        this.eye.setAttribute('geometry', {height: this.size[d.size].h, width:this.size[d.size].w})
    },

    onVideoChange: function (e) {
        let w = E.video.videoWidth / E.video.videoHeight * this.size[this.data.size].h
        this.eye.setAttribute('geometry', `height: ${this.size[this.data.size].h}; width: ${w};`)
    },

    remove: function () {
        this.el.removeChild(this.eye)
        this.el.removeChild(this.bg)
        E.ascene.removeEventListener("loadedmetadata", this.onVideoChange)
    },
});