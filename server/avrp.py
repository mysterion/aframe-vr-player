from flask_app import app, log
from flask import  send_file, render_template ,request, redirect, make_response
from pathlib import Path
import os
import sys
import store
import atexit
import thumbnails

atexit.register(store.close)

store.connect()

ROOT = os.curdir

@app.before_request
def before_request():
    if not request.is_secure:
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/file/<path:file_path>")
def get_file(file_path):
    return send_file(os.path.join(ROOT, file_path))

@app.route("/list/", defaults={'p': '.'})
@app.route("/list/<path:p>")
def list_files(p):
    p = os.path.join(ROOT, p)
    rf = []
    rd = []
    log.info(p)
    fnd = os.listdir(p)
    for f in fnd:
        f_path = os.path.join(p, f)
        if os.path.isdir(f_path):
            rd.append(f)
        if os.path.isfile(f_path):
            rf.append(f)
    return { 'files': rf, 'folders': rd }

@app.route("/thumb/<path:file_path>")
def get_thumb(file_path):
    p = Path(ROOT, file_path)
    file_path = str(p)

    id = request.args.get('id')
    if id == None:
        return 'id not found in request', 400

    if not p.exists():
        return "Not Found", 404
    if thumbnails.is_generating(file_path):
        return "generating", 418
    ___, thumb_dir_path, __, _ = thumbnails.get_thumb_dir(file_path)

    p = Path(thumb_dir_path, f"{id}.jpg")
    if not p.exists():
        thumbnails.generate(file_path)
        return "generating", 418
    # res = make_response(send_file(p))
    # res.headers['Cache-Control'] = 'max-age=604800'
    # res.headers['Expires'] = (datetime.datetime.utcnow() + datetime.timedelta(days=7)).strftime('%a, %d %b %Y %H:%M:%S GMT')
    # return res
    return send_file(p)


@app.route("/thumb/debug")
def debug_thumb():
    cur = store.db.cursor()
    cur.execute('''SELECT * FROM generating''')
    row = cur.fetchall()
    return row



def askForPath():
    while True:
        p = input("Please enter path to serve: ")
        if os.path.isdir(p):
            return p
        else:
            print("Invalid Path")

if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) == 0:
        ROOT = askForPath()
    else:
        if os.path.exists(args[0]):
            ROOT = args[0]
        else:
            ROOT = askForPath()
    print(ROOT)
    certPath = 'cert.pem'
    keyPath = 'key.pem'

    if  not os.path.isfile(certPath) or not os.path.isfile(keyPath):
        print("certs not found. please reinstall.")
        os.exit(1)
    
    context = (certPath, keyPath)
    app.run(debug=False, host="0.0.0.0", ssl_context=context)
