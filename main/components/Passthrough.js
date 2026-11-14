import { El } from "../elems.js"
import { createEl } from "../utils.js"
import { EV } from "./Events.js"
import { getSettings, ST } from "./settings/Settings.js"

const PASSTHROUGH = 'passthrough'

const QUALITY = {
    low: { width: 640, height: 480, frameRate: 15 },
    medium: { width: 1280, height: 720, frameRate: 24 },
    high: { width: 1920, height: 1080, frameRate: 30 },
}

const constraints = (quality) => {
    const q = QUALITY[quality] || QUALITY.medium
    return {
        audio: false,
        video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: q.width },
            height: { ideal: q.height },
            frameRate: { ideal: q.frameRate },
        },
    }
}

AFRAME.registerComponent(PASSTHROUGH, {
    init: function () {
        this.token = 0
        this.stream = null
        this.video = El.passthroughVideo

        this.sphere = createEl('a-entity', {
            geometry: 'primitive:sphere; radius: 150; segmentsWidth: 48; segmentsHeight: 24;',
            material: 'shader: flat; src: #passthroughVideo; side: back; depthWrite: false;',
        }, [], El.camera)
        this.sphere.object3D.visible = false

        this.onSettingsChange = AFRAME.utils.bind(this.onSettingsChange, this)
        El.events.addEventListener(EV.SETTINGS, this.onSettingsChange)

        this.sync(getSettings(ST.PASSTHROUGH), getSettings(ST.CAM_QUALITY))
    },

    onSettingsChange: function (e) {
        this.sync(!!e.detail[ST.PASSTHROUGH], e.detail[ST.CAM_QUALITY])
    },

    sync: function (enabled, quality) {
        if (enabled) {
            if (!this.stream || this.quality !== quality) {
                this.quality = quality
                this.start()
            }
        } else if (this.stream || this.sphere.object3D.visible) {
            this.stop()
        }
    },

    start: async function () {
        this.stop()
        const token = ++this.token

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('passthrough: camera API is not available')
            return
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints(this.quality))
            if (token !== this.token) {
                stream.getTracks().forEach((track) => track.stop())
                return
            }

            this.stream = stream
            this.video.srcObject = stream
            this.video.muted = true
            this.video.playsInline = true
            await this.video.play().catch(() => { })
            this.sphere.object3D.visible = true
        } catch (err) {
            console.error('passthrough: failed to start camera', err)
            this.sphere.object3D.visible = false
        }
    },

    stop: function () {
        this.token++
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop())
            this.stream = null
        }
        if (this.video) { this.video.srcObject = null }
        if (this.sphere) { this.sphere.object3D.visible = false }
    },

    remove: function () {
        this.stop()
        El.events.removeEventListener(EV.SETTINGS, this.onSettingsChange)
        if (this.sphere.parentNode) { this.sphere.parentNode.removeChild(this.sphere) }
    },
})
