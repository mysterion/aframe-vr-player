from flask import Flask, send_file, render_template ,request, redirect
from flask_cors import CORS
import os
import sys
import sqlite3
import store
import atexit

from thumbnails import THUMBNAIL_DIR, check_if_generating, check_if_already_generated, generate_thumbnail

atexit.register(store.close)

store.connect()

ROOT = os.curdir

app = Flask(__name__)
CORS(app)

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
    print(p)
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
    file_name = os.path.basename(file_path)
    id = request.args.get('id')
    
    if check_if_generating(file_name):
        return send_file("loading.jpg")
    if not check_if_already_generated(file_name):
        generate_thumbnail(file_path)
        return send_file("loading.jpg")
    return send_file(os.path.join(THUMBNAIL_DIR, file_name, id + '.jpg'))


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
        if os.path.exists(args[1]):
            ROOT = args[1]
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
