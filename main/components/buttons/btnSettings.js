import { El } from "../../main.js";
import { DIALOG_SETTINGS } from "../dialog/Settings.js";

AFRAME.registerComponent('btn-settings', {
    schema: {

    },

    init: function () {
        let el = this.el
        el.addEventListener('click', () => {
            if (El.dialog.hasAttribute(DIALOG_SETTINGS)) {
                if (El.dialog.object3D.visible) {
                    if (El.dialog.getAttribute('dialog-utils').screen === DIALOG_SETTINGS) {
                        El.dialog.removeAttribute('clickable')
                        El.dialog.replaceChildren()
                        El.dialog.object3D.visible = false
                    } else {
                        El.dialog.setAttribute(DIALOG_SETTINGS, { reRender: 'rerender' })
                    }
                } else {
                    El.dialog.setAttribute(DIALOG_SETTINGS, { reRender: 'rerender' })
                }
            } else {
                El.dialog.setAttribute(DIALOG_SETTINGS, '')
                El.dialog.object3D.visible = true
            }
        })
        // el.click()
    },
});