from flask import Flask, request, jsonify, session
import json
from datetime import timedelta
username = ''
app = Flask(__name__)
app.secret_key = 'App'
app.permanent_session_lifetime = timedelta(days=1000)
notes = [{"id": 0, "note": "First note"}, {"id": 1, "note": "Second note"}]


@app.route('/all', methods=['GET'])
def notes_page():
    return jsonify(notes)


@app.route('/note/<id>', methods=['GET'])
def note_page(id):
    if request.method == 'GET':
        id = int(id)
        results = []
        for note in notes:
            if note["id"] == id:
                results.append(note)
        return jsonify(results)


@app.route('/delete/<id>', methods=['GET'])
def deleting(id):
    if request.method == 'GET':
        id = int(id)
        for note in notes:
            if note["id"] == id:
                notes.remove(note)
        with open(f"{username}.json", 'w') as fp:
            json.dump(notes, fp)
        return True

@app.route('/user', methods=['GET', 'POST'])
def check_user():
    global username
    if "user" not in session:
        if request.method == 'POST':
            session.permanent = True
            username = request.form["username"]
            session["user"] = username
            try:
                with open(f'{username}.json', 'r') as fp:
                    data = json.load(fp)
                return True
            except:
                return False


@app.route('/uid/notes/createnote', methods=['POST'])
def create_note():
    data = {"id": 0, "note": ""}
    data['id'] = request.form["id"]
    data["note"] = request.form["note"]
    notes.append(data)
    with open(f"{username}.json", 'w') as fp:
        json.dump(notes, fp)


if "__main__" == __name__:
    app.run(debug=True)
