# VR Video Player
Play VR videos right from the browser. 

## Usage
### Online
Use the online version on your web browser. Choose the video with file picker. 

### CLI
1) Choose the `videos` folder and launch an instance on your PC.
2) Make sure your device and PC are connected on the same wifi/network
3) go to the URL specified on the cli (192.168.X.X) on web browser of your device(I recommend Chrome on cardboard)
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
Tested on Cardboard VR on Chrome

Since this project is built with aframe, it should be compatible with WebXR compatible VR headsets([More Info.](https://aframe.io/docs/1.5.0/introduction/vr-headsets-and-webxr-browsers.html#which-vr-headsets-does-a-frame-support)) 

## Contributing
Any contributions you make are **greatly appreciated**.
Open an [issue](https://github.com/mysterion/aframe-vr-player/issues).

## Acknowledgments

[aframe](https://github.com/aframevr/aframe)

[aframe-stereo-component](https://github.com/oscarmarinmiro/aframe-stereo-component/)
