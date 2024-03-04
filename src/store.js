export const Store = (function () {
    const get = (key) => {
        return JSON.parse(localStorage.getItem(key))
    }
    const set = (key, val) => {
        localStorage.setItem(key, JSON.stringify(val))
    }
    return {
        get,
        set
    }
})()