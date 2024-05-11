async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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



// Move to a System :D
export const ThumbStore = (function () {
    const RETRY = 24
    const RETRY_SECONDS = 5

    var thumbs = []

    var loaded = true
    var error = ''

    const get = (i) => {
        if (error.length !== 0 || loaded === false || i >= thumbs.length)
            return null
        return thumbs[i]
    }

    const clear = () => {
        thumbs = []
    }

    const loadFromUrl = async (url, len) => {
        loaded = false
        try {
            thumbs = []
            for (let i = 0; i < len; i++) {
                let response = await fetch(url + `?id=${i}`);
                if (i === 0) {
                    let tries = 0
                    while (response.status === 418 && tries < RETRY) {
                        delay(RETRY_SECONDS * 1000)
                        ++tries;
                        response = await fetch(url + `?id=${i}`);
                    }
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                thumbs.push({
                    url: imageUrl,
                    blob: blob
                })

            }
        } catch (err) {
            error = `${err}`;
            return
        } finally {
            loaded = true
        }
    }
    return {
        get,
        loadFromUrl,
        clear,
        error
    }
})