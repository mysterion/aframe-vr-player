import { createEl } from "../../utils.js";

AFRAME.registerComponent('marq-text', {
    schema: {
        value: { type: 'string', default: '' },
        limit: { type: 'number', default: 30 },
    },

    init: function () {
        this.timerId = null
        this.st = 0
        this.marquee = AFRAME.utils.bind(this.marquee, this)
        this.startAnim = AFRAME.utils.bind(this.startAnim, this)
        this.stopAnim = AFRAME.utils.bind(this.stopAnim, this)

        this.txt = createEl("a-text", {
            "align": "center",
            "width": "35",
            "position": "0 0 1",
            "z-offset": "0.2"
        })

        this.el.appendChild(this.txt)

    },

    update: function () {
        this.txt.setAttribute('value', this.data.value.substring(this.st, this.st + this.data.limit))
        if (this.data.value.length > this.data.limit) {
            this.el.addEventListener('raycaster-intersected', this.startAnim)
            this.el.addEventListener('raycaster-intersected-cleared', this.stopAnim)
        } else {
            this.el.removeEventListener('raycaster-intersected', this.startAnim)
            this.el.removeEventListener('raycaster-intersected-cleared', this.stopAnim)
            this.stopAnim()
        }
    },

    remove: function () {
        clearInterval(this.timerId)
        this.el.removeEventListener('raycaster-intersected', this.startAnim)
        this.el.removeEventListener('raycaster-intersected-cleared', this.stopAnim)
    },

    startAnim: function () {
        clearInterval(this.timerId)
        this.timerId = setInterval(this.marquee, 200)
    },

    stopAnim: function () {
        this.st = 0
        this.txt.setAttribute('value', this.data.value.substring(this.st, this.st + this.data.limit))
        clearInterval(this.timerId)
    },

    marquee: function () {
        this.st = (this.st + 1) % this.data.value.length
        if (this.data.value.length - this.st < this.data.limit / 2) this.st = 0
        this.txt.setAttribute('value', this.data.value.substring(this.st, this.st + this.data.limit))
    }

});