const ENVS = {
    EQ: 'equirectangular',
    FE: 'fisheye'
}

export const PRESET = {
    EQ_180_SBS: 'EQ_180_SBS',
    FE_180_SBS: 'FE_180_SBS'
}

AFRAME.registerComponent('env-manager', {
    schema: {
        mode: { type: 'string', default: PRESET.EQ_180_SBS }
    },

    init: function () {
        this.currentMode = null
    },

    update: function (od) {
        let d = this.data
        let el = this.el
        if (this.currentMode !== null) {
            el.removeAttribute(this.currentMode)
        }
        switch (d.mode) {
            case PRESET.EQ_180_SBS:
                el.setAttribute(ENVS.EQ, '')
                this.currentMode = ENVS.EQ
                break
            case PRESET.FE_180_SBS:
                el.setAttribute(ENVS.FE, '')
                this.currentMode = ENVS.FE
                break
            default:
                console.error('preset not found')

        }
    },
});