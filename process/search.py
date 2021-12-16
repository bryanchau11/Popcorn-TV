"""
Provides a function to search for movie.
"""
import json
import flask

from tmdb import get_search_movie


def get_search():
    """
    Based on the keywords that users search to find movies related to that keyword.
    If the search information does not exist, it returns no movies related to the keyword,
    otherwise returns the movies related to the keyword.
    """
    movie_name = flask.request.json.get("movie_name")
    page = flask.request.json.get("page")
    (
        exist_search_movie,
        id_movie,
        poster_path,
        title,
        vote_average,
        release_date,
        popularity,
        overview,
    ) = get_search_movie(movie_name, page)

    search_movie = [
        {
            "id_movie": id_movie,
            "poster_path": poster_path,
            "title": title,
            "vote_average": vote_average,
            "release_date": release_date,
            "popularity": popularity,
            "overview": overview,
        }
        for id_movie, poster_path, title, vote_average, release_date, popularity, overview in zip(
            id_movie,
            poster_path,
            title,
            vote_average,
            release_date,
            popularity,
            overview,
        )
    ]

    movie_data = {
        "exist_search_movie": exist_search_movie,
        "search_movie": search_movie,
    }
    data = json.dumps(movie_data)

    return data
