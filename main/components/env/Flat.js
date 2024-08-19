import { El } from "../../main.js";
import { createEl, setAttr } from "../../utils.js";

const bgs = [
    {
        name: 'sky tower',
        src: '/assets/gltf/mountain_movie_lounge/scene.gltf',
        poi: [
            {
                tv: {
                    geometry: { height: 60 },
                    position: '0 10 -65'
                },
                bg: {
                    position: '0 -25 0',
                    rotation: '0 0 0',
                    scale: '20 20 20'
                }
            }
        ]
    }

]

AFRAME.registerComponent('flat-2d', {
    schema: {
        eye: { type: 'string', default: 'left' },
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

AFRAME.registerComponent('flat-3d', {
    schema: {
        eye: { type: 'string', default: 'left' },
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
    init: function () {
        this.onVideoChange = AFRAME.utils.bind(this.onVideoChange, this)
        El.video.addEventListener("loadedmetadata", this.onVideoChange)
        this.i = 0
        this.p = 0
        this.tvAttr = {
            geometry: `primitive: plane; height: ${bgs[this.i].poi[this.p].tv.geometry.height}; width: ${1.77 * bgs[this.i].poi[this.p].tv.geometry.height}`,
            material: `shader: flat; src: #video; side: front;`,
            position: '0 0 -25'
        }
        this.eye = createEl('a-entity', this.tvAttr)
        this.bg = createEl('a-gltf-model', {
            ...bgs[this.i].poi[this.p].bg,
            src: bgs[this.i].src
        })

        // bg toggle >>>
        this.bgToggleHandler = AFRAME.utils.bind(this.bgToggleHandler, this)
        this.bgToggleTxt = createEl('a-text', { position: '0 0 0.5', align: 'center', width: 40, value: bgs[this.i].name })
        this.bgToggle = createEl('a-entity', {
            position: '0 -16 -60',
            geometry: 'primitive:plane; width:15; height: 3',
            material: 'color: #808080; opacity: 1',
            clickable: '', controls: '', 'button-highlight': '',
        }, [this.bgToggleTxt])

        this.bgToggle.addEventListener('click', this.bgToggleHandler)

        // bg toggle <<<

        // poi toggle >>>
        this.poiToggleHandler = AFRAME.utils.bind(this.poiToggleHandler, this)
        this.poiToggleTxt = createEl('a-text', { position: '0 0 0.5', align: 'center', width: 40, value: this.p })

        this.poiToggle = createEl('a-entity', {
            position: '10 -16 -60',
            geometry: 'primitive:plane; width:3; height: 3',
            material: 'color: #808080; opacity: 1',
            clickable: '', controls: '', 'button-highlight': '',
        }, [this.poiToggleTxt])

        this.bgToggle.addEventListener('click', this.poiToggleHandler)

        // poi toggle <<<

        this.el.append(this.eye, this.bg, this.bgToggle, this.poiToggle)
    },

    update: function (od) {
        setAttr(this.bgToggleTxt, { value: bgs[this.i].name })
        setAttr(this.poiToggleTxt, { value: this.p })

        if (this.bg.getAttribute('src') !== bgs[this.i].src) {
            setAttr(this.bg, {
                src: bgs[this.i].src
            })
        }
        setAttr(this.bg, bgs[this.i].poi[this.p].bg)
        setAttr(this.eye, bgs[this.i].poi[this.p].tv)
    },

    onVideoChange: function (e) {
        let w = El.video.videoWidth / El.video.videoHeight * bgs[this.i].poi[this.p].tv.geometry.height
        this.eye.setAttribute('geometry', `width: ${w};`)
    },

    bgToggleHandler: function () {
        this.i = (this.i + 1) % bgs.length
        this.update()
    },

    poiToggleHandler: function () {
        this.p = (this.p + 1) % bgs[this.i].poi.length
        this.update()
    },

    remove: function () {
        this.el.removeChild(this.eye)
        this.el.removeChild(this.bg)
        this.el.removeChild(this.bgToggle)
        this.el.removeChild(this.poiToggle)
        El.video.removeEventListener("loadedmetadata", this.onVideoChange)
    },
});