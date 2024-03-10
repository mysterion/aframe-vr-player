AFRAME.registerComponent('stereocam', {

    schema: {
        eye: { type: 'string', default: "left" }
    },

    init: function () {
        this.layer_changed = false;
    },

    tick: function (time) {
        var data = this.data;
        if (!this.layer_changed) {
            var rootCam
            this.el.object3D.children.forEach(function (item) {
                if (item.type == "PerspectiveCamera") {
                    rootCam = item
                }
            });
            if (rootCam) {
                if (data.eye === 'left') {
                    rootCam.layers.enable(1)
                    rootCam.layers.disable(2)
                } else if (data.eye === 'right') {
                    rootCam.layers.enable(2)
                    rootCam.layers.disable(1)
                } else {
                    rootCam.layers.enable(1);
                    rootCam.layers.enable(2);
                }
            } else {
                console.error("stereocam: Camera not found")
            }
        }
    }
});