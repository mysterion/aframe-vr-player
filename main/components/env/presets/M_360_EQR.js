import { createEl } from "../../../utils.js";
import { PRESET } from "../constants.js";

AFRAME.registerComponent(PRESET.M_360_EQR, {
    schema: {
        defaultEye: { type: 'string', default: 'left' },
        detail: { type: 'number', default: 32 },
        uiHidden: { type: 'boolean', default: false },
    },

    init: function () {
        this.eye = createEl('a-entity', {
            geometry: `primitive:sphere; radius: 100; segmentsWidth: ${this.data.detail}; segmentsHeight: ${this.data.detail}; phiStart: 0; phiLength: 360; thetaStart: 0; thetaLength: 180;`,
            material: "shader: flat; src: #video; side: back;",
            scale: "-1 1 1",
            rotation: "0 -90 0"
        })

        this.el.append(this.eye)
    },

    remove: function () {
        this.el.removeChild(this.eye)
    },

});