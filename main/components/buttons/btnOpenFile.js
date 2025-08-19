import { El } from "../../elems.js";
import { C_FILES } from "../dialog/Files.js";

AFRAME.registerComponent('btn-open-file', {
    schema: {

    },

    init: function () {
        let el = this.el
        let d = El.dialog
        // old web build
        // if (import.meta.env.VITE_WEB) {
        //     setupWebFileInput()
        //     el.addEventListener('click', (e) => {
        //         El.file.click()
        //     })
        //     return
        // }
        el.addEventListener('click', () => {
            if (d.hasAttribute(C_FILES)) {
                if (d.object3D.visible) {
                    if (d.getAttribute('dialog-utils').screen === C_FILES) {
                        d.removeAttribute('clickable')
                        d.replaceChildren()
                        d.object3D.visible = false
                    } else {
                        d.setAttribute(C_FILES, { reRender: 'rerender' })
                    }
                } else {
                    d.setAttribute(C_FILES, { reRender: 'rerender' })
                }
            } else {
                d.setAttribute(C_FILES, '')
                d.object3D.visible = true
            }
        })

        //REM:
        el.click()
    },
})