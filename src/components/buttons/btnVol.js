AFRAME.registerComponent('btn-vol', {
    init: function () {
        let el = this.el
        let video = this.video = document.getElementById("video")
        let width = 0.65
        el.setAttribute('geometry', {
            primitive: 'plane',
            width: width + 0.05,
            height: 0.35
        })
        el.setAttribute('material', 'color: #808080')

        let txt = document.createElement('a-text')
        txt.setAttribute('width', 2.5)
        txt.setAttribute('align', 'center')
        txt.setAttribute('value', '100')
        txt.setAttribute('position', '0 0 0.011')
        el.appendChild(txt)

        let bar = document.createElement('a-entity')
        bar.setAttribute('material', 'color: #005073')
        bar.setAttribute('position', `0 0 0.01`)
        bar.setAttribute('geometry', {
            primitive: 'plane',
            width: width,
            height: 0.30
        })
        this.el.appendChild(bar)

        this.el.addEventListener('click', (e) => {
            let i = e.detail.intersection.uv.x
            if (i >= 0.9) i = 1
            if (i <= 0.1) i = 0.1
            let q = width * i
            let p = q / 2
            video.volume = i
            txt.setAttribute('value', `${Math.round(video.volume * 100)}`)
            bar.setAttribute('position', `${p - width / 2} 0 0.01`)
            bar.setAttribute('geometry', { 'width': q })
        });
    },
});