export const EVENTS = "events"
export const EV = {
    SETTINGS: 'Settings',
    VIDSTATE: 'VideoState',
    CONTROLS: 'Controls'
}

AFRAME.registerComponent('events', {
    init: function () {
        console.log("Event bus initialized...")
    },
});