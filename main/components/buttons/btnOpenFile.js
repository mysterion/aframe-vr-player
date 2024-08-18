import { El } from "../../main.js";
import { getElem } from "../../utils.js";
import { setupWebFileInput } from "../../web/setupFileInput.js";
import { C_FILES } from "../dialog/Files.js";

AFRAME.registerComponent('btn-open-file', {
    schema: {

    },

    init: function () {
        let el = this.el
        let dialog = getElem('dialog')
        // old web build
        // if (import.meta.env.VITE_WEB) {
        //     setupWebFileInput()
        //     el.addEventListener('click', (e) => {
        //         El.file.click()
        //     })
        //     return
        // }
        el.addEventListener('click', () => {
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

        //REM:
        el.click()
    },
})