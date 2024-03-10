import { adjustColor } from "../utils";

AFRAME.registerComponent('button-highlight', {
    init: function () {
        this.color = this.el.getAttribute("material").color
        console.log(this.color)
        this.el.addEventListener('raycaster-intersected', (e) => {
            this.el.setAttribute("material", { color: adjustColor(this.color, 40) })
        });
        this.el.addEventListener('raycaster-intersected-cleared', (e) => {
            this.el.setAttribute("material", { color: this.color })
        });
    },
});