import { E } from "../../main";
import { Store } from "../../store";

AFRAME.registerComponent('btn-vol', {
    schema: {
        vol: { type: 'number', default: 1 }
    },
    init: function () {
        let el = this.el
        this.setVolume = AFRAME.utils.bind(this.setVolume, this)

        let width = this.width = 0.65
        el.setAttribute('geometry', {
            primitive: 'plane',
            width: width + 0.05,
            height: 0.35
        })
        el.setAttribute('material', 'color: #808080')

        let txt = this.txt = document.createElement('a-text')
        txt.setAttribute('width', 2.5)
        txt.setAttribute('align', 'center')
        txt.setAttribute('value', '100')
        txt.setAttribute('position', '0 0 0.011')
        el.appendChild(txt)

        let bar = this.bar = document.createElement('a-entity')
        bar.setAttribute('material', 'color: #005073')
        bar.setAttribute('position', `0 0 0.01`)
        bar.setAttribute('geometry', {
            primitive: 'plane',
            width: width,
            height: 0.30
        })
        this.el.appendChild(bar)
        this.el.addEventListener('click', (e) => {
            this.setVolume(e.detail.intersection.uv.x)
        });

        this.setVolume(Store.get('volume'))
    },
    setVolume: function (i) {
        if (i >= 0.9) i = 1
        if (i <= 0.1) i = 0.1
        let q = this.width * i
        let p = q / 2
        E.video.volume = i
        Store.set('volume', i)
        this.txt.setAttribute('value', `${Math.round(E.video.volume * 100)}`)
        this.bar.setAttribute('position', `${p - this.width / 2} 0 0.01`)
        this.bar.setAttribute('geometry', { 'width': q })
    }
});