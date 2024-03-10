AFRAME.registerComponent('cursor-util', {
    schema: {

    },

    init: function () {
        let el = this.el
        this.cursorChild = document.createElement('a-entity')
        this.cursorChild.setAttribute('geometry', 'primitive: circle; radius: 0.0075;')
        this.cursorChild.setAttribute('material', 'color: teal')
        el.removeAttribute('geometry')
        console.log('initialized cursor-util')
        this.checkVR()
        el.sceneEl.addEventListener('enter-vr', AFRAME.utils.bind(this.checkVR, this))
        el.sceneEl.addEventListener('exit-vr', AFRAME.utils.bind(this.checkVR, this))
    },

    checkVR: function () {
        let el = this.el
        if (AFRAME.utils.device.checkVRSupport()) {
            el.setAttribute('geometry', 'primitive: ring; radiusInner: 0.005; radiusOuter: 0.0075;')
            el.setAttribute('material', 'color: white;')
            el.appendChild(this.cursorChild)
        } else {
            el.setAttribute('cursor', 'rayOrigin: mouse')
            el.replaceChildren()
        }
    }
});