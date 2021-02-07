from flask import Flask, request, jsonify, session
import json
import os
from datetime import timedelta
app = Flask(__name__, static_folder='./build', static_url_path='/')
try:
    key = open('data/secret_key', 'rb').read()
except:
    key = os.urandom(16)
    open('data/secret_key', 'wb').write(key)
app.secret_key = key
app.permanent_session_lifetime = timedelta(days=1000)
notes = [{"id": 0, "note": "First note"}, {"id": 1, "note": "Second note"}]
# user data stored as {"password": "1234", "notes": [ "server stuff" ]},

def writeUser(uname, stuff):
    try:
        json.dump(stuff,open(f'data/{uname}.json', 'w'))
        return True
    except FileNotFoundError: 
        print("write error" + uname , e)
        return False 

def readUser(uname):
    try:
        return json.load(open(f'data/{uname}.json', 'r'))
    except FileNotFoundError: return {}

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/notes', methods=['GET', "POST"])
def notes_page():
    if request.method == "GET":
        j = readUser(session["user"])
        return jsonify(j.get('notes', []))
    elif request.method == "POST":
        data = readUser(session["user"])
        if "notes" not in data.keys(): data["notes"] = []
        data['notes'].append(request.json.get("note", ""))
        writeUser(session["user"], data) 
        return jsonify(True)

@app.route('/notes/<id>', methods=['GET',"PUT", "DELETE"])
def note_page(id):
    id = int(id)
    if request.method == 'GET':
        return jsonify(readUser(session["user"])["notes"][id]) 
    elif request.method == "PUT":
        try:
            data = readUser(session["user"])
            data["notes"][id] = request.json["note"]
            writeUser(session["user"], data)
            return jsonify(True)
        except: return jsonify(False)
    elif request.method == "DELETE":
        try:
            data = readUser(session["user"])
            data["notes"].pop(id)
            writeUser(session["user"], data)
            return jsonify(True)
        except: return jsonify(False)


@app.route('/user', methods=['GET', 'POST'])
def check_user_req():
    return jsonify(check_user())
def check_user():
    if request.method == "GET":
        return session.get("user", False)

    if "user" not in session:
        if request.method == 'POST':
            session.permanent = True
            data = {}
            try:
                username = request.json["username"]
                try:
                    with open(f'data/{username}.json', 'r') as fp:
                        data = json.load(fp)
                    if data["password"] != request.json["password"]: return False
                except FileNotFoundError as e:
                    print("newuser", e)
                    with open(f'data/{username}.json', 'w') as fp:
                        data["password"] = request.json["password"]
                        json.dump(data, fp)
                session["user"] = username
                return username
            except KeyError as e:
                print("loginfail", e)
                return False


if "__main__" == __name__:
    os.makedirs("data", exist_ok=True)
    app.run(debug=True)
