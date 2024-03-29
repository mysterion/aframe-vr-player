export const EVENTS = "events"
export const EV = {
    SETTINGS: 'Settings',
    VIDSTATE: 'VideoState',
    CONTROLS: 'Controls'
}

AFRAME.registerComponent('events', {
    // schema: {

    // },

    init: function () {
        console.log("Event bus initialized...")
    },

    // update: function () {
    // },

    // remove: function () {
    // },

    // tick: function (time, timeDelta) {
    // }

});