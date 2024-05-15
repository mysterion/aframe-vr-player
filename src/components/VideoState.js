import { El } from "../main";
import { Store } from "../store"
import { createEl, getFileName, setAttr } from "../utils";
import { videoPresets } from "./env/EnvManager";
import { ST, getSettings } from "./settings/Settings"

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
            clickable: '',
            controls: '',
            material: 'color: #808080; opacity: 1',
            geometry: 'primitive:plane; width:15; height: 3',
            'button-highlight': '',
        }, [], El.controls)

        this.toggleModeBtnTxt = createEl('a-text', {
            value: videoPresets[this.data.presetId].text,
            width: 40,
            align: 'center',
            position: '0 0 0.5'
        }, [], this.toggleModeBtn)

        this.toggleBtnHandler = AFRAME.utils.bind(this.toggleBtnHandler, this)
        this.toggleModeBtn.addEventListener('click', this.toggleBtnHandler)

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
        this.toggleModeBtnTxt.setAttribute("value", videoPresets[d.presetId].text)
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
                setAttr(this.el, { [C_VID_STATE]: { presetId: p } })
            }
        }
    },

    toggleBtnHandler: function () {
        if (this.video.readyState >= 1) {
            let p = (this.data.presetId + 1) % videoPresets.length
            setAttr(this.el, { [C_VID_STATE]: { presetId: p } })
            if (getSettings(ST.SAVE_PRESET)) {
                Store.set(this.presetKey, p)
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