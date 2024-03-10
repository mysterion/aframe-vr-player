const leftEye = document.getElementById('leftEye')
const rightEye = document.getElementById('rightEye')
export const videoModes = [
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

AFRAME.registerComponent('toggle-mode', {
    schema: {
        mode: { type: 'number', default: 0 },
        toggle: { type: 'string', default: '' }
    },

    init: function () {
        this.el.addEventListener('click', () => {
            this.el.setAttribute('toggle-mode', { toggle: 'toggle' })
        })
    },

    update: function (od) {
        let el = this.el
        let d = this.data
        if (d.toggle.length > 0) {
            el.setAttribute('toggle-mode', { toggle: '', mode: ((od.mode + 1) % videoModes.length) })
            return
        }
        let { text, fn } = videoModes[d.mode % videoModes.length]
        fn.call()
        el.setAttribute("value", text)
    },

    remove: function () {
    },

    tick: function (time, timeDelta) {
    }
});