AFRAME.registerComponent('stereo', {

    schema: {
        eye: { type: 'string', default: "both" }
    },

    init: function () {
        this.setMask = AFRAME.utils.bind(this.setMask, this)
    },

    update: function (od) {
        let mask = 0
        if (this.data.eye === "left") {
            mask = 1
        } else if (this.data.eye === "right") {
            mask = 2
        }
        this.setMask(mask, this.el.object3D)
    },

    setMask: function (mask, object3D) {
        if (object3D.isMesh) {
            object3D.layers.set(mask)
        } else {
            for (let i in object3D.children) {
                this.setMask(mask, object3D.children[i])
            }
        }
    },

    remove: function (e) {
        this.setMask(0, this.el.object3D)
    }
});