from flask import Flask, render_template, jsonify

app = Flask(__name__)

portfolio_data = {
    "name":
    "Aayushi KC",
    "age":
    14,
    "address":
    "Ranibari,lazimpart,ktm,Nepal",
    "school":
    "REHDON Education Foundation",
    "grade":
    "9th Grade",
    "achievements": [
        "Second position in Inner school art compition nepali date:2079-08-13",
        "Formal Program Host for Annual Parents’ Day 2081, organized by Rehdon at Nepal Academy Hall.",
    ],
    "hobbies": ["Art", "Playing teniss", "Coding"],
    "interests": ["Web Development"]
}


@app.route('/')
def homepage():
    return render_template('homepage/index.html', data=portfolio_data)


@app.route('/blog')
def blog():
    return "Blog page coming soon!"


@app.route('/calculator')
def calculator():
    return "Calculator page coming soon!"


@app.route('/api/portfolio')
def get_portfolio():
    return jsonify(portfolio_data)


if __name__ == '__main__':
    print("Server running!")
    print("Homepage: http://localhost:5000")
    print("Blog: http://localhost:5000/blog")
    print("Calculator: http://localhost:5000/calculator")
    app.run(debug=True, port=5000, host='0.0.0.0')
