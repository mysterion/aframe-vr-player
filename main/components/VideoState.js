import { El } from "../elems.js";
import { Store } from "../store.js"
import { createEl, getFileName, setAttr } from "../utils.js";
import { videoPresets } from "./env/EnvManager.js";
import { ST, getSettings } from "./settings/Settings.js"

export const C_VID_STATE = 'video-state'

AFRAME.registerComponent(C_VID_STATE, {
    schema: {
        presetId: { type: 'number', default: 0 },
        src: { type: 'string', default: 'static/sample.mp4' },
        fileName: { type: 'string', default: 'sample.mp4' },
        resumeVideo: { type: 'boolean', default: false },
    },

    init: function () {
        this.onVideoLoad = AFRAME.utils.bind(this.onVideoLoad, this)
        this.saveVidTime = AFRAME.utils.bind(this.saveVidTime, this)
        this.setupKeys = AFRAME.utils.bind(this.setupKeys, this)

        this.video = document.querySelector("#video")



        this.toggleModeBtn = createEl('a-entity', {
            position: '0 -12 -60',
            controls: '',
            material: 'color: #808080; opacity: 1',
            geometry: 'primitive:plane; width:18; height: 3',
            text: `width: 40; zOffset: 0.2; align: center`,
        }, [], El.controls)

        this.toggleModeNextBtn = createEl('a-image', {
            src: '#asset-arrow',
            position: '11 0 0',
            scale: '3.5 3.5 1',
            clickable: '',
            controls: '',
            'button-highlight': '',
        }, [], this.toggleModeBtn)

        this.toggleModePrevBtn = createEl('a-image', {
            src: '#asset-arrow',
            position: '-11 0 0',
            rotation: '0 180 0',
            scale: '3.5 3.5 1',
            clickable: '',
            controls: '',
            'button-highlight': '',
        }, [], this.toggleModeBtn)

        this.toggleModeNextBtn.addEventListener('click', () => {
            if (this.video.readyState >= 1) {
                let p = (this.data.presetId + 1) % videoPresets.length
                setAttr(this.el, { [C_VID_STATE]: { presetId: p } })
                if (getSettings(ST.SAVE_PRESET)) {
                    Store.set(this.presetKey, p)
                }
            }
        })

        this.toggleModePrevBtn.addEventListener('click', () => {
            if (this.video.readyState >= 1) {
                const len = videoPresets.length
                let p = (this.data.presetId - 1 + len) % len
                setAttr(this.el, { [C_VID_STATE]: { presetId: p } })
                if (getSettings(ST.SAVE_PRESET)) {
                    Store.set(this.presetKey, p)
                }
            }
        })


        this.setupKeys(this.data.src)
        this.lastUpdate = Date.now()

        if (this.video.readyState >= 1) { this.onVideoLoad }

        this.video.addEventListener('loadedmetadata', this.onVideoLoad)
    },

    update: function (od) {
        var d = this.data

        // undefined when app starts
        if (od.src) {

            // new video selected
            if (od.src !== d.src) {
                this.setupKeys(d.src)
                this.video.src = d.src
                this.video.play()
            }

        }

        if (getSettings(ST.RESUME_VIDEO)) {
            this.video.addEventListener('timeupdate', this.saveVidTime)
        } else {
            this.video.removeEventListener('timeupdate', this.saveVidTime)
        }

        videoPresets[d.presetId].fn()
        let txt = `(${this.data.presetId + 1}/${videoPresets.length}) ${videoPresets[this.data.presetId].text}`
        this.toggleModeBtn.setAttribute("text", `value: ${txt}`)
    },

    onVideoLoad: function () {
        this.lastUpdate = Date.now()

        if (getSettings(ST.RESUME_VIDEO)) {
            let t = Store.get(this.timeKey)
            if (t) {
                this.video.currentTime = t
            }
        }

        if (getSettings(ST.SAVE_PRESET)) {
            let p = Store.get(this.presetKey)
            if (p !== null && p !== undefined) {
                p = Number(p)
                setAttr(this.el, { [C_VID_STATE]: { presetId: p } })
            }
        }
    },

    saveVidTime: function () {
        let now = Date.now()
        if (now - this.lastUpdate > 5000) {
            this.lastUpdate = now
            Store.set(this.timeKey, this.video.currentTime)
        }
    },

    setupKeys: function (src) {
        this.fileName = getFileName(src)
        this.presetKey = `VID_P_${this.fileName}`
        this.timeKey = `VID_T_${this.fileName}`
    },

    remove: function () {
        El.controls.removeChild(this.toggleModeBtn)
        this.video.removeEventListener('timeupdate', this.saveVidTime)
        this.video.removeEventListener('loadedmetadata', this.onVideoLoad)
    }

});