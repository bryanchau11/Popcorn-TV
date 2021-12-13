import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import "../../style/Detail.css";
import "../../style/bootstrap.min.css";
import "../../App.css";
import SearchBar from "../SearchBar";

import NavigationMenu from "../NavigationMenu";
import axios from "axios";

function DetailTV() {
  const { tvID } = useParams();
  const [detailTV, setDetailTV] = useState([]);
  const textInput = useRef(null);
  const [ratingMovie, setRatingMovie] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [newComment, setNewComment] = useState([]);
  const [liked, setLiked] = useState(false);
  const args = JSON.parse(document.getElementById("data").text);
  const toggleLiked = () => {
    if (liked === false) {
      fetch("/liked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          movie_id: tvID,
          poster_path: detailTV.poster_path,
          title: detailTV.title,
          vote_average: detailTV.vote_average,
          release_date: detailTV.first_air_date,
          popularity: detailTV.popularity
        })
      });
    } else {
      fetch("/unliked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ movie_id: tvID })
      });
    }
    setLiked(!liked);
  };

  useEffect(() => {
    // Get TV detail
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/tv/${tvID}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    };
    const lst = [];
    const genreList = [];
    axios
      .request(options)
      .then(function (response) {
        const result = response.data;
        for (var i = 0; i < result["genres"].length; i++) {
          genreList.push(result["genres"][i]["name"]);
        }

        lst.push({
          first_air_date: result["first_air_date"],
          id: result["id"],
          name: result["name"],
          overview: result["overview"],
          runtime: result["episode_run_time"][0],
          poster_path:
            "https://image.tmdb.org/t/p/w200" + result["poster_path"],
          number_of_episodes: result["number_of_episodes"],
          number_of_seasons: result["number_of_seasons"],
          genres: genreList.join(", ")
        });
        setDetailTV(lst);
        console.log(lst);
        console.log(lst.first_air_date);
        console.log(lst[0].poster_path);
      })
      .catch(function (error) {
        console.error(error);
      });
    // Get TV like
    fetch("/check_liked", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ movie_id: tvID })
    })
      .then((response) => response.json())
      .then((data) => {
        setLiked(data.check);
      });

    fetch("/avg_rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ movie_id: tvID })
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.avg_rating);
        setAvgRating(result);
      });

    fetch("/all_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ movie_id: tvID })
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.all_comment);
        setNewComment(result.comment);
      });
  }, [tvID]);

  const ratingChanged = (newRating) => {
    setRatingMovie(newRating);
  };

  const newListComment = [...newComment];

  function addComment() {
    const newItem = textInput.current.value;
    const currentdate = new Date();
    const dateComment = currentdate.toLocaleDateString();
    const hourComment = currentdate.toLocaleTimeString();

    newListComment.push({
      name: args.username,
      date: dateComment,
      hour: hourComment,
      comment: newItem,
      rating: ratingMovie
    });
    setNewComment(newListComment);

    textInput.current.value = "";

    fetch("/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        movie_id: tvID,
        comment_movie: newItem,
        date: dateComment,
        hour: hourComment,
        rating: ratingMovie
      })
    });

    fetch("/avg_rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ movie_id: tvID })
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.avg_rating);
        setAvgRating(result);
      });
  }
  // Get TV Cast
  const [cast, setCast] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/tv/${tvID}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    };
    const lst = [];
    axios
      .request(options)
      .then(function (response) {
        const result = response.data.cast;
        let pic = null;
        for (var i = 0; i < result.length; i++) {
          if (result[i]["profile_path"] == null) {
            pic =
              "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png";
          } else {
            pic = "https://image.tmdb.org/t/p/w200" + result[i]["profile_path"];
          }
          lst.push({
            id_cast: result[i]["id"],
            profile_path: pic,
            popularity: result[i]["popularity"],
            character: result[i]["character"],
            name: result[i]["original_name"]
          });
        }
        setCast(lst);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [tvID]);
  return (
    <div className="Detail">
      <div className="container p-0">
        <SearchBar />
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main
              role="main"
              className="col-md-9 ml-sm-auto col-lg-10 px-4 movie_list"
            >
              {detailTV.length == 0 ? (
                ""
              ) : (
                <div className="movie_card" id="bright">
                  <div className="info_section">
                    <div className="movie_header">
                      <img
                        className="locandina"
                        src={detailTV[0].poster_path}
                        alt=""
                      />
                      <h1>{detailTV[0].name}</h1>
                      <h4>{detailTV[0].first_air_date}</h4>
                      <h6>
                        number of seasons: {detailTV[0].number_of_seasons}
                      </h6>
                      <span className="minutes">{detailTV[0].runtime} min</span>
                      <p className="type">{detailTV[0].genres}</p>
                    </div>
                    <br />
                    <div className="movie_desc">
                      <p className="text">{detailTV[0].overview}</p>
                    </div>
                  </div>
                  <div>
                    <img
                      className="blur_back bright_back"
                      src={detailTV[0].poster_path}
                      alt=""
                    />
                  </div>
                </div>
              )}

              <div
                className="movie_card"
                id="bright"
                style={{ width: "1000px", height: "700px" }}
              >
                <h1>TV SHOWS WILL BE UPDATED SOON!!!</h1>
              </div>
              <hr />

              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1>Cast</h1>
                </div>
                <div className="scrollmenu">
                  {cast
                    ? cast.map((item) => (
                        <div className="card-view">
                          <div className="card-header">
                            <Link to={`/detail/${item.id_cast}`}>
                              <img
                                src={item.profile_path}
                                alt=""
                                style={{ width: "180px" }}
                              />
                            </Link>
                          </div>
                          <div className="card-movie-content">
                            <div className="card-movie-content-head">
                              <h2 className="card-movie-title">{item.name}</h2>
                            </div>
                            <div className="card-movie-info">
                              <div className="movie-running-time">
                                <div className="text">Character</div>
                                <span>{item.character}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : ""}
                </div>
              </div>

              <hr />
              <div>
                <div>Favorite:</div>
                <button
                  className="likedMovie"
                  onClick={toggleLiked}
                  type="button"
                >
                  {liked ? (
                    <img
                      src="https://img.icons8.com/color/24/000000/filled-like.png"
                      alt=""
                    />
                  ) : (
                    <img
                      src="https://img.icons8.com/material-outlined/24/000000/like--v1.png"
                      alt=""
                    />
                  )}
                </button>
                <div>Rating:</div>
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={24}
                  activeColor="#ffd700"
                />
                <div>Comment:</div>
                <div className="textarea">
                  <textarea
                    cols="110"
                    rows="5"
                    ref={textInput}
                    placeholder="Add comment..."
                  />
                </div>
                <div className="btn">
                  <button
                    className="btn btn-primary"
                    onClick={addComment}
                    type="submit"
                  >
                    Post
                  </button>
                </div>
              </div>

              {newComment.map((item) => (
                <div className="row">
                  <div className="col-sm-12">
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <img
                          src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/60/000000/external-user-interface-kiranshastry-solid-kiranshastry.png"
                          alt=""
                        />
                        <div className="review-block-name">{item.name}</div>
                        <div className="review-block-date">
                          {item.date}
                          <br />
                          {item.hour}
                        </div>
                      </div>
                      <div className="col-sm-9">
                        <div className="review-block-rate">
                          {[...Array(item.rating)].map(() => (
                            <img
                              src="https://img.icons8.com/fluency/24/000000/star.png"
                              alt=""
                            />
                          ))}
                        </div>
                        <div className="review-block-description">
                          {item.comment}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailTV;
