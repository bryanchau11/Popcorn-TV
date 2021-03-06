# pylint: disable = C0413, C0103, C0411, E0401, E1101, W1508

"""
Provides all the functions such as creating a model to store data in the database,
sign up, sign in, sign out, load popular movies / top rated movies, search, detail,
store comment, load comments, calulate avg rating according to each user.
"""
import os
import json
import sys
import flask

sys.path.append("./process")

from flask_login import login_user, current_user, LoginManager, logout_user
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

from tmdb import get_popular_movie, get_top_rated_movie
from search import get_search
from detail import get_detail
from filter import get_filter

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = flask.Flask(__name__, static_folder="./build/static")
# This tells our Flask app to look at the results of `npm build` instead of the
# actual files in /templates when we're looking for the index page file. This allows
# us to load React code into a webpage. Look up create-react-app for more reading on
# why this is necessary.
bp = flask.Blueprint("bp", __name__, template_folder="./build")
# Point SQLAlchemy to your Heroku database
db_url = os.getenv("DATABASE_URL")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
# Gets rid of a warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = b"I am a secret key!"  # don't defraud my app ok?


##### MODELS #####
db = SQLAlchemy(app)


class User(UserMixin, db.Model):
    """
    Initialize the User model to store the registered user.
    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))

    def __repr__(self):
        return f"<User {self.username}>"

    def get_username(self):
        """
        Returns the username value.
        """
        return self.username


class Comment(db.Model):
    """
    Initialize the Comments model to store the comments and ratings that the user
    has commented and rated.
    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(1000))
    date = db.Column(db.String(100))
    hour = db.Column(db.String(100))
    rating = db.Column(db.Integer)

    def __repr__(self):
        return f"<Rating {self.comment}>"

    def get_rating(self):
        """
        Returns the rating value.
        """
        return self.rating


class Favorite(db.Model):
    """
    Initialize the Favorite model to store the favorite that the user has liked
    for each movie.
    """

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    poster_path = db.Column(db.String(1000))
    name = db.Column(db.String(1000))
    vote_average = db.Column(db.String(100))
    release_date = db.Column(db.String(100))
    overview = db.Column(db.String(500))
    media_type = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Favorite {self.movie_id}>"

    def get_movie_id(self):
        """
        Returns the movie_id value.
        """
        return self.movie_id


db.create_all()


### ROUTES ###
@bp.route("/index")
def index():
    """
    Get all information about popular movies / top rated movies.
    """
    (
        id_movie,
        poster_path,
        title,
        vote_average,
        release_date,
        popularity,
    ) = get_popular_movie(1)

    popular_movie = [
        {
            "id_movie": id_movie,
            "poster_path": poster_path,
            "title": title,
            "vote_average": vote_average,
            "release_date": release_date,
            "popularity": popularity,
        }
        for id_movie, poster_path, title, vote_average, release_date, popularity in zip(
            id_movie, poster_path, title, vote_average, release_date, popularity
        )
    ]

    (
        id_movie,
        poster_path,
        title,
        vote_average,
        release_date,
        popularity,
    ) = get_top_rated_movie(1)

    top_rated_movie = [
        {
            "id_movie": id_movie,
            "poster_path": poster_path,
            "title": title,
            "vote_average": vote_average,
            "release_date": release_date,
            "popularity": popularity,
        }
        for id_movie, poster_path, title, vote_average, release_date, popularity in zip(
            id_movie, poster_path, title, vote_average, release_date, popularity
        )
    ]
    try:
        movie_data = {
            "popular_movie": popular_movie,
            "top_rated_movie": top_rated_movie,
            "username": current_user.username,
        }
    except:
        movie_data = {
            "popular_movie": popular_movie,
            "top_rated_movie": top_rated_movie,
            "username": "",
        }
    data = json.dumps(movie_data)

    return flask.render_template(
        "index.html",
        data=data,
    )


app.register_blueprint(bp)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_name):
    """
    Load user given an id.
    """
    return User.query.get(user_name)


@app.route("/top_rate_movie_page", methods=["POST"])
def top_rate_movie_page():
    page = flask.request.json.get("page")
    (
        id_movie,
        poster_path,
        title,
        vote_average,
        release_date,
        popularity,
    ) = get_top_rated_movie(page)

    top_rated_movie = [
        {
            "id_movie": id_movie,
            "poster_path": poster_path,
            "title": title,
            "vote_average": vote_average,
            "release_date": release_date,
            "popularity": popularity,
        }
        for id_movie, poster_path, title, vote_average, release_date, popularity in zip(
            id_movie, poster_path, title, vote_average, release_date, popularity
        )
    ]
    return flask.jsonify({"status": 200, "top_rated_movie": top_rated_movie})


@app.route("/popular_page", methods=["POST"])
def popular_page():
    page = flask.request.json.get("page")
    (
        id_movie,
        poster_path,
        title,
        vote_average,
        release_date,
        popularity,
    ) = get_popular_movie(page)

    popular_movie = [
        {
            "id_movie": id_movie,
            "poster_path": poster_path,
            "title": title,
            "vote_average": vote_average,
            "release_date": release_date,
            "popularity": popularity,
        }
        for id_movie, poster_path, title, vote_average, release_date, popularity in zip(
            id_movie, poster_path, title, vote_average, release_date, popularity
        )
    ]
    return flask.jsonify({"status": 200, "popular_movie": popular_movie})


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    """[summary]
    Args:
        path ([type]): [description]
    Returns:
        [type]: [description]
    """
    return flask.redirect(flask.url_for("bp.index"))


@app.route("/signout", methods=["POST"])
def login_asSignOut():

    return flask.redirect(flask.url_for("login"))


@app.route("/signout1", methods=["POST"])
def logout():
    """
    Log out of the current account and return to the login page.
    """
    logout_user()
    return flask.redirect(flask.url_for("bp.index"))


@app.route("/signup")
def signup():
    """
    Render a signup page.
    """
    return flask.render_template("signup.html")


@app.route("/signup", methods=["POST"])
def signup_post():
    """
    Get username from input text, check if this username is registered or not.
    If registered, do not allow that username to be saved to the database.
    Otherwise, allow that username to be saved to the database.
    Finally, it will go to the login page.
    """
    username = flask.request.form.get("username")
    email = flask.request.form.get("email")
    password = flask.request.form.get("password")
    user = User.query.filter_by(email=email).first()
    if user:
        pass
    else:
        user = User(
            username=username,
            email=email,
            password=generate_password_hash(password, method="sha256"),
        )
        db.session.add(user)
        db.session.commit()

    return flask.redirect(flask.url_for("login"))


@app.route("/login")
def login():
    """
    Render a login page.
    """
    return flask.render_template("login.html")


@app.route("/login", methods=["POST"])
def login_post():
    """
    Get email and password from input text, check if this email and this password are registered
    or not. If registered, it will go to the index page. Otherwise, show error message.
    """
    email = flask.request.form.get("email")
    password = flask.request.form.get("password")
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return flask.redirect(flask.url_for("bp.index"))
    return flask.jsonify({"status": 401, "reason": "Username or Password Error"})


@app.route("/")
def main():
    """
    If the user has logged in before, it will go to the index page.
    Otherwise, it will stay at the login page.


    if current_user.is_authenticated:
        return flask.redirect(flask.url_for("bp.index"))
    return flask.redirect(flask.url_for("login"))
    """
    return flask.redirect(flask.url_for("bp.index"))


@app.route("/search", methods=["POST"])
def search():
    """
    Search for information of a movie through keyword.
    """
    data = get_search()
    return flask.jsonify({"status": 200, "search": data})


@app.route("/detail", methods=["POST"])
def detail():
    """
    Get all details of a movie.
    """
    data = get_detail()
    return flask.jsonify({"status": 200, "detail": data})


@app.route("/check_liked", methods=["POST"])
def check_liked():
    """
    Check if the user has liked the movie.
    """
    email = current_user.email
    movie_id = flask.request.json.get("movie_id")

    query_favorite = Favorite.query.filter_by(email=email).all()

    movie_ids = []
    for item in query_favorite:
        movie_ids.append(item.movie_id)

    exists = int(movie_id) in movie_ids

    return flask.jsonify({"status": 200, "check": exists})


@app.route("/liked", methods=["POST"])
def get_liked():
    """
    Handling function when user press like movie.
    """
    email = current_user.email
    movie_id = flask.request.json.get("movie_id")
    poster_path = flask.request.json.get("poster_path")
    name = flask.request.json.get("title")
    vote_average = flask.request.json.get("vote_average")
    release_date = flask.request.json.get("release_date")
    overview = flask.request.json.get("overview")
    db.session.add(
        Favorite(
            email=email,
            movie_id=movie_id,
            name=name,
            poster_path=poster_path,
            vote_average=vote_average,
            release_date=release_date,
            overview=overview,
            media_type="movie",
        )
    )
    db.session.commit()

    return flask.jsonify({"status": 200, "message": "Successful"})


@app.route("/likedTV", methods=["POST"])
def get_liked_tv():
    """
    Handling function when user press like movie.
    """
    email = current_user.email
    tv_id = flask.request.json.get("movie_id")
    poster_path = flask.request.json.get("poster_path")
    name = flask.request.json.get("name")
    vote_average = flask.request.json.get("vote_average")
    release_date = flask.request.json.get("release_date")
    overview = flask.request.json.get("overview")
    db.session.add(
        Favorite(
            email=email,
            movie_id=tv_id,
            poster_path=poster_path,
            name=name,
            vote_average=vote_average,
            release_date=release_date,
            overview=overview,
            media_type="tv",
        )
    )
    db.session.commit()

    return flask.jsonify({"status": 200, "message": "Successful"})


@app.route("/unliked", methods=["POST"])
def get_unliked():
    """
    Handling function when user press unlike movie.
    """
    email = current_user.email
    movie_id = flask.request.json.get("movie_id")

    Favorite.query.filter_by(email=email, movie_id=movie_id).delete()
    db.session.commit()

    return flask.jsonify({"status": 200, "message": "Successful"})


@app.route("/comment", methods=["POST"])
def save_comment():
    """
    Store all information of comments that belong to a movie from the database.
    """
    username = current_user.username
    movie_id = flask.request.json.get("movie_id")
    comment_movie = flask.request.json.get("comment_movie")
    date_comment = flask.request.json.get("date")
    hour_comment = flask.request.json.get("hour")
    rating = flask.request.json.get("rating")

    db.session.add(
        Comment(
            username=username,
            movie_id=movie_id,
            comment=comment_movie,
            date=date_comment,
            hour=hour_comment,
            rating=rating,
        )
    )
    db.session.commit()

    return flask.jsonify({"status": 200, "message": "Successful"})


@app.route("/all_comment", methods=["POST"])
def get_all_comment():
    """
    Get all information of comments that belong to a movie from the database.
    """
    movie_id = flask.request.json.get("movie_id")

    query_comment = Comment.query.filter_by(movie_id=movie_id).all()

    name = []
    comment = []
    date = []
    hour = []
    rating = []

    for item in query_comment:
        name.append(item.username)
        comment.append(item.comment)
        date.append(item.date)
        hour.append(item.hour)
        rating.append(item.rating)

    all_comment = [
        {
            "name": name,
            "date": date,
            "hour": hour,
            "comment": comment,
            "rating": rating,
        }
        for name, date, hour, comment, rating in zip(name, date, hour, comment, rating)
    ]
    comment_data = {"comment": all_comment}
    data = json.dumps(comment_data)

    return flask.jsonify({"status": 200, "all_comment": data})


@app.route("/avg_rating", methods=["POST"])
def get_avg_rating():
    """
    Get all ratings that belong to a movie from the database, then calculate its average value.
    This value will be rounded.
    """
    movie_id = flask.request.json.get("movie_id")

    query_comment = Comment.query.filter_by(movie_id=movie_id).all()

    rating = []

    for item in query_comment:
        rating.append(item.rating)

    if len(rating) > 0:
        avg_rating = round(sum(rating) / len(rating))
    else:
        avg_rating = 0

    return flask.jsonify({"status": 200, "avg_rating": avg_rating})


@app.route("/filter", methods=["POST"])
def filter_movie():
    """
    Filter movies by genre.
    """
    data = get_filter()
    return flask.jsonify({"status": 200, "filter": data})


## TEST DB


query_favorite = Favorite.query.filter_by(email="bryan@gmail.com").all()
for item in query_favorite:
    print(item.media_type)
##


@app.route("/all_favorite", methods=["POST"])
def get_all_favorite():
    """
    Load all the movies that the user has liked.
    """
    email = current_user.email

    query_favorite = Favorite.query.filter_by(email=email).all()
    # Movie
    movie_id = []
    poster_path_movie = []
    name_movie = []
    vote_average_movie = []
    release_date_movie = []
    overview_movie = []
    # TV
    tv_id = []
    poster_path_tv = []
    name_tv = []
    vote_average_tv = []
    release_date_tv = []
    overview_tv = []

    for item in query_favorite:
        if item.media_type == "tv":
            tv_id.append(item.movie_id)
            poster_path_tv.append(item.poster_path)
            name_tv.append(item.name)
            vote_average_tv.append(item.vote_average)
            release_date_tv.append(item.release_date)
            overview_tv.append(item.overview)

        else:
            movie_id.append(item.movie_id)
            poster_path_movie.append(item.poster_path)
            name_movie.append(item.name)
            vote_average_movie.append(item.vote_average)
            release_date_movie.append(item.release_date)
            overview_movie.append(item.overview)
    all_favorite_movie = [
        {
            "movie_id": movie_id,
            "poster_path": poster_path,
            "name": name,
            "vote_average": vote_average,
            "first_air_date": release_date,
            "overview": overview,
        }
        for movie_id, poster_path, name, vote_average, release_date, overview in zip(
            movie_id,
            poster_path_movie,
            name_movie,
            vote_average_movie,
            release_date_movie,
            overview_movie,
        )
    ]
    all_favorite_tv = [
        {
            "tv_id": tv_id,
            "poster_path": poster_path,
            "name": name,
            "vote_average": vote_average,
            "first_air_date": release_date,
            "overview": overview,
        }
        for tv_id, poster_path, name, vote_average, release_date, overview in zip(
            tv_id,
            poster_path_tv,
            name_tv,
            vote_average_tv,
            release_date_tv,
            overview_tv,
        )
    ]

    return flask.jsonify({"tvList": all_favorite_tv, "movieList": all_favorite_movie})


@app.route("/get_username", methods=["POST"])
def get_username():
    """
    Get current username from database.
    """
    try:
        username = current_user.username
    except:
        username = ""
    return flask.jsonify({"status": 200, "username": username})


@app.route("/change_settings", methods=["POST"])
def change_settings():
    """
    Update user information such as username, password.
    """
    username = current_user.username
    new_username = flask.request.json.get("new_username")
    new_password = flask.request.json.get("new_password")

    query_user = User.query.filter_by(username=username).first()
    if not new_password:
        query_user.username = new_username
        db.session.commit()
    else:
        query_user.username = new_username
        query_user.password = generate_password_hash(new_password, method="sha256")
        db.session.commit()

    return flask.jsonify({"status": 200, "change": new_username})


app.run(
    host=os.getenv("IP", "0.0.0.0"),
    port=int(os.getenv("PORT", 8081)),
)
