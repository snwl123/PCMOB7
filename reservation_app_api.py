# A very simple Flask Hello World app for you to get started with...

from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt import JWT, jwt_required, current_identity
import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////home/weilin/reservation_app/db.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_EXPIRATION_DELTA"] = datetime.timedelta(days=1)

db = SQLAlchemy(app)

app.config["SECRET_KEY"] = ""

def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and password == user.password:
        return user

def identity(payload):
    return User.query.filter_by(id=payload["identity"]).first()

jwt = JWT(app, authenticate, identity)

@app.route('/whoami')
@jwt_required()
def whoami():
    return { "username": current_identity.username }

class User(db.Model):
    #no need init
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(30))
    password = db.Column(db.String(30))

    def json(self):
        return {
                "id": self.id,
                "username": self.username,
                "password": self.password
                }

class Events(db.Model):
    #no need init
    event_id = db.Column(db.Integer, primary_key = True)
    event_name = db.Column(db.String(50), nullable=False)
    created_date = db.Column(db.DateTime(), nullable=False, default = datetime.datetime.now())
    event_date = db.Column(db.DateTime(), nullable=False)
    event_start_time = db.Column(db.DateTime(), nullable=False)
    event_end_time = db.Column(db.DateTime(), nullable=False)
    category = db.Column(db.String(10), nullable=False, default = "Upcoming")
    guests = db.relationship('Guests', backref='events', cascade="delete, save-update")

    def json(self):
        return {
                "event_id": self.event_id,
                "event_name": self.event_name,
                "created_date": self.created_date,
                "event_date": self.event_date,
                "event_start_time": self.event_start_time,
                "event_end_time": self.event_end_time,
                "category": self.category
                }

class Guests(db.Model):
    # no need init
    guest_id = db.Column(db.Integer, primary_key = True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.event_id"), nullable=False)
    guest_name = db.Column(db.String(25), nullable=False)
    no_of_people = db.Column(db.Integer, nullable=False)
    guest_start_time = db.Column(db.DateTime(), nullable=False)
    guest_end_time = db.Column(db.DateTime(), nullable=False)

    def json(self):
        return {
                "guest_id": self.guest_id,
                "event_id": self.event_id,
                "guest_name": self.guest_name,
                "no_of_people": self.no_of_people,
                "guest_start_time": self.guest_start_time,
                "guest_end_time": self.guest_end_time
                }

db.create_all()

@app.route('/', methods=["GET","POST"])
def index():
    if request.method =="POST":
        return { 'about': "This is an API for a reservation app. Please GET / to find out more." }
    return render_template("index.html")

@app.route('/newuser', methods=["POST"])
def createNewUser():
    json_data = request.get_json(force=True)

    username = json_data["username"]
    password = json_data["password"]

    if "username" in json_data and "password" in json_data:
        users = User.query.all()
        for user in users:
            if username == user.username:
                return { "Error" : "Username is taken!" }
        new_user = User(username=username, password = password)
        db.session.add(new_user)
        db.session.commit()
        return  { "Message" : "Registration success!" }

    else:
        return { "Message" : "Username or password is missing!" }

@app.route('/users', methods=["GET", "DELETE"])
def getAllUsers():
    users = User.query.all()
    if request.method == "GET":
        json_users = []
        for user in users:
            json_users.append(user.json())
        return jsonify(json_users)

    if request.method == "DELETE":
        db.session.delete(users)
        db.session.commit()
        return { "Message":"Users have been deleted."}



@app.route('/events', methods=["POST", "GET"])
def allEvents():
    if request.method == "GET":
        events = Events.query.all()
        json_events = []
        for event in events:
            json_events.append(event.json())
        return jsonify(json_events)

    if request.method == "POST":
        dateTimeFormat = "%Y-%m-%dT%H:%M:%S.%fZ"
        json_data = request.get_json(force=True)
        event_name = json_data["event_name"]
        event_date = datetime.datetime.strptime(json_data["event_date"], dateTimeFormat)
        event_start_time = datetime.datetime.strptime(json_data["event_start_time"], dateTimeFormat)
        event_end_time = datetime.datetime.strptime(json_data["event_end_time"], dateTimeFormat)
        event = Events(
                        event_name = event_name,
                        event_date = event_date,
                        event_start_time = event_start_time,
                        event_end_time = event_end_time
                      )
        db.session.add(event)
        db.session.commit()
        return event.json()


@app.route('/guests', methods=["GET"])
def allGuests():
    guests = Guests.query.all()
    json_guests = []
    for guest in guests:
        json_guests.append(guest.json())
    return jsonify(json_guests)


@app.route('/events/<int:event_id>/guests', methods=["POST","GET"])
def createNewGuests(event_id):
    if request.method == "GET":
        guests = Guests.query.filter_by(event_id=event_id)
        json_guests = []
        for guest in guests:
            json_guests.append(guest.json())
        return jsonify(json_guests)

    if request.method == "POST":
        dateTimeFormat = "%Y-%m-%dT%H:%M:%S.%fZ"
        json_data = request.get_json(force=True)
        guest_name = json_data["guest_name"]
        no_of_people = json_data["no_of_people"]
        guest_start_time = datetime.datetime.strptime(json_data["guest_start_time"],dateTimeFormat)
        guest_end_time = datetime.datetime.strptime(json_data["guest_end_time"],dateTimeFormat)
        guest = Guests(
                        event_id = event_id,
                        guest_name=guest_name,
                        no_of_people = no_of_people,
                        guest_start_time = guest_start_time,
                        guest_end_time = guest_end_time
                      )
        db.session.add(guest)
        db.session.commit()
        return guest.json()



@app.route('/events/<int:id>', methods=["GET", "DELETE", "PUT"])
def getEvent(id):
    event = Events.query.get(id)

    if request.method == "DELETE":
        db.session.delete(event)
        db.session.commit()
        return { "Message":"Event " + str(id) + " has been deleted."}

    if request.method == "PUT":
        dateTimeFormat = "%Y-%m-%dT%H:%M:%S.%fZ"
        json_data = request.get_json(force=True)
        if "event_name"in json_data:
            event.event_name = json_data["event_name"]
        if "event_date " in json_data:
            event.event_date = datetime.datetime.strptime(json_data["event_date"],dateTimeFormat)
        if "event_start_time" in json_data:
            event.event_start_time = datetime.datetime.strptime(json_data["event_start_time"],dateTimeFormat)
        if "event_end_time" in json_data:
            event.event_end_time = datetime.datetime.strptime(json_data["event_end_time"],dateTimeFormat)
        db.session.commit()

    return event.json()

@app.route('/events/<int:event_id>/guests/<int:guest_id>', methods=["GET", "DELETE", "PUT"])
def getGuest(event_id, guest_id):
    guests = Guests.query.filter_by(event_id = event_id, guest_id = guest_id)

    if request.method == "DELETE":
        for guest in guests:
            db.session.delete(guest)
        db.session.commit()
        return { "Message":"Guest " + str(guest_id) + " at Event " + str(event_id) + " has been deleted."}

    if request.method == "PUT":
        dateTimeFormat = "%Y-%m-%dT%H:%M:%S.%fZ"
        json_data = request.get_json(force=True)
        for guest in guests:
            if "guest_name"in json_data:
                guest.guest_name = json_data["guest_name"]
            if "no_of_people" in json_data:
                guest.no_of_people = json_data["no_of_people"]
            if "guest_start_date"in json_data:
                guest.guest_start_time = datetime.datetime.strptime(json_data["guest_start_time"],dateTimeFormat)
            if "guest_end_date" in json_data:
                guest.guest_end_time = datetime.datetime.strptime(json_data["guest_end_time"],dateTimeFormat)
        db.session.commit()

    json_guest = []
    for guest in guests:
            json_guest.append(guest.json())
    return jsonify(json_guest)




if __name__ == "__main__":
    app.run(debug=True)


