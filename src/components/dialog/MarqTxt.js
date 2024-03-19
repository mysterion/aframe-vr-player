import { createEl } from "../../utils";

AFRAME.registerComponent('marq-text', {
    schema: {
        value: { type: 'string', default: '' },
        limit: { type: 'number', default: 30 },
    },

    init: function () {
        this.timerId = null
        this.st = 0
        this.marquee = AFRAME.utils.bind(this.marquee, this)
        this.txt = createEl("a-text", {
            "align": "center",
            "width": "35",
            "position": "0 0 1"
        })
        this.el.appendChild(this.txt)

        if (this.data.value.length > this.data.limit) {
            this.el.addEventListener('raycaster-intersected', (e) => {
                this.timerId = setInterval(this.marquee, 200)
            });
            this.el.addEventListener('raycaster-intersected-cleared', (e) => {
                this.update()
            });
        }
    },

    update: function () {
        this.st = 0
        this.txt.setAttribute('value', this.data.value.substring(this.st, this.st + this.data.limit))
        clearInterval(this.timerId)
    },

    remove: function () {
        clearInterval(this.timerId)
    },

    marquee: function () {
        this.st = (this.st + 1) % this.data.value.length
        if (this.data.value.length - this.st < 20) this.st = 0
        this.txt.setAttribute('value', this.data.value.substring(this.st, this.st + this.data.limit))
    }

});