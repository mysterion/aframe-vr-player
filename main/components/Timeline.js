import { THUMBNAILS } from "../systems/Thumbnails.js";
import { createEl, toTime } from "../utils.js";


AFRAME.registerComponent('timeline', {
    schema: {
        videoId: { type: 'string', default: 'video' },
    },
    init: function () {
        var el = this.el
        this.video = document.getElementById(this.data.videoId)
        const { width, height } = el.getAttribute('geometry')

        this.seek = createEl('a-entity', {
            geometry: `primitive: box; width: ${width * 0.01}; height: ${height}; depth: 0.5;`,
            material: 'color: #006cd8',
            position: `${-width / 2} 0 0`
        }, [], el)

        this.hoverThumb = createEl('a-image', {
            width: width * 0.30,
            height: width * 0.30 / 2,
            position: '0 11 1'
        });

        this.hoverEl = createEl('a-entity', {
            geometry: `primitive: box; width: ${width * 0.01}; height: ${height + 1}; depth: 0.5; `,
            visible: false,
            material: 'color: #00FF00'
        }, [this.hoverThumb], el)

        this.hoverTextEl = createEl('a-text', {
            'geometry': 'primitive: plane; width: 8; height: 2.5;',
            'material': 'color: #808080',
            'position': '0 5 0',
            'align': 'center',
            'width': '40',
            'z-offset': '0.5',
            'value': '00:00:00',
        }, [], this.hoverEl)

        this.bg = createEl('a-entity', {
            geometry: `primitive: plane; width: ${width + 1.5}; height: ${height + 1} `,
            material: `color: #006cd8`,
            position: '0 0 -0.5'
        }, [], el)

        this.videoText = createEl('a-entity', {
            position: '0 0 0.5',
            text: 'value: 00:00:00/00:00:00; width: 40; align: center; zOffset: 0.2;',
            material: 'color: #333; opacity: 0.5;',
            geometry: 'primitive: plane; width: 15; height: 2.5;',
        }, [], el)

        this.updateElems = () => {
            var newPosition = (this.video.currentTime / this.video.duration) * width - width / 2;
            this.seek.setAttribute("position", { x: newPosition });
            this.videoText.setAttribute("text", { value: `${toTime(this.video.currentTime)} /${toTime(this.video.duration)}` })
        }

        this.video.addEventListener("loadedmetadata", () => {
            this.seek.setAttribute("position", { x: -width / 2 })
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
        let possibleTime = Math.floor(percentGazed * this.video.duration);
        let { y, z } = this.hoverEl.getAttribute("position");
        
        if (isNaN(possibleTime) || !possibleTime) possibleTime = 0
        
        this.hoverThumb.getObject3D('mesh').material.map = this.el.sceneEl.systems[THUMBNAILS].getThumb(Math.floor(possibleTime / 60))

        this.hoverEl.setAttribute("position", `${possibleNew} ${y} ${z}`);
        this.hoverTextEl.setAttribute("value", toTime(possibleTime));
        // for next tick
        this.previousIntersection = intersection.point;
    },

    remove: function () {
        var el = this.el
        el.removeAttribute('controls')
        el.removeChild(this.seek)
        el.removeChild(this.hoverEl)
        el.removeChild(this.bg)
        el.removeChild(this.videoText)
        // TODO: bind listener functions and remove listeners here.
    }
});