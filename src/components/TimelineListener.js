export function toTime(seconds) {
    if (isNaN(seconds)) seconds = 0
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

AFRAME.registerComponent('timeline-listen', {
    init: function () {
        let timeline = document.getElementById("timeline");
        let video = document.getElementById("video");
        let seek = document.getElementById("seek");
        this.video = video;
        this.seek = seek;
        this.timeline = timeline;
        this.hoverEl = document.getElementById("hover");
        this.hoverTextEl = document.getElementById("hover-text");


        timeline.addEventListener("click", function (event) {
            var timelineWidth = timeline.getAttribute("geometry").width;
            var percentClicked = event.detail.intersection.uv.x;
            var newPosition = percentClicked * timelineWidth - timelineWidth / 2;
            video.currentTime = (percentClicked * video.duration).toFixed(2);
            let { x: sx, y: sy, z: sz } = seek.getAttribute("position")
            seek.setAttribute("position", `${newPosition} ${sy} ${sz}`);
        });

        timeline.addEventListener('raycaster-intersected', e => {
            this.raycaster = e.detail.el;
            this.hoverEl.setAttribute("visible", true);
        });
        timeline.addEventListener('raycaster-intersected-cleared', e => {
            this.raycaster = null;
            this.hoverEl.setAttribute("visible", false);
        });
    },
    tick: function () {
        if (!this.raycaster) { return; }  // Not intersecting.

        let intersection = this.raycaster.components.raycaster.getIntersection(this.timeline);
        if (!intersection) { return; }
        if (intersection.point.x === this.previousIntersection?.x &&
            intersection.point.y === this.previousIntersection?.y &&
            intersection.point.z === this.previousIntersection?.z) { return; }
        // process
        let percentGazed = intersection.uv.x;
        let timelineWidth = timeline.getAttribute("geometry").width;
        let possibleNew = percentGazed * timelineWidth - timelineWidth / 2;
        let possibleTime = Math.floor(percentGazed * video.duration);
        let { x: sx, y: sy, z: sz } = this.hoverEl.getAttribute("position")
        this.hoverEl.setAttribute("position", `${possibleNew} ${sy} ${sz}`);
        this.hoverTextEl.setAttribute("value", toTime(possibleTime))
        // for next tick
        this.previousIntersection = intersection.point;
    }
});