from flask_app import app, log
from flask import  send_file, render_template ,request
from pathlib import Path
from utils import is_video
import sys
import store
import atexit
import thumbnails


atexit.register(store.close)

store.connect()

ROOT = Path(__file__).parent
CWD = Path(__file__).parent

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/file/<path:file_path>")
def get_file(file_path):
    return send_file(Path(ROOT, file_path))

@app.route("/list/", defaults={'p': '.'})
@app.route("/list/<path:p>")
def list_files(p):
    p = Path(ROOT, p)
    rf = []
    rd = []
    fnd = list(Path(p).iterdir())
    for f in fnd:
        if f.is_dir():
            rd.append(f.name)
        if f.is_file():
            if (is_video(f.name)):
                rf.append({'name': f.name, 'duration': thumbnails.get_duration(f)})
    return { 'files': rf, 'folders': rd }

@app.route("/thumb/<path:file_path>")
def get_thumb(file_path):
    p = Path(ROOT, file_path)

    id = request.args.get('id')
    if id == None:
        return 'id not found in request', 400
    
    if not p.exists():
        return "Not Found", 404
    if thumbnails.is_generating(p):
        return "generating", 418
    ___, thumb_dir_path, __, _ = thumbnails.get_thumb_dir(p)

    thumbPathId = Path(thumb_dir_path, f"{id}.jpg")
    if not thumbPathId.exists():
        thumbnails.generate(p)

    return send_file(thumbPathId)


@app.route("/thumb/debug")
def debug_thumb():
    cur = store.db.cursor()
    cur.execute('''SELECT * FROM generating''')
    row = cur.fetchall()
    return row

def cleanPath(p_str):
    return str(p_str).strip().strip("'").strip().strip('"').strip()


def pathOk(p_str):
    p = Path(p_str)
    return p.exists() and p.is_dir()

def askForPath():
    while True:
        p = cleanPath(input("Please enter path to serve: "))
        if pathOk(p):
            return p
        else:
            print("Invalid Path")

if __name__ == '__main__':
    log.info(f'Args: {sys.argv}')
    args = sys.argv
    
    if len(args) == 1:
        ROOT = askForPath()
    else:
        p = cleanPath(args[1])
        if pathOk(p):
            ROOT = p
        else:
            ROOT = askForPath()
        log.info(f'Serving videos from : {ROOT}')
    
    certPath = Path(CWD, 'certs', 'cert.pem')
    keyPath = Path(CWD, 'certs', 'key.pem')

    if not certPath.exists() or not keyPath.exists():
        print("certs/*.pem not found. please reinstall. Or generate the keys using openSSL")
        input("Press any key to continue...")
        sys.exit(1)
    
    context = (certPath, keyPath)
    app.run(debug=False, host="0.0.0.0", port=5000, ssl_context=context)
