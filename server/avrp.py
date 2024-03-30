from flask import Flask, send_file, render_template ,request, redirect
from flask_cors import CORS
import os
import sys

ROOT = os.curdir

app = Flask(__name__)
CORS(app)

from OpenSSL import crypto, SSL

def cert_gen(
    emailAddress="NA",
    commonName="NA",
    countryName="NA",
    localityName="NA",
    stateOrProvinceName="NA",
    organizationName="NA",
    organizationUnitName="NA",
    serialNumber=0,
    validityStartInSeconds=0,
    validityEndInSeconds=10*365*24*60*60,
    KEY_FILE = "key.pem",
    CERT_FILE="cert.pem"):
    #can look at generated file using openssl:
    #openssl x509 -inform pem -in selfsigned.crt -noout -text
    # create a key pair
    k = crypto.PKey()
    k.generate_key(crypto.TYPE_RSA, 4096)
    # create a self-signed cert
    cert = crypto.X509()
    cert.get_subject().C = countryName
    cert.get_subject().ST = stateOrProvinceName
    cert.get_subject().L = localityName
    cert.get_subject().O = organizationName
    cert.get_subject().OU = organizationUnitName
    cert.get_subject().CN = commonName
    cert.get_subject().emailAddress = emailAddress
    cert.set_serial_number(serialNumber)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(validityEndInSeconds)
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(k)
    cert.sign(k, 'sha512')
    with open(CERT_FILE, "wt") as f:
        f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert).decode("utf-8"))
    with open(KEY_FILE, "wt") as f:
        f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, k).decode("utf-8"))

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
        print("Generating SSL certificate...")
        cert_gen()
    
    context = (certPath, keyPath)
    app.run(debug=False, host="0.0.0.0", ssl_context=context)
