import { ControlsHidden, ControlsShown, E_Controls } from "../../systems/Controls";

const ENVS = {
    EQ: 'equirectangular',
    FE: 'fisheye'
}

export const PRESET = {
    EQ_180_SBS: 'EQ_180_SBS',
    FE_180_SBS: 'FE_180_SBS'
}

export const ViewAngles = [0, 30, 45, 60, 90, 60, 45, 30]

AFRAME.registerComponent('env-manager', {
    schema: {
        mode: { type: 'string', default: PRESET.EQ_180_SBS },
        uiHidden: { type: 'boolean', default: false },
        defaultEye: { type: 'string', default: 'left' },
        viewAngle: { type: 'number', default: 0 }
    },

    init: function () {
        this.currentMode = null
        this.onUIHide = AFRAME.utils.bind(this.onUIHide, this)
        this.el.sceneEl.addEventListener(E_Controls, this.onUIHide)
    },

    update: function (od) {
        let d = this.data
        let el = this.el
        el.setAttribute('rotation', { x: ViewAngles[d.viewAngle] })
        if (this.currentMode !== null && this.currentMode !== od.mode) {
            el.removeAttribute(this.currentMode)
        }
        switch (d.mode) {
            case PRESET.EQ_180_SBS:
                el.setAttribute(ENVS.EQ, { uiHidden: d.uiHidden, defaultEye: d.defaultEye })
                this.currentMode = ENVS.EQ
                break
            case PRESET.FE_180_SBS:
                el.setAttribute(ENVS.FE, { uiHidden: d.uiHidden, defaultEye: d.defaultEye })
                this.currentMode = ENVS.FE
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