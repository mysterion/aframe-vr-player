import os
import store
import subprocess
import pathlib

THUMBNAIL_DIR = '.thumbnails'

def get_thumb_dir(file_path):
    file_name = str(os.path.basename(file_path))
    file_size = str(os.path.getsize(file_path))
    thumb_dir_name = f'{file_name}_{file_size}'
    thumb_dir_path = os.path.join(THUMBNAIL_DIR, f"{file_name}_{file_size}")
    ## TODO UPDATE ALL PARTS OF CODE WHERE THIS FUNC IS USED
    return thumb_dir_name, thumb_dir_path, file_name, file_size

# return completely or partially
def check_if_already_generated(file_path):
    _, thumb_dir_path, __, ___ = get_thumb_dir(file_path)
    return os.path.exists(thumb_dir_path)

def get_duration(file_path):
    return subprocess.getstatusoutput(f'{os.path.join("bin", "ffprobe")} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 {file_path}')

def is_generating(file_name, file_size):
    cur = store.db.cursor()
    cur.execute('''SELECT file_name FROM generating where file_name=? and file_size=?''', (file_name, file_size))
    row = cur.fetchone()
    return row != None

def check_if_thumb_ok(file_path):
    get_thumb_dir(file_path)
    try:
        exit_code, seconds = get_duration(file_path)
        # TODO
        # seconds//60 <= LIST OF FILES IN THAT THUMBNAIL DIR
    except Exception as e:
        print(e)
    return False
 
def generate_thumbnail(file_path):
    global FFMPEG
    _, thumb_dir_path, file_name, file_size = get_thumb_dir(file_path)

    cur = store.db.cursor()
    cur.execute('''INSERT INTO generating(file_name, file_size) VALUES(?, ?)''', (file_name, file_size))
    try:
        store.db.commit()

        if not os.path.exists(thumb_dir_path):
            os.makedirs(thumb_dir_path)
    # ffmpeg -y -accurate_seek -ss 60 -i 0.mp4 -frames:v 1 -vf "crop=in_w/2:in_h/2:in_w:in_h/4" -q:v 23 0.jpg
        exit_code, seconds = get_duration(file_path)
        if exit_code != 0:
            raise Exception(f'Failed to get duration of {file_name}')
        for i in range(0, int(float(seconds)//60)):
            exit_code, output = subprocess.getstatusoutput(f'{os.path.join("bin", "ffmpeg")} -y -accurate_seek -ss {i * 60} -i "{file_path}" -frames:v 1 -vf "crop=in_w/2:in_h/2:in_w:in_h/4,scale=320:-1" "{thumb_dir_path}{os.path.sep}{i}.jpg"')
    except Exception as e:
        print(e)
    cur = store.db.cursor()
    cur.execute('''DELETE FROM generating WHERE file_name = ? and file_size = ?''', (file_name, file_size))
    store.db.commit()
