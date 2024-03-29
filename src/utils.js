// negative = darker :O
export function adjustColor(color, amount) {
    if (color === "#FFF") {
        amount *= -1
    }
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export function toTime(seconds) {
    if (isNaN(seconds)) seconds = 0
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

export function getFileName(link) {
    return link.replace(/^.*[\\/]/, '')
}

export function createElement(tagName = 'a-entity', attributes = {}, children = []) {
    const el = document.createElement(tagName)
    for (let key in attributes) {
        el.setAttribute(key, attributes[key])
    }
    if (children.length > 0) {
        el.append(...children)
    }
    return el
}

export function applyAttribs(el, attributes = {}) {
    for (let key in attributes) {
        el.setAttribute(key, attributes[key])
    }
}

export function isObjectEmpty(obj) { for (const i in obj) return false; return true; }

export function getElem(id) { return document.querySelector('#' + id) }