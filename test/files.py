from flask import Flask, send_file, request, redirect
from flask_cors import CORS
import os
import sys

ROOT = os.curdir

app = Flask(__name__)
CORS(app)


@app.before_request
def before_request():
    if not request.is_secure:
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)


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

if __name__ == '__main__':
    args = sys.argv
    if len(args) >= 2:
        if os.path.exists(args[1]):
            ROOT = args[1]
    context = ('cert.pem', 'key.pem')
    app.run(debug=True, host="0.0.0.0", ssl_context=context)
