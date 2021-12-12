"""
Provides a function to get details of a movie.
"""
import json
import flask

from tmdb import get_detail_movie


def get_detail():
    """
    Based on the id of each movie to get all the information about that movie.
    """
    movie_id = flask.request.json.get("movie_id")
    page = flask.request.json.get("page")
    (
        poster_path,
        title,
        vote_average,
        release_date,
        popularity,
        runtime,
        genres,
        overview,
    ) = get_detail_movie(movie_id, page)

    detail_movie = {
        "poster_path": poster_path,
        "title": title,
        "vote_average": vote_average,
        "release_date": release_date,
        "popularity": popularity,
        "runtime": runtime,
        "genres": genres,
        "overview": overview,
    }
    data = json.dumps(detail_movie)

    return data
