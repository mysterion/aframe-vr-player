import { setupScene } from "../main";

AFRAME.registerComponent('setup', {
    init: function () {
        setupScene()
    },
});