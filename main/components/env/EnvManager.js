import { El } from "../../main.js";
import { CTL_HIDDEN, CTL_SHOWN, CONTROLS } from "../../systems/Controls.js";
import { setAttr } from "../../utils.js";
import { EV } from "../Events.js";
import { ST } from "../settings/Settings.js";
import { PRESET } from "./constants.js";

export const videoPresets = [
    {
        "text": "SBS 180 EQR", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.SBS_180_EQR}` }) }
    },
    {
        "text": "SBS 180 FE", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.SBS_180_FE}` }) }
    },
    {
        "text": "FLAT 2D", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.FLAT_2D}` }) }
    },
    {
        "text": "MONO 180 EQR", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.M_180_EQR}` }) }
    },
    {
        "text": "MONO 360 EQR", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.M_360_EQR}` }) }
    },
    {
        "text": "MONO 180 FE", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.M_180_FE}` }) }
    },
]

AFRAME.registerComponent('env-manager', {
    schema: {
        preset: { type: 'string', default: PRESET.M_180_EQR },
    },

    init: function () {
        var d = this.data
        this.onEyeChange = AFRAME.utils.bind(this.onEyeChange, this)
        this.onUIHide = AFRAME.utils.bind(this.onUIHide, this)
        El.events.addEventListener(CONTROLS, this.onUIHide)
        El.events.addEventListener(EV.SETTINGS, this.onEyeChange)
    },

    onEyeChange: function (e) {
        let eye = e.detail[ST.DEF_EYE]
        this.el.setAttribute(this.data.preset, `defaultEye: ${eye}`)
    },

    onUIHide: function (e) {
        if (e.detail === CTL_HIDDEN) {
            this.el.setAttribute(this.data.preset, 'uiHidden: true')
        } else if (e.detail === CTL_SHOWN) {
            this.el.setAttribute(this.data.preset, 'uiHidden: false')
        }
    },

    update: function (od) {
        let d = this.data
        let el = this.el

        if (d.preset !== od.preset) {
            el.removeAttribute(od.preset)
            el.setAttribute(d.preset, { uiHidden: d.uiHidden, defaultEye: d.defaultEye })
        }

        El.events.emit(EV.ENVIRONMENT, d)
    },


    remove: function () {
        El.events.removeEventListener(CONTROLS, this.onUIHide)
        El.events.removeEventListener(EV.SETTINGS, this.onEyeChange)
    }
});