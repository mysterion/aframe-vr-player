# VR Video Player
Play VR videos right from the browser. 

## Usage
### Online
Use the online version on your web browser. Choose the video with file picker. 

### CLI (Coming soon)
use the cli version to launch an instance directly from your PC.

## Development
```
git clone --depth=1 https://github.com/mysterion/aframe-vr-player.git
npm install 
npm run devhost

# optional
# use test/files.py to serve videos from local folder
# don't forget to set VITE_LISTING_URL & VITE_FILE_GET_URL in .env file
```
## Compatibility
Tested on Cardboard VR on Chrome

Since this project is built with aframe, it should be compatible with WebXR compatible VR headsets([More Info.](https://aframe.io/docs/1.5.0/introduction/vr-headsets-and-webxr-browsers.html#which-vr-headsets-does-a-frame-support)) 

## Contributing
Any contributions you make are **greatly appreciated**.
Open an [issue](https://github.com/raffleberry/vrp/issues).

## Acknowledgments

[aframe](https://github.com/aframevr/aframe)

[aframe-stereo-component](https://github.com/oscarmarinmiro/aframe-stereo-component/)
