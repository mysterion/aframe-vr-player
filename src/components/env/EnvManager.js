import { ControlsHidden, ControlsShown, E_Controls } from "../../systems/Controls";

const ENVS = {
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

function presetToMode(preset) {
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
        this.currentMode = ENVS.EQ // default
        this.onUIHide = AFRAME.utils.bind(this.onUIHide, this)
        this.el.sceneEl.addEventListener(E_Controls, this.onUIHide)
    },

    update: function (od) {
        let d = this.data
        let el = this.el
        if (this.currentMode !== presetToMode(d.preset)) {
            el.removeAttribute(this.currentMode)
        }
        switch (d.preset) {
            case PRESET.EQ_180_SBS:
                el.setAttribute(ENVS.EQ, { uiHidden: d.uiHidden, defaultEye: d.defaultEye })
                this.currentMode = ENVS.EQ
                break
            case PRESET.FE_180_SBS:
                el.setAttribute(ENVS.FE, { uiHidden: d.uiHidden, defaultEye: d.defaultEye })
                this.currentMode = ENVS.FE
                break
            case PRESET.FE_190_SBS:
                el.setAttribute(ENVS.FE, { uiHidden: d.uiHidden, defaultEye: d.defaultEye, fov: 190 })
                this.currentMode = ENVS.FE
                break
            case PRESET.FE_200_SBS:
                el.setAttribute(ENVS.FE, { uiHidden: d.uiHidden, defaultEye: d.defaultEye, fov: 200 })
                this.currentMode = ENVS.FE
                break
            case PRESET.FLAT_2D:
                el.setAttribute(ENVS.FLAT, '')
                this.currentMode = ENVS.FLAT
                break
            default:
                console.error('preset not found')

        }
    },

    onUIHide: function (e) {
        if (e.detail === ControlsHidden) {
            this.el.setAttribute('env-manager', 'uiHidden: true')
        } else if (e.detail === ControlsShown) {
            this.el.setAttribute('env-manager', 'uiHidden: false')
        }
    }
});