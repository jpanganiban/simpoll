from flask import Flask, render_template, jsonify, request
from flaskext.mongoalchemy import MongoAlchemy



app = Flask(__name__, template_folder='views')
app.config['MONGOALCHEMY_DATABASE'] = 'simpoll'
db = MongoAlchemy(app)


class Person(db.Document):
  name = db.StringField()

  def to_dict(self):
    return {
          'id': str(self.mongo_id),
          'name': self.name,
        }


@app.route('/')
def index():
  return render_template('index.html')


def start():
  app.run(debug=True)