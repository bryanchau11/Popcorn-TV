"""
Provides a function to filter for movie.
"""
import json
import flask

from tmdb import get_filter_movie


def get_filter():
    """
    Based on the genre of the movie to get all the latest movies of that genre.
    """
    movie_genre = flask.request.json.get("movie_genre")
    (
        id_movie,
        poster_path,
        title,
        vote_average,
        release_date,
        popularity,
    ) = get_filter_movie(movie_genre)

    filter_movie = [
        {
            "id_movie": id_movie,
            "poster_path": poster_path,
            "title": title,
            "vote_average": vote_average,
            "release_date": release_date,
            "popularity": popularity,
        }
        for id_movie, poster_path, title, vote_average, release_date, popularity in zip(
            id_movie,
            poster_path,
            title,
            vote_average,
            release_date,
            popularity,
        )
    ]

    movie_data = {
        "filter_movie": filter_movie,
    }
    data = json.dumps(movie_data)

    return data
