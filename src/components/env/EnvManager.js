import { El } from "../../main";
import { CTL_HIDDEN, CTL_SHOWN, CONTROLS } from "../../systems/Controls";
import { diff, setAttr } from "../../utils";
import { EV } from "../Events";
import { ST } from "../settings/Settings";


export const ENVS = {
    EQ: 'equirectangular',
    FE: 'fisheye',
    FLAT: 'flat'
}

export const PRESET = {
    EQ_180_SBS: 'EQ_180_SBS',
    FE_180_SBS: 'FE_180_SBS',
    FE_190_SBS: 'FE_190_SBS',
    FE_200_SBS: 'FE_200_SBS',
    FLAT_2D: 'FLAT_2D',
    FLAT_3D: 'FLAT_3D'
}


export const videoPresets = [
    {
        "text": "180 SBS EQR", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.EQ_180_SBS}` }) }
    },
    {
        "text": "FLAT 2D", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.FLAT_2D}` }) }
    },
    {
        "text": "180 SBS FISH", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.FE_180_SBS}` }) }
    },
    {
        "text": "190 SBS FISH", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.FE_190_SBS}` }) }
    },
    {
        "text": "200 SBS FISH", fn: () => { setAttr(El.env, { 'env-manager': `preset: ${PRESET.FE_200_SBS}` }) }
    }
]


export function presetToEnv(preset) {
    if (preset === null || preset === undefined) preset = ''
    for (let env in ENVS) {
        if (preset.startsWith(env)) {
            return ENVS[env]
        }
    }
}


AFRAME.registerComponent('env-manager', {
    schema: {
        preset: { type: 'string', default: PRESET.EQ_180_SBS },
        uiHidden: { type: 'boolean', default: false },
        defaultEye: { type: 'string', default: 'left' },
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
        this.el.setAttribute('env-manager', `defaultEye: ${eye}`)
    },

    update: function (od) {
        let d = this.data
        let el = this.el

        el.removeAttribute(presetToEnv(od.preset))

        switch (d.preset) {
            case PRESET.EQ_180_SBS:
                el.setAttribute(ENVS.EQ, { uiHidden: d.uiHidden, defaultEye: d.defaultEye })
                break
            case PRESET.FE_180_SBS:
                el.setAttribute(ENVS.FE, { uiHidden: d.uiHidden, defaultEye: d.defaultEye })
                break
            case PRESET.FE_190_SBS:
                el.setAttribute(ENVS.FE, { uiHidden: d.uiHidden, defaultEye: d.defaultEye, fov: 190 })
                break
            case PRESET.FE_200_SBS:
                el.setAttribute(ENVS.FE, { uiHidden: d.uiHidden, defaultEye: d.defaultEye, fov: 200 })
                break
            case PRESET.FLAT_2D:
                el.setAttribute(ENVS.FLAT, '')
                break
            default:
                console.error('preset not found')

        }

        let changes = Object.keys(diff(d, od))
        if (changes.every(val => ['uiHidden', 'defaultEye'].includes(val))) {
            // this subset of vals can be found in other events
        } else {
            El.events.emit(EV.ENVIRONMENT, d)
        }
    },

    onUIHide: function (e) {
        if (e.detail === CTL_HIDDEN) {
            this.el.setAttribute('env-manager', 'uiHidden: true')
        } else if (e.detail === CTL_SHOWN) {
            this.el.setAttribute('env-manager', 'uiHidden: false')
        }
    },

    remove: function () {
        El.events.removeEventListener(CONTROLS, this.onUIHide)
        El.events.removeEventListener(EV.SETTINGS, this.onEyeChange)

    }
});