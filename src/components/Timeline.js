import { adjustColor, createEl, toTime } from "../utils";

function createSeek(p, { width, height, depth }) {
    var seek = document.createElement('a-entity')
    seek.setAttribute('geometry', {
        primitive: 'box',
        width: width,
        height: height,
        depth: depth,
    })
    seek.setAttribute('material', {
        color: '#4CC3D9'
    })
    p.appendChild(seek)
    return seek
}

function createHoverText(p) {
    var el = document.createElement('a-text')
    el.setAttribute('position', '0 7 0')
    el.setAttribute('align', 'center')
    el.setAttribute('value', '00:00:00')
    p.appendChild(el)
    return el
}

function createHover(seek, { width, height, depth }) {

    var hover = document.createElement('a-entity')
    let position = seek.getAttribute('position')
    hover.setAttribute('visible', false)
    hover.setAttribute('geometry', {
        primitive: 'box',
        width: width,
        height: height,
        depth: depth,
    })
    hover.setAttribute('position', position)

    hover.setAttribute('material', {
        color: "#00FF00"
    })
    seek.insertAdjacentElement("afterend", hover)
    return hover
}

function createBg(el) {
    let { width, height } = el.getAttribute('geometry')
    let position = el.getAttribute('position')
    var bg = document.createElement('a-entity')
    bg.setAttribute('geometry', {
        primitive: 'plane',
        width: width + 0.05,
        height: height + 0.05
    })
    bg.setAttribute('material', {
        color: adjustColor(el.getAttribute('material').color, -40)
    })
    bg.setAttribute('position', position)
}

AFRAME.registerComponent('timeline', {
    schema: {
        videoId: { type: 'string', default: 'video' },
    },
    init: function () {
        var el = this.el
        this.video = document.getElementById(this.data.videoId)
        let { width, height } = el.getAttribute('geometry')

        this.seek = createSeek(el, { width: width * 0.015, height, depth: 0.5 })
        this.hoverEl = createHover(this.seek, { width: width * 0.01, height: height + 0.5, depth: 0.5 })
        this.hoverTextEl = createEl('a-text', {
            'position': '0 4 0',
            'align': 'center',
            'value': '00:00:00',
            'width': '40'
        })
        this.hoverEl.appendChild(this.hoverTextEl)
        this.bg = createBg(el)
        this.videoText = createEl('a-entity', {
            position: '0 0 0',
            geometry: 'primitive: plane; width: 1.5; height: 0.15',
            text: 'value: 00:00:00/00:00:00; width: 2; align: center;',
            material: 'color: #333; opacity: 0.5;'
        })
        el.appendChild(this.videoText)

        this.timelineWidth = timeline.getAttribute("geometry").width;

        this.seek.setAttribute("position", { x: -this.timelineWidth / 2 })

        this.updateElems = () => {
            var newPosition = (this.video.currentTime / this.video.duration) * this.timelineWidth - this.timelineWidth / 2;
            this.seek.setAttribute("position", { x: newPosition });
            this.videoText.setAttribute("text", { value: `${toTime(this.video.currentTime)}/${toTime(this.video.duration)}` })
        }

        this.video.addEventListener("loadedmetadata", () => {
            this.seek.setAttribute("position", { x: -this.timelineWidth / 2 })
            this.videoText.setAttribute("text", { value: `${toTime(this.video.currentTime)}/${toTime(this.video.duration)}` })
        })

        this.video.addEventListener('timeupdate', this.updateElems)

        el.addEventListener("click", (e) => {
            let v = this.video
            if (v.readyState === 0) {
                console.log('no info available for video')
                return
            }
            var percentClicked = e.detail.intersection.uv.x;
            v.currentTime = (percentClicked * v.duration).toFixed(2);
        });

        el.addEventListener('raycaster-intersected', e => {
            this.raycaster = e.detail.el;
            this.hoverEl.setAttribute("visible", true);
        });

        el.addEventListener('raycaster-intersected-cleared', e => {
            this.raycaster = null;
            this.hoverEl.setAttribute("visible", false);
        });
    },


    tick: function () {
        if (!this.raycaster) { return; }  // Not intersecting.

        let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
        if (!intersection) { return; }
        if (intersection.point.x === this.previousIntersection?.x &&
            intersection.point.y === this.previousIntersection?.y &&
            intersection.point.z === this.previousIntersection?.z) { return; }
        // process
        let percentGazed = intersection.uv.x;
        let timelineWidth = timeline.getAttribute("geometry").width;
        let possibleNew = percentGazed * timelineWidth - timelineWidth / 2;
        let possibleTime = Math.floor(percentGazed * video.duration);
        let { y, z } = this.hoverEl.getAttribute("position")

        this.hoverEl.setAttribute("position", `${possibleNew} ${y} ${z}`);
        this.hoverTextEl.setAttribute("value", toTime(possibleTime))
        // for next tick
        this.previousIntersection = intersection.point;
    },

    remove: function () {
        var el = this.el
        el.setAttribute('controls')
    }
});