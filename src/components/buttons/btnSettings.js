import { C_SETTINGS } from "../dialog/Settings";

AFRAME.registerComponent('btn-settings', {
    schema: {

    },

    init: function () {
        let el = this.el
        let dialog = document.getElementById('dialog')
        el.addEventListener('click', () => {
            if (dialog.hasAttribute(C_SETTINGS)) {
                if (dialog.object3D.visible) {
                    if (dialog.getAttribute('dialog-utils').screen === C_SETTINGS) {
                        dialog.removeAttribute('clickable')
                        dialog.replaceChildren()
                        dialog.object3D.visible = false
                    } else {
                        dialog.setAttribute(C_SETTINGS, { reRender: 'rerender' })
                    }
                } else {
                    dialog.setAttribute(C_SETTINGS, { reRender: 'rerender' })
                }
            } else {
                dialog.setAttribute(C_SETTINGS, '')
                dialog.object3D.visible = true
            }
        })
        // el.click()
    },
});