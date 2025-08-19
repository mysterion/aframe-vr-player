import { El } from "../../elems.js";
import { DIALOG_SETTINGS } from "../dialog/Settings.js";

AFRAME.registerComponent('btn-settings', {
    schema: {

    },

    init: function () {
        let el = this.el
        let d = El.dialog
        el.addEventListener('click', () => {
            if (d.hasAttribute(DIALOG_SETTINGS)) {
                if (d.object3D.visible) {
                    if (d.getAttribute('dialog-utils').screen === DIALOG_SETTINGS) {
                        d.removeAttribute('clickable')
                        d.replaceChildren()
                        d.object3D.visible = false
                    } else {
                        d.setAttribute(DIALOG_SETTINGS, { reRender: 'rerender' })
                    }
                } else {
                    d.setAttribute(DIALOG_SETTINGS, { reRender: 'rerender' })
                }
            } else {
                d.setAttribute(DIALOG_SETTINGS, '')
                d.object3D.visible = true
            }
        })
        // el.click()
    },
});