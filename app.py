import imp
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import render_template
import web


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] ='postgresql://postgres:vallabh@localhost/test'
app.debug= True
db = SQLAlchemy(app)

class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(80), unique=True)
    email=db.Column(db.String(120), unique=True)

    def __init__(self,username,email):
        self.username = username
        self.email=email

        def __repr__(self):
            return '<User %r>' % self.username

@app.route('/')
# def download():
#     return web.download()
def index():
    return render_template('mainwindow.html')
@app.route('/post_user', methods=['POST'])
def post_user():
    # return web.download()
    user = User
if __name__ == "__main__":
    app.run()