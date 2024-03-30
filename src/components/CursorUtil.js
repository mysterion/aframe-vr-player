import { createEl, setAttr } from "../utils";

AFRAME.registerComponent('cursor-util', {
    schema: {

    },

    init: function () {
        let el = this.el
        this.checkVR = AFRAME.utils.bind(this.checkVR, this)
        el.sceneEl.addEventListener('enter-vr', this.checkVR)
        el.sceneEl.addEventListener('exit-vr', this.checkVR)
        this.cursorChild = createEl('a-entity', {
            geometry: 'primitive: circle; radius: 0.2;',
            material: 'color: aquamarine; shader: flat'
        })
        this.checkVR()
    },

    checkVR: function () {
        let el = this.el
        if (AFRAME.utils.device.checkVRSupport()) {
            setAttr(el, {
                geometry: 'primitive: ring; radiusInner: 0.2; radiusOuter: 0.4',
                material: 'color: black; shader: flat',
            })
            el.appendChild(this.cursorChild)
        } else {
            el.setAttribute('cursor', 'rayOrigin: mouse')
            el.replaceChildren()
        }
    }
});