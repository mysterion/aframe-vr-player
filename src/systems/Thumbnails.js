import { THUMB_ERROR, THUMB_LOADING, V_FILE_GET_URL, V_THUMB_URL } from "../components/Consts";
import { trimJoin } from "../utils";

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

AFRAME.registerSystem(THUMBNAILS, {
    init: function () {
        this.video = document.getElementById("video")
        this.textureLoader = new THREE.TextureLoader()
        this.thumbs = []
        this.error = ''
        this.loading = false

        this.thumbLoading = this.textureLoader.load(THUMB_LOADING)
        this.thumbError = this.textureLoader.load(THUMB_ERROR)

        this.video.addEventListener('loadedmetadata', () => this.processSrc())
        this.processSrc()
    },

    processSrc: function () {
        this.src = this.video.src
        this.current = trimJoin(V_THUMB_URL, this.src.replace(new RegExp(`^.*${V_FILE_GET_URL}`), ""))
        console.log(this.current)
        let len = Math.floor(this.video.duration / 60)
        this.loadFromUrl(this.current, len)
    },

    loadTexture: function(url) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(url, resolve, undefined, reject);
        });
    },

    // there may be a bug here :D
    // processing with a Queue could/maybe fix this?
    loadFromUrl: async function (url, len) {
        var err = ''
        var thumbs = []
        try {
            this.loading = true
            // wait for backend to finish generating thumbnails
            let response;
            let tries = 0
            while (true) {
                response = await fetch(url + "?id=0");
                if (response.status === 418) {
                    await delay(RETRY_SECONDS * 1000)
                    ++tries;
                    if (tries === RETRY) {
                        throw Error("Timedout while generating thumbnails")
                    }
                } else if (response.status === 200) {
                    break
                } else {
                    throw Error(`Response from backend - ${response.status} : ${response.body}`)
                }
            }

            for (let i = 0; i < len; i++) {
                const t = await this.loadTexture(`${url}?id=${i}`)
                thumbs.push(t)
            }


        } catch (e) {
            console.error(e)
            err = `${e}`
        } finally {
            if (this.current === url) {
                if (err.length > 0) {
                    this.error = err
                    this.disposeThumbs(thumbs, "Error while fetching thumbnails, disposing FETCHED thumbnails")
                } else {
                    this.disposeThumbs(this.thumbs, "No error Disposing PREVIOUS thumbnails")
                    this.thumbs = thumbs
                    this.error = ''
                }
                this.loading = false
            } else {
                //if another video been selected, while fetching the thumbnails
                // don't handle errors or update state(loading) as this is stale fn call
                this.disposeThumbs(thumbs, "Another video has been selected, disposing FETCHED thumbnails")
            }

        }
    },

    getThumb: function (i) {
        if (this.loading) {
            return this.thumbLoading
        }
        if (this.error.length > 0 || this.thumbs.length === 0) {
            return this.thumbError
        }
        
        if (i >= this.thumbs.length) i = this.thumbs.length - 1
        if (i < 0) i = 0

        return this.thumbs[i]
    },

    disposeThumbs: function (elems, dbgMsg) {
        if (dbgMsg) {
            console.debug(`Thumbnails: ${dbgMsg}`)
        }
        for (var i = 0; i < elems; ++i) {
            elems[i].dispose()
        }
    },

    remove: function () {
        this.thumbLoading.dispose()
        this.thumbError.dispose()
    }
});
