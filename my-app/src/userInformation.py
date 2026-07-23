from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import bcrypt
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)
client = MongoClient(os.getenv("MONGO_URI"))

db = client["FinanceTracker"]

users = db["users"]

@app.route("/")
def home():
    return render_template("signup.html")

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    firstName = data["firstName"]
    lastName = data["lastName"]
    username = data["username"]
    email = data["email"]
    password = data["password"]

    existing_user = users.find_one({
        "$or": [
            {"username": username},
            {"email": email}
        ]
    })

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Username or email already exists."
        }), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    user = {
        "firstName": firstName,
        "lastName": lastName,
        "username": username,
        "email": email,
        "password": hashed_password.decode("utf-8")
    }


    users.insert_one(user)

    return jsonify({
        "success": True,
        "message": "Account created successfully."
    })


if __name__ == "__main__":
    app.run(debug=True)

