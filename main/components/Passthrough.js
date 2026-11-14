import { El } from "../elems.js"
import { createEl } from "../utils.js"
import { EV } from "./Events.js"
import { getSettings, ST } from "./settings/Settings.js"
import { CAMERA_BG_SHADER, cameraFovForZoom } from "./cameraBackground.js"

const PASSTHROUGH = 'passthrough'

const QUALITY = {
    low: { width: 640, height: 480, frameRate: 15 },
    medium: { width: 1280, height: 720, frameRate: 24 },
    high: { width: 1920, height: 1080, frameRate: 30 },
}

const constraints = (quality, facing) => {
    const q = QUALITY[quality] || QUALITY.medium
    const video = {
        width: { ideal: q.width },
        height: { ideal: q.height },
        frameRate: { ideal: q.frameRate },
    }
    if (facing && facing !== 'any') {
        video.facingMode = { ideal: facing }
    }
    return { audio: false, video }
}

AFRAME.registerComponent(PASSTHROUGH, {
    init: function () {
        this.token = 0
        this.stream = null
        this.starting = false
        this.aspect = 16 / 9
        this.video = El.passthroughVideo || document.getElementById('passthroughVideo')

        if (!this.video) {
            this.video = document.createElement('video')
            this.video.id = 'passthroughVideo'
            this.video.muted = true
            this.video.autoplay = true
            this.video.playsInline = true
            this.video.style.cssText = 'position:absolute;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none;'
            document.body.appendChild(this.video)
            El.passthroughVideo = this.video
        }

        this.sphere = createEl('a-entity', {
            geometry: 'primitive:sphere; radius: 150; segmentsWidth: 64; segmentsHeight: 32;',
            material: `shader: ${CAMERA_BG_SHADER}; src: #passthroughVideo; side: back; depthWrite: false;`,
        }, [], El.camera)
        this.sphere.object3D.visible = false

        this.onSettingsChange = AFRAME.utils.bind(this.onSettingsChange, this)
        this.onVideoMeta = AFRAME.utils.bind(this.onVideoMeta, this)
        this.onVideoPlaying = AFRAME.utils.bind(this.onVideoPlaying, this)
        El.events.addEventListener(EV.SETTINGS, this.onSettingsChange)
        this.video.addEventListener('loadedmetadata', this.onVideoMeta)
        this.video.addEventListener('playing', this.onVideoPlaying)

        this.applyView()
        this.sync(
            getSettings(ST.PASSTHROUGH),
            getSettings(ST.CAM_QUALITY),
            getSettings(ST.CAM_FACING)
        )
    },

    applyView: function () {
        if (!this.sphere) { return }
        this.sphere.setAttribute('material', {
            fov: cameraFovForZoom(getSettings(ST.CAM_ZOOM)),
            aspect: this.aspect || 16 / 9,
            offset: {
                x: Number(getSettings(ST.CAM_PAN) || 0) / 100,
                y: Number(getSettings(ST.CAM_TILT) || 0) / 100,
            },
            mirror: getSettings(ST.CAM_MIRROR) ? 1 : 0,
        })
    },

    onVideoMeta: function () {
        const w = this.video.videoWidth
        const h = this.video.videoHeight
        if (w && h) {
            this.aspect = w / h
            this.applyView()
        }
    },

    onVideoPlaying: function () {
        if (this.stream && this.sphere) {
            this.sphere.object3D.visible = true
        }
    },

    onSettingsChange: function (e) {
        this.applyView()
        this.sync(
            !!e.detail[ST.PASSTHROUGH],
            e.detail[ST.CAM_QUALITY],
            e.detail[ST.CAM_FACING]
        )
    },

    sync: function (enabled, quality, facing) {
        const q = quality || 'medium'
        const f = facing || 'environment'

        if (!enabled) {
            this.stop()
            return
        }

        if ((this.stream || this.starting) && this.quality === q && this.facing === f) {
            return
        }

        this.quality = q
        this.facing = f
        this.start()
    },

    start: async function () {
        this.stop()
        const token = ++this.token
        this.starting = true

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error('passthrough: camera API is not available (needs HTTPS or localhost)')
                return
            }

            const facing = this.facing || 'environment'
            const tries = [
                constraints(this.quality, facing),
                constraints(this.quality, 'any'),
                { audio: false, video: true },
            ]

            let stream = null
            let lastErr = null
            for (const c of tries) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(c)
                    break
                } catch (err) {
                    lastErr = err
                    if (err && (err.name === 'NotAllowedError' || err.name === 'SecurityError' || err.name === 'NotReadableError')) {
                        break
                    }
                }
            }

            if (token !== this.token) {
                if (stream) { stream.getTracks().forEach((track) => track.stop()) }
                return
            }

            if (!stream) {
                console.error('passthrough: failed to start camera', lastErr)
                this.sphere.object3D.visible = false
                return
            }

            this.stream = stream
            this.video.muted = true
            this.video.playsInline = true
            this.video.setAttribute('playsinline', '')
            this.video.srcObject = stream

            try {
                await this.video.play()
            } catch (err) {
                console.error('passthrough: camera stream could not play', err)
            }

            if (token !== this.token) {
                stream.getTracks().forEach((track) => track.stop())
                this.stream = null
                return
            }

            this.onVideoMeta()
            if (this.video.readyState >= 2) {
                this.sphere.object3D.visible = true
            }
        } finally {
            if (token === this.token) { this.starting = false }
        }
    },

    stop: function () {
        this.token++
        this.starting = false
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop())
            this.stream = null
        }
        if (this.video) {
            try { this.video.pause() } catch (e) { }
            this.video.srcObject = null
        }
        if (this.sphere) { this.sphere.object3D.visible = false }
    },

    remove: function () {
        this.stop()
        El.events.removeEventListener(EV.SETTINGS, this.onSettingsChange)
        if (this.video) {
            this.video.removeEventListener('loadedmetadata', this.onVideoMeta)
            this.video.removeEventListener('playing', this.onVideoPlaying)
        }
        if (this.sphere && this.sphere.parentNode) { this.sphere.parentNode.removeChild(this.sphere) }
    },
})
