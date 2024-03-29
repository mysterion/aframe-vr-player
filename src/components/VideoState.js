import { E } from "../main"
import { PRESET } from "./env/EnvManager"

export const C_VID_STATE = 'video-state'

export const videoPresets = [
    {
        "text": "FLAT 2D S", "fn": () => {
            E.env.setAttribute('env-manager', { preset: PRESET.FLAT_2D_S })
        }
    },
    {
        "text": "FLAT 2D M", "fn": () => {
            E.env.setAttribute('env-manager', { preset: PRESET.FLAT_2D_M })
        }
    },
    {
        "text": "FLAT 2D L", "fn": () => {
            E.env.setAttribute('env-manager', { preset: PRESET.FLAT_2D_L })
        }
    },
    {
        "text": "180 SBS EQR", "fn": () => {
            E.env.setAttribute('env-manager', { preset: PRESET.EQ_180_SBS })
        }
    },
    {
        "text": "180 SBS FISH", "fn": () => {
            E.env.setAttribute('env-manager', { preset: PRESET.FE_180_SBS })
        }
    },
    {
        "text": "190 SBS FISH", "fn": () => {
            E.env.setAttribute('env-manager', { preset: PRESET.FE_190_SBS })
        }
    },
    {
        "text": "200 SBS FISH", "fn": () => {
            E.env.setAttribute('env-manager', { preset: PRESET.FE_200_SBS })
        }
    }

]

AFRAME.registerComponent(C_VID_STATE, {
    schema: {
        src: { type: 'string', default: 'static/sample.mp4' },
        fileName: { type: 'string', default: 'sample.mp4' },
        preset: { type: 'number', default: 0 },
    },

    init: function () {
        this.currentTime = AFRAME.utils.bind(this.currentTime, this)
    },

    update: function (od) {
        var d = this.data
        videoPresets[d.preset].fn()

        if (od.src !== d.src && od.src) {
            E.video.src = d.src
            E.video.play()
        }
        this.el.emit(C_VID_STATE, {
            data: d,
            od: od
        })
    },

});