import { THUMB_ERROR, THUMB_LOADING, V_FILE_GET_URL, V_THUMB_URL } from "../components/Consts";

export const THUMBNAILS = 'thumbnails'

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

AFRAME.registerComponent(THUMBNAILS, {
    init: function () {
    },

    remove: function () {
    }
});

const RETRY = 24
const RETRY_SECONDS = 5

// TODO: FUTURE - use THREE.TextureLoader)blob urls) and dispose(revoke) for the textures
// https://stackoverflow.com/a/16070490

AFRAME.registerSystem(THUMBNAILS, {
    init: function () {
        this.video = document.getElementById("video")
        this.processSrc = AFRAME.utils.bind(this.processSrc, this)
        this.loadFromUrl = AFRAME.utils.bind(this.loadFromUrl, this)
        this.get = AFRAME.utils.bind(this.get, this)
        this.revokeUrls = AFRAME.utils.bind(this.revokeUrls, this)

        this.thumbs = []
        this.error = ''
        this.loading = false

        this.video.addEventListener('loadedmetadata', this.processSrc)
        this.processSrc()
    },

    processSrc: function () {
        this.src = this.video.src
        this.current = `${V_THUMB_URL}/${this.src.replace(V_FILE_GET_URL, "")}`
        let len = Math.floor(this.video.duration / 60)
        console.log('thumbnails len: ' + len)
        this.loadFromUrl(this.current, len)
    },

    // there may be a bug here :D
    // processing with a Queue would fix this
    loadFromUrl: async function (url, len) {
        try {
            this.loading = true
            var thumbs = []

            for (let i = 0; i < len; i++) {
                let response = await fetch(url + `?id=${i}`);
                if (i === 0) {
                    let tries = 0
                    while (response.status === 418 && tries < RETRY) {
                        delay(RETRY_SECONDS * 1000)
                        ++tries;
                        response = await fetch(url + `?id=${i}`);
                    }
                }

                let blob = await response.blob();
                let imageUrl = URL.createObjectURL(blob);

                thumbs.push({
                    url: imageUrl,
                    blob: blob
                })

            }

        } catch (err) {
            console.error(err)
            this.error = `${err}`
            this.revokeUrls(thumbs)
        } finally {
            if (this.current === url) {
                this.revokeUrls(this.thumbs)
                this.thumbs = thumbs
                this.loading = false
            } else {
                //if another video been selected, while fetching the thumbnails
                this.revokeUrls(thumbs)
            }
        }
    },

    get: function (i) {
        if (this.loading) {
            return THUMB_LOADING
        }
        if (this.error.length > 0 || this.thumbs.length === 0) {
            return THUMB_ERROR
        }
        
        if (i >= this.thumbs.length) i = this.thumbs.length - 1
        if (i < 0) i = 0

        return this.thumbs[i].url
    },

    revokeUrls: function (elems) {
        for (var i = 0; i < elems; ++i) {
            URL.revokeObjectURL(elems[i].url)
        }
    }
});
