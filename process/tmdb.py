"""
Provides many functions to get data from TheMovieDB.
"""
import os
import requests
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
URL_IMAGE = "https://www.themoviedb.org/t/p/w185_and_h278_multi_faces"
URL_NO_IMAGE = (
    "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-"
    "picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
)


def get_popular_movie(page):
    """
    Get all information about popular movies from TheMovieDB.
    """
    tmdb_response = requests.get(
        "https://api.themoviedb.org/3/movie/popular?api_key="
        + os.getenv("API_KEY")
        + f"&language=en-US&page={page}",
    )
    tmdb_response_json = tmdb_response.json()

    id_movie = []
    poster_path = []
    title = []
    vote_average = []
    release_date = []
    popularity = []

    for i in range(len(tmdb_response_json["results"])):
        id_movie.append(tmdb_response_json["results"][i]["id"])
        poster_path.append(
            "".join([URL_IMAGE, tmdb_response_json["results"][i]["poster_path"]])
        )
        title.append(tmdb_response_json["results"][i]["title"])
        vote_average.append(tmdb_response_json["results"][i]["vote_average"])
        release_date.append(tmdb_response_json["results"][i]["release_date"])
        popularity.append(tmdb_response_json["results"][i]["popularity"])
    return (id_movie, poster_path, title, vote_average, release_date, popularity)


def get_top_rated_movie(page):
    """
    Get all information about top rated movies from TheMovieDB.
    """
    tmdb_response = requests.get(
        "https://api.themoviedb.org/3/movie/top_rated?api_key="
        + os.getenv("API_KEY")
        + f"&language=en-US&page={page}",
    )
    tmdb_response_json = tmdb_response.json()

    id_movie = []
    poster_path = []
    title = []
    vote_average = []
    release_date = []
    popularity = []

    for i in range(len(tmdb_response_json["results"])):
        id_movie.append(tmdb_response_json["results"][i]["id"])
        poster_path.append(
            "".join([URL_IMAGE, tmdb_response_json["results"][i]["poster_path"]])
        )
        title.append(tmdb_response_json["results"][i]["title"])
        vote_average.append(tmdb_response_json["results"][i]["vote_average"])
        release_date.append(tmdb_response_json["results"][i]["release_date"])
        popularity.append(tmdb_response_json["results"][i]["popularity"])
    return (id_movie, poster_path, title, vote_average, release_date, popularity)


def get_detail_movie(movie_id):
    """
    Get details of each movie from TheMovieDB.
    """
    tmdb_response = requests.get(
        "https://api.themoviedb.org/3/movie/"
        + movie_id
        + "?api_key="
        + os.getenv("API_KEY")
        + "&language=en-US",
    )
    tmdb_response_json = tmdb_response.json()

    genres_temp = []

    poster_path = "".join([URL_IMAGE, tmdb_response_json["poster_path"]])
    title = tmdb_response_json["title"]
    vote_average = tmdb_response_json["vote_average"]
    release_date = tmdb_response_json["release_date"]
    popularity = tmdb_response_json["popularity"]
    runtime = tmdb_response_json["runtime"]
    for i in tmdb_response_json["genres"]:
        genres_temp.append(i["name"])
    genres = ", ".join(genres_temp)
    overview = tmdb_response_json["overview"]

    return (
        poster_path,
        title,
        vote_average,
        release_date,
        popularity,
        runtime,
        genres,
        overview,
    )


def get_search_movie(movie_name, page):
    """
    Search for movies that are related to the keywords the user searches for from TheDBMovie.
    """
    tmdb_response = requests.get(
        "https://api.themoviedb.org/3/search/multi?api_key="
        + os.getenv("API_KEY")
        + "&language=en-US&query="
        + movie_name
        + f"&page={page}&include_adult=false",
    )
    tmdb_response_json = tmdb_response.json()

    exist_search_movie = len(tmdb_response_json["results"]) > 0
    id_movie = []
    poster_path = []
    title = []
    vote_average = []
    release_date = []
    media_type = []

    for i in range(len(tmdb_response_json["results"])):
        if (
            "backdrop_path" in tmdb_response_json["results"][i]
            and "release_date" in tmdb_response_json["results"][i]
            or "first_air_date" in tmdb_response_json["results"][i]
        ):
            id_movie.append(tmdb_response_json["results"][i]["id"])
            if tmdb_response_json["results"][i]["poster_path"] is None:
                poster_path.append(URL_NO_IMAGE)
            else:
                poster_path.append(
                    "".join(
                        [URL_IMAGE, tmdb_response_json["results"][i]["poster_path"]]
                    )
                )

            if tmdb_response_json["results"][i]["media_type"] == "movie":
                title.append(tmdb_response_json["results"][i]["title"])
                vote_average.append(tmdb_response_json["results"][i]["vote_average"])
                release_date.append(tmdb_response_json["results"][i]["release_date"])
                media_type.append(tmdb_response_json["results"][i]["media_type"])
            elif tmdb_response_json["results"][i]["media_type"] == "tv":
                title.append(tmdb_response_json["results"][i]["original_name"])
                vote_average.append(tmdb_response_json["results"][i]["vote_average"])
                release_date.append(tmdb_response_json["results"][i]["first_air_date"])
                media_type.append(tmdb_response_json["results"][i]["media_type"])
            else:
                pass
    return (
        exist_search_movie,
        id_movie,
        poster_path,
        title,
        vote_average,
        release_date,
        media_type,
    )


def get_filter_movie(movie_genre, page):
    """
    Filter for movies that are related to the genres the user selects for from TheDBMovie.
    """
    tmdb_response = requests.get(
        "https://api.themoviedb.org/3/discover/movie?api_key="
        + os.getenv("API_KEY")
        + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video="
        + f"false&page={page}&with_genres="
        + movie_genre,
    )
    tmdb_response_json = tmdb_response.json()

    id_movie = []
    poster_path = []
    title = []
    vote_average = []
    release_date = []
    popularity = []

    for i in range(len(tmdb_response_json["results"])):
        id_movie.append(tmdb_response_json["results"][i]["id"])
        if tmdb_response_json["results"][i]["poster_path"] is None:
            poster_path.append(URL_NO_IMAGE)
        else:
            poster_path.append(
                "".join([URL_IMAGE, tmdb_response_json["results"][i]["poster_path"]])
            )
        title.append(tmdb_response_json["results"][i]["title"])
        vote_average.append(tmdb_response_json["results"][i]["vote_average"])
        release_date.append(tmdb_response_json["results"][i]["release_date"])
        popularity.append(tmdb_response_json["results"][i]["popularity"])
    return (
        id_movie,
        poster_path,
        title,
        vote_average,
        release_date,
        popularity,
    )
