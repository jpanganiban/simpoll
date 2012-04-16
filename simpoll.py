from gevent import monkey
monkey.patch_all()
from gevent.event import Event
from gevent.pywsgi import WSGIServer

from flask import Flask, render_template, jsonify, request
from flaskext.mongoalchemy import MongoAlchemy



app = Flask(__name__, template_folder='views')
app.config['MONGOALCHEMY_DATABASE'] = 'simpoll'
db = MongoAlchemy(app)

event = Event()
first_get = True

class Person(db.Document):
  name = db.StringField()

  def to_dict(self):
    return {
          'id': str(self.mongo_id),
          'name': self.name,
        }


@app.route('/persons/<person_id>', methods=['DELETE'])
def person_route(person_id):
  if request.method.upper() == 'DELETE':
    person = Person.query.get(person_id)
    person.remove()
    # An event happend so we are going to call the event.set
    # so that all the waiters would wake up and be unblocked.
    event.set()
    event.clear()
    return ''

@app.route('/poll')
def poll():
  # Wait blocks the main loop and waits for an event (event.set)
  # to happen. If an event happens, this then get's unblocks,
  # and continues with the process.
  event.wait()
  persons = Person.query.all()
  return jsonify({
      'persons': [person.to_dict() for person in persons]
    })

@app.route('/persons', methods=['GET', 'POST'])
def persons_route():
  if request.method.upper() == 'GET':
    persons = Person.query.all()
    return jsonify({
        'persons': [person.to_dict() for person in persons]
      })
  elif request.method.upper() == 'POST':
    person = Person(name=request.json.get('name'))
    person.save()
    # An event happend so we are going to call the event.set
    # so that all the waiters would wake up and be unblocked.
    event.set()
    event.clear()
    return jsonify(person.to_dict())

@app.route('/')
def index():
  return render_template('index.html')


def start():
  WSGIServer(('', 53000), app.wsgi_app).serve_forever()
