from flask import Flask


app = Flask(__name__)


@app.route('/')
def index():
  return 'Simpoll'


def start():
  app.run(debug=True)
