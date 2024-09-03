import { adjustColor } from "../utils.js";

AFRAME.registerComponent('button-highlight', {
    init: function () {
        this.color = this.el.getAttribute("material").color
        this.el.addEventListener('raycaster-intersected', (e) => {
            this.el.setAttribute("material", { color: adjustColor(this.color, 40) })
        });
        this.el.addEventListener('raycaster-intersected-cleared', (e) => {
            this.el.setAttribute("material", { color: this.color })
        });
    },
});

AFRAME.registerComponent('button-highlight-text', {
    init: function () {
        this.text = this.el.children[0].getAttribute("text").value
        this.el.addEventListener('raycaster-intersected', (e) => {
            this.el.children[0].setAttribute("text", { value: `[${this.text}]` })
        });
        this.el.addEventListener('raycaster-intersected-cleared', (e) => {
            this.el.children[0].setAttribute("text", { value: this.text })
        });
    },
});

