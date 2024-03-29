import { E } from "../../main";
import { Store } from "../../store";
import { C_VID_STATE } from "../VideoState";

export const C_AS_VIDEO = 'apply-settings-vid'

AFRAME.registerComponent(C_AS_VIDEO, {
    schema: {
        time: { type: 'boolean', default: false },
        defaultPreset: { type: 'number', default: 0 },
        savePreset: { type: 'boolean', default: true }
    },
    init: function () {
        this.timeKey = ''
        this.presetKey = ''
        this.videoName = ''
        this.lastUpdate = Date.now()

        this.onVideoLoad = AFRAME.utils.bind(this.onVideoLoad, this)
        this.saveVidTime = AFRAME.utils.bind(this.saveVidTime, this)
        this.onVideoStateChange = AFRAME.utils.bind(this.onVideoStateChange, this)

        if (E.video.readyState >= 1) {
            this.videoName = E.ascene.getAttribute(C_VID_STATE).fileName
            this.timeKey = `VID_T_${this.videoName}`
            this.presetKey = `VID_P_${this.videoName}`
        }
        E.video.addEventListener('loadedmetadata', this.onVideoLoad)
        E.ascene.addEventListener(C_VID_STATE, this.onVideoStateChange)
    },

    update: function (od) {
        var d = this.data

        if (d.time) {
            E.video.addEventListener('timeupdate', this.saveVidTime)
        } else {
            E.video.removeEventListener('timeupdate', this.saveVidTime)
        }
    },

    remove: function () {
        // console.log("listeners removed")
        E.video.removeEventListener('timeupdate', this.saveVidTime)
        E.video.removeEventListener('loadedmetadata', this.onVideoLoad)
    },

    onVideoLoad: function () {
        this.videoName = E.ascene.getAttribute(C_VID_STATE).fileName
        this.timeKey = `VID_T_${this.videoName}`
        this.presetKey = `VID_P_${this.videoName}`
        this.lastUpdate = Date.now()

        if (this.data.time) {
            let t = Store.get(this.timeKey)
            if (t) {
                E.video.currentTime = t
            }
        }
    },

    onVideoStateChange: function (e) {
        if (this.data.savePreset) {
            let { data, od } = e.detail
            let presetKey = `VID_P_${data.fileName}`
            if (data.fileName !== od.fileName) { // first time
                let p = Store.get(presetKey)
                if (p !== null && p !== undefined) {
                    // console.log("first time", "get", data.fileName, p)
                    E.ascene.setAttribute(C_VID_STATE, { preset: p })
                } else {
                    // console.log("first time", "setDefault", data.fileName, this.data.defaultPreset)
                    E.ascene.setAttribute(C_VID_STATE, { preset: this.data.defaultPreset })
                }
            } else { // toggle presets
                // console.log("changing", "set", data.fileName, data.preset)
                Store.set(presetKey, data.preset)
            }
        } else {
            E.ascene.setAttribute(C_VID_STATE, { preset: this.data.defaultPreset })
        }
    },

    saveVidTime: function () {
        let now = Date.now()
        if (now - this.lastUpdate > 5000) {
            this.lastUpdate = now
            // console.log('saving', this.timeKey, E.video.currentTime)
            Store.set(this.timeKey, E.video.currentTime)
        }
    }
});