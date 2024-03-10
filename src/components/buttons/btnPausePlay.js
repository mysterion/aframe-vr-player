AFRAME.registerComponent('btn-pause-play', {
    init: function () {
        let el = this.el

        this.video = document.getElementById("video")

        this.pausePlay = () => {
            if (this.video.paused) {
                this.video.play()
            } else {
                this.video.pause()
            }
        }
        this.onPause = () => el.setAttribute("src", "#asset-vp-play")
        this.onPlay = () => el.setAttribute("src", "#asset-vp-pause")

        el.addEventListener('click', this.pausePlay)
        this.video.addEventListener("playing", this.onPlay)
        this.video.addEventListener("pause", this.onPause)
    },
    remove: function () {
        el.removeEventListener('click', this.pausePlay)
        this.video.removeEventListener("playing", this.onPlay)
        this.video.removeEventListener("pause", this.onPause)
    }
});