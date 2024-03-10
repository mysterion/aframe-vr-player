import { C_FILES } from "../dialog/Files";

AFRAME.registerComponent('btn-open-file', {
    schema: {

    },

    init: function () {
        let el = this.el
        let dialog = document.getElementById('dialog')
        el.addEventListener('click', () => {
            if (import.meta.env.VITE_WEB) {
                openSingleFile()
                return
            }
            if (dialog.hasAttribute(C_FILES)) {
                if (dialog.object3D.visible) {
                    if (dialog.getAttribute('dialog-utils').screen === C_FILES) {
                        dialog.removeAttribute('clickable')
                        dialog.replaceChildren()
                        dialog.object3D.visible = false
                    } else {
                        dialog.setAttribute(C_FILES, { reRender: 'rerender' })
                    }
                } else {
                    dialog.setAttribute(C_FILES, { reRender: 'rerender' })
                }
            } else {
                dialog.setAttribute(C_FILES, '')
                dialog.object3D.visible = true
            }
        })
    },
});