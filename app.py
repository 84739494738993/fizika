from flask import Flask, request, send_file, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Firebase init
# cred = credentials.Certificate("/etc/secrets/secret-firebase-key.json")
cred = credentials.Certificate("secret-firebase-key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)

# Авторизация
USERNAME = "q031"
PASSWORD = "1"
USERNAME_admin = "admin"
PASSWORD_admin = "1"

# Базовая директория проекта (для путей к HTML)
basedir = os.path.abspath(os.path.dirname(__file__))

@app.route("/")
def index():
    return send_file(os.path.join(basedir, "index", "login.html"))

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    
    if username == USERNAME_admin and password == PASSWORD_admin:
        response = send_file(os.path.join(basedir, "index", "index_admin.html"))
        response.set_cookie("user", "admin")
        return response
    elif username == USERNAME and password == PASSWORD:
        response = send_file(os.path.join(basedir, "index", "index.html"))
        response.set_cookie("user", "user")
        return response
    else:
        return "Неверный логин или пароль", 401

@app.route("/data")
def get_data():
    user = request.cookies.get("user")
    doc_ref = db.collection("Information").document("o6FJZwzY83MKzYZRk2Vd")
    doc = doc_ref.get()

    if not doc.exists:
        return jsonify({"error": "Документ не найден"}), 404

    data = doc.to_dict()

    if user in ["admin", "user"]:
        return jsonify({
            "Name_Tasks": data.get("Name_Tasks", []),
            "Answers": data.get("Answers", [])
        })
    else:
        return jsonify({"error": "Неавторизован"}), 401

@app.route("/update_questions", methods=["POST"])
def update_questions():
    user = request.cookies.get("user")
    if user != "admin":
        return jsonify({"error": "Доступ запрещён"}), 403

    data = request.get_json()
    questions = data.get("questions")
    if questions is None:
        return jsonify({"error": "Нет данных"}), 400

    db.collection("Information").document("o6FJZwzY83MKzYZRk2Vd").update({
        "Name_Tasks": questions
    })
    return jsonify({"status": "ok"})

@app.route("/update_answers", methods=["POST"])
def update_answers():
    user = request.cookies.get("user")
    if user != "admin":
        return jsonify({"error": "Доступ запрещён"}), 403

    data = request.get_json()
    answers = data.get("answers")
    if answers is None:
        return jsonify({"error": "Нет данных"}), 400

    db.collection("Information").document("o6FJZwzY83MKzYZRk2Vd").update({
        "Answers": answers
    })
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)
