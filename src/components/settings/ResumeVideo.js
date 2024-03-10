import { Store } from "../../store";
import { getFileName } from "../../utils"

export const C_AS_RES_VID = 'apply-settings-res-vid'

AFRAME.registerComponent(C_AS_RES_VID, {
    init: function () {
        this.saveKey = ''
        this.videoName = ''
        this.lastUpdate = Date.now()

        this.video = document.getElementById('video')


        this.onVideoLoad = AFRAME.utils.bind(this.onVideoLoad, this)
        this.saveVidTime = AFRAME.utils.bind(this.saveVidTime, this)

        if (this.video.readyState >= 1) {
            this.videoName = getFileName(video.src)
            this.saveKey = `VID_T_${this.videoName}`
        }

        this.video.addEventListener('timeupdate', this.saveVidTime)
        this.video.addEventListener('loadedmetadata', this.onVideoLoad)
    },
    remove: function () {
        // console.log("listeners removed")
        this.video.removeEventListener('timeupdate', this.saveVidTime)
        this.video.removeEventListener('loadedmetadata', this.onVideoLoad)
    },

    onVideoLoad: function () {
        this.videoName = getFileName(video.src)
        this.saveKey = `VID_T_${this.videoName}`
        this.lastUpdate = Date.now()
        let t = Store.get(this.saveKey)
        if (t) {
            // console.log("restoring time: " + this.videoName + " " + t)
            this.video.currentTime = t
        }
    },

    saveVidTime: function () {
        let now = Date.now()
        if (now - this.lastUpdate > 5000) {
            this.lastUpdate = now
            // console.log('saving', this.saveKey, this.video.currentTime)
            Store.set(this.saveKey, this.video.currentTime)
        }
    }
});