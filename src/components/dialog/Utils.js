import { ControlsHidden, E_Controls } from "../../systems/Controls";

AFRAME.registerComponent('dialog-utils', {
    schema: {
        'screen': { 'type': 'string', 'default': '' }
    },

    init: function () {
        let el = this.el
        el.sceneEl.addEventListener(E_Controls, (e) => {
            if (e.detail !== ControlsHidden) return false
            el.object3D.visible = false
            el.removeAttribute('clickable')
            el.replaceChildren()
        })
    }
});