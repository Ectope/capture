from flask import Flask, send_file

app = Flask(__name__)

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/physiological-settings')
def physiological_settings():
    return send_file('physiological-and-pacemaker-settings.txt')

if __name__ == '__main__':
    app.run(debug=True)
