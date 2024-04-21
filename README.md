# AFRAME VR PLAYER
A versatile web application that allows you to immerse yourself in virtual reality experiences right from your browser. Whether you want to stream videos from your PC or play videos from your local storage, AFRAME VR Player has got you covered

## Features
#### Streaming Mode ([Server](https://github.com/mysterion/aframe-vr-player/releases))
- **Stream from PC**: Utilize the server mode to stream videos directly from your PC to your VR headset. Simply set up your PC as the server and enjoy seamless playback in VR.

#### Local Storage Mode ([Web App](https://mysterion.github.io/aframe-vr-player/))
- **Play from Local Storage**: With the file picker feature, you can easily select and play videos stored on your device (less flexible and convenience).
#### VR Experience
- **Immersive VR Environment**: Enjoy a fully immersive virtual reality experience with support for various VR headsets, allowing you to feel like you're right in the midst of the action 😉.
#### User-Friendly Interface
- **Intuitive Controls**: Navigate through your video library and adjust settings effortlessly with our user-friendly interface designed for seamless interaction.

## Usage
### Online
Use the [online version](https://mysterion.github.io/aframe-vr-player/) on your web browser. Choose the video with file picker. 

### CLI
0) Download from the latest version from [releases](https://github.com/mysterion/aframe-vr-player/releases) section
1) Choose the `videos` folder and launch an instance on your PC.
2) Make sure your device and PC are connected on the same wifi/network
3) go to the URL specified on the cli (192.168.X.X) on web browser of your device(I recommend Chrome on cardboard or firefox reality on oculus quest)
4) Accept SSL certificate and enjoy

NOTE: You can generate your own SSL certificates using: 

`openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365`

make sure to keep `cert.pem` & `key.pem` on the same folder as the app

OR

you can generate it online: https://www.cryptool.org/en/cto/openssl


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
VR Player is compatible with a wide range of VR headsets, including:

- Oculus Quest
- Google Cardboard
- HTC Vive
- PlayStation VR
- Samsung Gear VR
- And more!

As this project uses [AFRAME](https://github.com/aframevr/aframe) which uses [WebXR API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
It should be run on WebXR compatible Web Browsers([More Info.](https://aframe.io/docs/1.5.0/introduction/vr-headsets-and-webxr-browsers.html#which-vr-headsets-does-a-frame-support)) 

## Contributing
We welcome contributions from the community to enhance AFRAME VR Player and make it even better. If you have any suggestions, bug reports, or feature requests, please feel free to open an issue or submit a pull request on GitHub.

## Acknowledgments

[aframe](https://github.com/aframevr/aframe)

[aframe-stereo-component](https://github.com/c-frame/aframe-stereo-component/)

[three.js](https://github.com/mrdoob/three.js)
