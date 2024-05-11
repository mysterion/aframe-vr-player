import { V_FILE_GET_URL, V_THUMB_URL } from "../components/Consts";
import { El } from "../main";

export const THUMBNAILS = 'thumbnails'
const THUMB_LOADING = '/static/loading.jpg'

AFRAME.registerComponent(THUMBNAILS, {
    init: function () {
        // this.system.register(this.el)
    },

    remove: function () {
        // this.system.unregister(this.el);
    }
});

AFRAME.registerSystem(THUMBNAILS, {
    init: function () {

        this.current = `${V_THUMB_URL}/${El.video.src.replace(V_FILE_GET_URL, "")}`

        this.thumbs = {
            'url': {
                'loading': true,
                'error': '',
                'images': [],
            }
        }

        this.thumbLog = []

        this.thumbSweepCount = 5

        El.video.addEventListener('loadedmetadata', () => {
            this.current = `${V_THUMB_URL}/${El.video.src.replace(V_FILE_GET_URL, "")}`
            let len = Math.floor(El.video.duration / 60)
            console.log('thumbnails len: ' + len)
            this.loadFromUrl(this.current, len)
            this.thumbLog.push(this.current)
        })

    },

    loadFromUrl: function (url, len) {
        if (this.thumbs[url]) {
            if (this.thumbs[url].loading) {
                return
            }
        }
        this.thumbLog.push(url)
    },

    unregister: function (el) {
        var index = this.entities.indexOf(el)
        this.entities.splice(index, 1)
    },

    hideControls: function () {
        for (let i in this.entities) {
            let e = this.entities[i]
            this.clickables.push(e.hasAttribute('clickable'))
            if (this.clickables.at(-1)) {
                e.removeAttribute('clickable')
            }
            e.object3D.visible = false
        }

        El.events.emit(CONTROLS, CTL_HIDDEN, false)
    },

    showControls: function () {
        for (let i in this.entities) {
            let e = this.entities[i]
            if (this.clickables[i]) {
                e.setAttribute('clickable', '')
            }
            e.object3D.visible = true
        }
        this.clickables = []
        El.events.emit(CONTROLS, CTL_SHOWN, false)
    }
});
