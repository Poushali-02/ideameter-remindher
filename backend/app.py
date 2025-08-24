from flask import Flask, request, jsonify
from pcod_tracker import ask_assistant

app = Flask(__name__)

@app.route('/pcod_tracker', methods=['POST','GET'])
def ask_genai():
    if request.method == 'POST':
        data = request.json
        symptoms = data.get("symptoms")
        weight = data.get("weight")
        height = data.get("height")
        age = data.get("age")
        response = ask_assistant(symptoms, weight, height, age)
        return jsonify(response)

    return jsonify({"warning": "Did not get an advice, did you fill the form up?"})

if __name__ == '__main__':
    app.run(debug=True)