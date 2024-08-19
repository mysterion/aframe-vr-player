export const EVENTS = "events"
export const EV = {
    SETTINGS: 'Settings',
    VIDSTATE: 'VideoState',
    CONTROLS: 'Controls',
    ENVIRONMENT: 'Environment',
}

AFRAME.registerComponent('events', {
    init: function () {
        console.log("Events initialized...")
    },
});