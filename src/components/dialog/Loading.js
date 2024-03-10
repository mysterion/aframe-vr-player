AFRAME.registerComponent('dialog-loading', {
    schema: {

    },

    init: function () {
        let el = this.el

        let loader = this.loader = document.createElement('a-entity')
        loader.setAttribute('geometry', 'primitive: plane; width: 5; height: 2.5')
        loader.setAttribute('material', 'color: teal; opacity: 0.2')
        loader.setAttribute('position', '0 0 0.1')
        loader.setAttribute('clickable', '')
        el.appendChild(loader)

        let img = document.createElement('a-image')
        img.setAttribute('src', '#asset-loading')
        img.setAttribute('position', '0 0 0.01')
        img.setAttribute('scale', '0.5 0.5 1')
        loader.appendChild(img)

        let txt = document.createElement('a-text')
        txt.setAttribute('value', 'loading')
        txt.setAttribute('width', 2)
        txt.setAttribute('align', 'center')
        txt.setAttribute('position', '0 -0.5 0.01')
        loader.appendChild(txt)
    },

    remove: function () {
        if (this.el.contains(this.loader)) {
            this.el.removeChild(this.loader)
        }
    }
});