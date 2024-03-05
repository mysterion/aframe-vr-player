// negative = darker :O
function adjust(color, amount) {
    if (color === "#FFF") {
        amount *= -1
    }
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

AFRAME.registerComponent('button-highlight', {
    init: function () {
        this.color = this.el.getAttribute("material").color
        this.el.addEventListener('raycaster-intersected', (e) => {
            this.el.setAttribute("material", { color: adjust(this.color, 40) })
        });
        this.el.addEventListener('raycaster-intersected-cleared', (e) => {
            this.el.setAttribute("material", { color: this.color })
        });
    },
});