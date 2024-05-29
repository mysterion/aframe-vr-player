import store
import subprocess
from pathlib import Path
import concurrent.futures
from multiprocessing import cpu_count
from flask_app import log
from hash import hashFile
from utils import is_video

THUMBNAIL_DIR = Path(Path.home(), '.avrp', 'thumbnails')
BIN_DIR = Path(Path(__file__).parent, "bin")

pool = concurrent.futures.ThreadPoolExecutor(thread_name_prefix='avrp_thumb_', max_workers=2*cpu_count())

# TODO: Cache this in-memory or not :X
def get_thumb_dir(file_path):
    file_name = str(Path(file_path).name)
    file_size = str(Path(file_path).stat().st_size)
    thumb_dir_name = hashFile(f=file_path)
    thumb_dir_path = Path(THUMBNAIL_DIR, thumb_dir_name)
    return thumb_dir_name, thumb_dir_path, file_name, file_size

def get_duration(file_path):
    cur = store.db.cursor()
    cur.execute('''SELECT duration FROM duration where file_path=?''', (f"""{file_path}"""))
    row = cur.fetchone()
    if row != None:
        log.info(f"duration from cache - {row[0]} - file: {file_path}")
        return row[0]
    cmd = f''' "{Path(BIN_DIR, 'ffprobe')}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "{file_path}" '''
    log.info("executing - " + cmd)

    dur = 0
    if cmd[0] == 0:
        dur = cmd[0]
    else:
        log.error(f"{cmd} - {cmd[1]}")
    
    cur = store.db.cursor()
    cur.execute('''INSERT INTO duration(file_path, duration) VALUES(?, ?)''', (str(file_path), dur))
    store.db.commit()

    return dur


def is_generating(file_path):
    _, __, file_name, file_size = get_thumb_dir(file_path)
    cur = store.db.cursor()
    cur.execute('''SELECT file_name FROM generating where file_name=? and file_size=?''', (file_name, file_size))
    row = cur.fetchone()
    return row != None

def generate(file_path):
    if is_generating(file_path):
        return
    _, thumb_dir_path, file_name, file_size = get_thumb_dir(file_path)
    cur = store.db.cursor()
    cur.execute('''INSERT INTO generating(file_name, file_size) VALUES(?, ?)''', (file_name, file_size))
    store.db.commit()
    try:

        Path(thumb_dir_path).mkdir(parents=True, exist_ok=True)

        already = [f.name for f in Path(thumb_dir_path).iterdir() if f.is_file()]
        
        exit_code, seconds = get_duration(file_path)
        if exit_code != 0:
            raise Exception(f'Failed to get duration of {file_path}, output: {seconds}')
        futures = []
        for i in range(0, int(float(seconds)//60)):
            if f'{i}.jpg' in already:
                continue

            cmd = f''' "{Path(BIN_DIR, 'ffmpeg')}" -y -accurate_seek -ss {i * 60} -i "{file_path}" -frames:v 1 -vf "crop=in_w/2:in_h/2:in_w:in_h/4,scale=320:-1" "{Path(thumb_dir_path, f"{i}.jpg")}" '''
            log.info("executing - " + cmd)
            futures.append(pool.submit(subprocess.getstatusoutput, cmd))

        for f in futures:
           exit_code, output = f.result()
    except Exception as e:
        log.error(e)
    cur = store.db.cursor()
    cur.execute('''DELETE FROM generating WHERE file_name = ? and file_size = ?''', (file_name, file_size))
    store.db.commit()
