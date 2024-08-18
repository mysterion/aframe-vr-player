AFRAME.registerComponent('btn-hide-controls', {
    init: function () {
        let el = this.el
        el.addEventListener('click', () => {
            el.sceneEl.systems.controls.hideControls()
        })
    }
});