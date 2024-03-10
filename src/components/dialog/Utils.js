import { ControlsHidden } from "../../systems/Controls";

AFRAME.registerComponent('dialog-utils', {
    schema: {
        'screen': { 'type': 'string', 'default': '' }
    },

    init: function () {
        let el = this.el
        el.sceneEl.addEventListener(ControlsHidden, () => {
            el.object3D.visible = false
            el.removeAttribute('clickable')
            el.replaceChildren()
        })
    }
});