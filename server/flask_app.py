from flask import Flask
from flask_cors import CORS
import logging

app = Flask("AVRP")
CORS(app)
logging.basicConfig(level=logging.INFO)
log = app.logger
