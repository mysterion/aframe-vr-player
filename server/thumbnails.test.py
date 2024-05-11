import store
import thumbnails
# monitor the file make sure 0.mp4 is removed when thumbnail is generated
store.connect()
thumbnails.generate('/home/user/Videos/0.mp4')

