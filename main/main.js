export const El = {
    ascene: document.querySelector('a-scene'),
    video: document.getElementById('video'),
    env: document.getElementById('env'),
    file: document.getElementById('fileInput'),
    cameraRig: document.getElementById('cameraRig'),
    controls: document.getElementById('controls'),
    events: document.getElementById('events'),
    settings: document.getElementById('settings'),
    videoState: document.getElementById('video-state'),
    dialog: document.getElementById('dialog'),
    subtitles: document.getElementById('subtitles')
}

// systems
import './systems/Controls.js'
import './systems/Thumbnails.js'


// events
import './components/Events.js'

// components
import './components/Stereo.js'
import './components/StereoCam.js'
import './components/Timeline.js'
import './components/ButtonHighlight.js'
import './components/Recenter.js'
import './components/CursorUtil.js'
import './components/AdjustCamera.js'
import './components/toggleAdjustUi.js'
import './components/Subtitles.js'



// components:dialog
import './components/dialog/MarqTxt.js'
import './components/dialog/Files.js'
import './components/dialog/Settings.js'
import './components/dialog/Loading.js'
import './components/dialog/Utils.js'

// components:settings
import './components/settings/Settings.js'

// components:env
import './components/env/EnvManager.js'
import './components/env/Equirectangular.js'
import './components/env/Fisheye.js'
import './components/env/Flat.js'


// buttons
import './components/buttons/btnOpenFile.js'
import './components/buttons/btnPausePlay.js'
import './components/buttons/btnSeekBack.js'
import './components/buttons/btnSeekForw.js'
import './components/buttons/btnVol.js'
import './components/buttons/btnHideControls.js'
import './components/buttons/btnSettings.js'

