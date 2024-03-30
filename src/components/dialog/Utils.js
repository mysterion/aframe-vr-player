import { El } from "../../main";
import { CTL_HIDDEN, CONTROLS } from "../../systems/Controls";

AFRAME.registerComponent('dialog-utils', {
    schema: {
        'screen': { 'type': 'string', 'default': '' }
    },

    init: function () {
        let el = this.el
        El.events.addEventListener(CONTROLS, (e) => {
            if (e.detail !== CTL_HIDDEN) return false
            el.object3D.visible = false
            el.removeAttribute('clickable')
            el.replaceChildren()
        })
    }
});

export const DWidth = 60
export const DHeight = 30
