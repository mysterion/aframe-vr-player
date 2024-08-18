
AFRAME.registerComponent('cursor-util', {
    schema: {

    },

    init: function () {
        let el = this.el
        this.checkVR = AFRAME.utils.bind(this.checkVR, this)
        el.sceneEl.addEventListener('enter-vr', this.checkVR)
        el.sceneEl.addEventListener('exit-vr', this.checkVR)
        this.checkVR()
    },

    checkVR: function () {
        if (!AFRAME.utils.device.checkVRSupport()) {
            this.el.setAttribute('cursor', 'rayOrigin: mouse')
        }
    }
});