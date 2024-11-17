from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from dotenv import load_dotenv
import os
import requests

# Load environment variables
load_dotenv()
TOKEN = os.getenv("TOKEN")
CHAT_ID = os.getenv('CHAT_ID') #CHAT_ID = os.getenv("CHAT_ID")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/trigger-telegram-message', methods=['POST'])
def trigger_telegram_message():
    data = request.json
    if data.get('verified'):
        try:
            # Telegram bot message
            msg = f"Verification was successful. The ETA is accurate. ✅ Location: {data.get('destination')}"
            url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={CHAT_ID}&text={msg}"
            
            # Send the Telegram message
            response = requests.get(url)
            response.raise_for_status()  # Raise error for bad response
            
            return jsonify({'status': 'success', 'response': response.json()}), 200
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500
    else:
        try:
            # Telegram bot message
            msg = f"Verification was Unsuccessful. The ETA is inaccurate. ❌ Location: {data.get('destination')}"
            url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={CHAT_ID}&text={msg}"
            
            # Send the Telegram message
            response = requests.get(url)
            response.raise_for_status()  # Raise error for bad response
            
            return jsonify({'status': 'success', 'response': response.json()}), 200
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
