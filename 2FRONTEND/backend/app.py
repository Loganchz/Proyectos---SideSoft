import os
from pathlib import Path

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

load_dotenv(BASE_DIR / ".env")

app = Flask(__name__, static_folder=str(FRONTEND_DIR))
CORS(app)

CMC_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
CMC_API_KEY = os.getenv("CMC_API_KEY")
PORT = int(os.getenv("PORT", "3000"))


@app.get("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/api/cryptos")
def get_cryptos():
    if not CMC_API_KEY:
        return jsonify({"error": "Missing CMC_API_KEY in environment variables."}), 500

    try:
        response = requests.get(
            CMC_URL,
            params={"start": 1, "limit": 100, "convert": "USD"},
            headers={
                "Accept": "application/json",
                "X-CMC_PRO_API_KEY": CMC_API_KEY,
            },
            timeout=20,
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.HTTPError:
        return (
            jsonify(
                {
                    "error": "CoinMarketCap request failed.",
                    "details": response.text,
                }
            ),
            response.status_code,
        )
    except requests.RequestException as exc:
        return (
            jsonify(
                {
                    "error": "Unable to fetch CoinMarketCap data.",
                    "details": str(exc),
                }
            ),
            500,
        )


@app.get("/<path:path>")
def static_proxy(path):
    return send_from_directory(FRONTEND_DIR, path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)
