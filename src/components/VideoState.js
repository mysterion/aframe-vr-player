import { E } from "../main"

export const C_VID_STATE = 'video-state'

export const videoPresets = [
    {
        "text": "180 SBS EQR", "fn": () => {
            leftEye.setAttribute("stereosphere", "mode: 180SbsEq;")
            rightEye.setAttribute("stereosphere", "mode: 180SbsEq;")
        }
    },
    {
        "text": "180 SBS FISH", "fn": () => {
            leftEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 180")
            rightEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 180")
        }
    },
    {
        "text": "190 SBS FISH", "fn": () => {
            leftEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 190")
            rightEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 190")
        }
    },
    {
        "text": "200 SBS FISH", "fn": () => {
            leftEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 200")
            rightEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 200")
        }
    }
]

AFRAME.registerComponent(C_VID_STATE, {
    schema: {
        src: { type: 'string', default: 'static/sample.mp4' },
        fileName: { type: 'string', default: 'sample.mp4' },
        preset: { type: 'number', default: 0 },
    },

    init: function () {
        this.currentTime = AFRAME.utils.bind(this.currentTime, this)
    },

    update: function (od) {
        var d = this.data
        videoPresets[d.preset].fn()

        if (od.src !== d.src && od.src) {
            E.video.src = d.src
            E.video.play()
        }
        this.el.emit(C_VID_STATE, {
            data: d,
            od: od
        })
    },
});