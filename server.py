from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from googletrans import Translator
import os

app = Flask(__name__)
CORS(app)
translator = Translator()

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        word = data.get('word', '')
        if not word:
            return jsonify({'error': 'No word provided'}), 400
            
        # Translate from English to Traditional Chinese
        translation = translator.translate(word, src='en', dest='zh-tw')
        
        return jsonify({
            'word': word,
            'meaning': translation.text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 