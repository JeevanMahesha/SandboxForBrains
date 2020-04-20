from flask import Flask
app = Flask(__name__)

@app.route('/') # Home page route
def home():
    return 'Hello World...!'

app.run(port=5000)
