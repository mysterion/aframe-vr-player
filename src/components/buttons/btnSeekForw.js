AFRAME.registerComponent('btn-seek-forw', {
    init: function () {
        let el = this.el
        this.video = document.getElementById("video")
        el.addEventListener('click', () => {
            this.video.currentTime += 15
        })
    },
});