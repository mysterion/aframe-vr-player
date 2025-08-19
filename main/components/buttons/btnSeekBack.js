import { El } from "../../elems.js";

AFRAME.registerComponent('btn-seek-back', {
    init: function () {
        this.el.addEventListener('click', () => {
            El.video.currentTime -= 15
        })
    },
});