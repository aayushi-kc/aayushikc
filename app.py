from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def homepage():
    return render_template('homepage/index.html')

@app.route('/blog')
def blog():
    return render_template('blog/index.html')

@app.route('/calculator')
def calculator():
    return render_template('calculator/index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
