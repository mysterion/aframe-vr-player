AFRAME.registerComponent('btn-hide-controls', {
    init: function () {
        let el = this.el
        const rightEye = document.getElementById('rightEye')
        el.addEventListener('click', () => {
            rightEye.setAttribute('visible', true)
            el.sceneEl.systems.controls.hideControls()
        })
    }
});