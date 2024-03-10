AFRAME.registerComponent('adjust-camera', {
    init: function () {
        let el = this.el
        el.sceneEl.addEventListener('enter-vr', function () {
            // in vr mode acamera position.y is set to 1.6
            el.setAttribute("position", { y: -1.6 })
        });
        el.sceneEl.addEventListener('exit-vr', function () {
            el.setAttribute("position", { y: 0 })
        });
    },
});