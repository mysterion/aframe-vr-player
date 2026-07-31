
import { El } from "../../../elems.js";
import { Store } from "../../../store.js";
import { createEl, setAttr } from "../../../utils.js";
import { EV } from "../../Events.js";
import { getSettings, setSettings, ST } from "../../settings/Settings.js";
import { PRESET } from "../constants.js";

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
    },
    {
        name: 'cinema hall',
        src: '/assets/gltf/cinema/cinema.gltf',
        poi: [
            {
                tv: {
                    geometry: { height: 60 },
                    position: '0 18.5 -86'
                },
                bg: {
                    position: '0 32 96',
                    rotation: '0 0 0',
                    scale: '10 10 10'
                }
            }
            ,
            {
                tv: {
                    geometry: { height: 60 },
                    position: '0 6.75 -118'
                },
                bg: {
                    position: '0 20 64',
                    rotation: '0 0 0',
                    scale: '10 10 10'
                }
            },
            {
                tv: {
                    geometry: { height: 60 },
                    position: '0 -5.15 -150'
                },
                bg: {
                    position: '0 8 32',
                    rotation: '0 0 0',
                    scale: '10 10 10'
                }
            },
        ]
    },

]

const viewEls = (el) => {
    return el.querySelectorAll(".view")
}

AFRAME.registerComponent(PRESET.FLAT, {
    schema: {
        poiIdx: { type: 'number', default: 0 },
        bgIdx: { type: 'number', default: 0 },
        videoType: { type: 'string', default: '2D' },
        lights: { type: 'boolean', default: true },
    },
    init: function () {
        this.onVideoChange = AFRAME.utils.bind(this.onVideoChange, this)
        this.onSettingsChange = AFRAME.utils.bind(this.onSettingsChange, this)

        El.video.addEventListener("loadedmetadata", this.onVideoChange)
        El.events.addEventListener(EV.SETTINGS, this.onSettingsChange)
        this.onSettingsChange()

        // poi toggle >>>
        this.poiToggle = createEl('a-entity', {
            position: '10 -16 -60',
            geometry: 'primitive:plane; width:3; height: 3',
            material: 'color: #808080; opacity: 1',
            clickable: '', controls: '', 'button-highlight': '',
            text: `value: ${this.data.poiIdx}; align: center; width: 40; zOffset: 0.5;`,
        }, [], this.el),

        this.poiToggle.addEventListener('click', () => {
            setSettings(ST.FLAT_ENV_POI, (this.data.poiIdx + 1) % bgs[this.data.bgIdx].poi.length)
        })
        // poi toggle <<<


        // bg toggle >>>
        this.bg = createEl('a-gltf-model', {
            ...bgs[this.data.bgIdx].poi[this.data.poiIdx].bg,
            src: bgs[this.data.bgIdx].src
        }, [], this.el)

        this.bgToggle = createEl('a-entity', {
            position: '0 -16 -60',
            geometry: 'primitive:plane; width:15; height: 3',
            material: 'color: #808080; opacity: 1',
            clickable: '', controls: '', 'button-highlight': '',
            text: `value: ${bgs[this.data.bgIdx].name}; align: center; width: 40; zOffset: 0.5;`,
        }, [], this.el)

        this.bgToggle.addEventListener('click', () => {
            setSettings(ST.FLAT_ENV_BG, (this.data.bgIdx + 1) % bgs.length)
        })

        // bg toggle <<<


        // video type >>>

        this.viewAttr = {
            geometry: `primitive: plane; height: ${bgs[this.data.bgIdx].poi[this.data.poiIdx].tv.geometry.height}; width: ${1.77 * bgs[this.data.bgIdx].poi[this.data.poiIdx].tv.geometry.height}`,
            material: `shader: flat; src: #video; side: front;`,
            position: '0 0 -25',
            class: 'view',
        }

        this.VTypeToggle = createEl('a-entity', {
            position: '16 -12 -60',
            geometry: 'primitive:plane; width:3; height: 3',
            material: 'color: #808080; opacity: 1',
            clickable: '', controls: '', 'button-highlight': '',
            text: `value: ${this.data.videoType}; align: center; width: 40; zOffset: 0.5;`,
        }, [], this.el)

        this.VTypeToggle.addEventListener('click', () => {
            let newType = this.data.videoType === '2D' ? '3D' : '2D'
            setSettings(ST.FLAT_ENV_VTYPE, newType)
        })
        // video type <<<


        // lights >>>


        this.lightsToggle = createEl('a-entity', {
            position: '18 -16 -60',
            geometry: 'primitive:plane; width:10; height: 3',
            material: 'color: #808080; opacity: 1',
            controls: '', 'button-highlight': '',
            text: `align: center; width: 40; zOffset: 0.5;`,
        }, [], this.el)

        this.lightsToggle.addEventListener('click', () => {
            setAttr(this.el, { [PRESET.FLAT]: {lights: !this.data.lights} })
        })

        // lights <<<

    },

    update: function (od) {
        setAttr(this.bgToggle, { text: `value: ${bgs[this.data.bgIdx].name}` })
        setAttr(this.poiToggle, { text: `value: ${this.data.poiIdx}` })
        setAttr(this.VTypeToggle, { text: `value: ${this.data.videoType};` })

        if (od.videoType !== this.data.videoType) {
            viewEls(this.el).forEach(v => {
                this.el.removeChild(v)
            })
            if (this.data.videoType === '2D') {
                console.log(this.data.videoType)
                this.view = createEl('a-entity', this.viewAttr, [], this.el)
            } else if (this.data.videoType === '3D') {
                this.left = createEl('a-entity', {
                    ...this.viewAttr,
                    material: this.viewAttr.material + ' offset: 0 0; repeat: 0.5 1;',
                    stereo: 'eye: left',
                }, [], this.el)

                this.right = createEl('a-entity', {
                    ...this.viewAttr,
                    material: this.viewAttr.material + ' offset: 0.5 0; repeat: 0.5 1;',
                    stereo: 'eye: right',
                }, [], this.el)
            }
        }

        if (bgs[this.data.bgIdx].name === 'cinema hall') {
            this.lightsToggle.setAttribute('clickable', '')
            this.lightsToggle.object3D.visible = true
        } else {
            this.lightsToggle.removeAttribute('clickable')
            this.lightsToggle.object3D.visible = false
        }
        if (this.data.lights) {
            this.el.sceneEl.systems['light-controls'].on()
            setAttr(this.lightsToggle, { text: `value: Lights - ON` })
        }
        else {
            this.el.sceneEl.systems['light-controls'].off()
            setAttr(this.lightsToggle, { text: `value: Lights - OFF` })
        }

        if (this.bg.getAttribute('src') !== bgs[this.data.bgIdx].src) {
            setAttr(this.bg, {
                src: bgs[this.data.bgIdx].src
            })
        }
        setAttr(this.bg, bgs[this.data.bgIdx].poi[this.data.poiIdx].bg)
        setAttr(viewEls(this.el), bgs[this.data.bgIdx].poi[this.data.poiIdx].tv)

    },

    onVideoChange: function (e) {
        let w = El.video.videoWidth / El.video.videoHeight * bgs[this.data.bgIdx].poi[this.data.poiIdx].tv.geometry.height
        setAttr(viewEls(this.el), `width: ${w};`)
    },

    onSettingsChange: function (e) {
        if (!e) {
            e = {
                detail: {
                    [ST.FLAT_ENV_BG]: getSettings(ST.FLAT_ENV_BG),
                    [ST.FLAT_ENV_POI]: getSettings(ST.FLAT_ENV_POI),
                    [ST.FLAT_ENV_VTYPE]: getSettings(ST.FLAT_ENV_VTYPE),
                }
            }
        }

        setAttr(this.el, {
            [PRESET.FLAT]: {
                bgIdx: e.detail[ST.FLAT_ENV_BG],
                poiIdx: e.detail[ST.FLAT_ENV_POI],
                videoType: e.detail[ST.FLAT_ENV_VTYPE],
            }
        })

    },

    remove: function () {
        this.el.sceneEl.systems['light-controls'].on()
        this.el.removeChild(this.bg)
        this.el.removeChild(this.bgToggle)
        this.el.removeChild(this.poiToggle)
        this.el.removeChild(this.VTypeToggle)
        this.el.removeChild(this.lightsToggle)
        viewEls(this.el).forEach(v => this.el.removeChild(v))
        El.video.removeEventListener("loadedmetadata", this.onVideoChange)
    },
});