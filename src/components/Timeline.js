import { adjustColor, createEl, getFileName, toTime } from "../utils";
import { V_FILE_GET_URL, V_THUMB_URL } from "./Consts";

const DEFAULT_THUMB_URL = '/static/loading.jpg'

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
        const { width, height } = el.getAttribute('geometry')

        this.seek = createEl('a-entity', {
            geometry: `primitive: box; width: ${width * 0.01}; height: ${height}; depth: 0.5;`,
            material: 'color: #006cd8',
            position: `${-width / 2} 0 0`
        }, [], el)

        this.hoverThumb = createEl('a-image', {
            src: '/static/loading.jpg',
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
            'position': '0 5 0',
            'align': 'center',
            'value': '00:00:00',
            'width': '40'
        }, [
            createEl('a-entity', {
                'geometry': 'primitive: plane; width: 8; height: 2.5;',
                'position': '0 0 -0.5',
                'material': 'color: #808080',
            })
        ], this.hoverEl)

        this.bg = createEl('a-entity', {
            geometry: `primitive: plane; width: ${width + 1.5}; height: ${height + 1} `,
            material: `color: #006cd8`,
            position: '0 0 -0.5'
        }, [], el)

        this.videoText = createEl('a-entity', {
            position: '0 0 0.5',
            text: 'value: 00:00:00/00:00:00; width: 40; align: center;',
            material: 'color: #333; opacity: 0.5;'
        }, [
            createEl('a-plane', {
                geometry: 'primitive: plane; width: 15; height: 2.5;',
                position: '0 0 -0.1',
                material: 'color: black; opacity: 0.5'
            })
        ], el)

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

        console.log(`${V_THUMB_URL}/${this.fileLink}/${Math.floor(possibleTime / 60)}.jpg`)
        this.hoverThumb.setAttribute("src", `${V_THUMB_URL}/${this.fileLink}/${Math.floor(possibleTime / 60)}.jpg`)
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