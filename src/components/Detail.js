import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
//import ReactStars from "react-rating-stars-component";
import "../style/Detail.css";
import "../style/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
//import SearchBar from "./SearchBar";
//import NavigationMenu from "./NavigationMenu";
import axios from "axios";

function Detail() {
  const { movieID } = useParams();
  const [detailMovie, setDetailMovie] = useState([]);
  const textInput = useRef(null);
  const [ratingMovie, setRatingMovie] = useState(0);
  const args = JSON.parse(document.getElementById("data").text);

  const [avgRating, setAvgRating] = useState(0);
  const [newComment, setNewComment] = useState([]);
  const [liked, setLiked] = useState(false);

  const toggleLiked = () => {
    if (liked === false) {
      fetch("/liked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          movie_id: movieID,
          poster_path: detailMovie.poster_path,
          title: detailMovie.title,
          vote_average: detailMovie.vote_average,
          release_date: detailMovie.release_date,
          popularity: detailMovie.popularity,
          overview: detailMovie.overview
        })
      });
    } else {
      fetch("/unliked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ movie_id: movieID })
      });
    }
    setLiked(!liked);
  };

  useEffect(() => {
    fetch("/detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ movie_id: movieID })
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.detail);
        setDetailMovie(result);
      });

    fetch("/check_liked", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ movie_id: movieID })
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
      body: JSON.stringify({ movie_id: movieID })
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
      body: JSON.stringify({ movie_id: movieID })
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.all_comment);
        setNewComment(result.comment);
      });
  }, []);

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
        movie_id: movieID,
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
      body: JSON.stringify({ movie_id: movieID })
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.avg_rating);
        setAvgRating(result);
      });
  }
  // Get Movie Cast
  const [cast, setCast] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
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
  }, [movieID]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Get trailer
  const [youtubeID, setYoutubeID] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    };
    axios
      .request(options)
      .then(function (response) {
        const res = response.data.results;
        var trailer = "";
        for (var i in res) {
          if (res[i].type === "Trailer") {
            trailer = res[i].key;
          }
        }
        setYoutubeID(trailer);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [movieID]);
  return (
    <>
      {detailMovie.length === 0 ? (
        ""
      ) : (
        <>
          <div>
            <img
              alt=""
              id="postertest"
              className="poster"
              src={detailMovie.backdrop_path}
            />
          </div>

          <div className="col-xs-12 cardcont nopadding">
            <div className="meta-data-container col-xs-12 col-md-8 push-md-4 col-lg-7 push-lg-5">
              <h1>
                {detailMovie.title}{" "}
                <button
                  classNameName="likedMovie"
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
              </h1>
              <span className="tagline">
                <h2>{detailMovie.tagline}</h2>
                {detailMovie.genres} | {detailMovie.runtime} mins|
                {detailMovie.release_date}
              </span>
              <p style={{ marginTop: "6.5vh" }}>
                <h4>SYNOPSIS</h4>
                {detailMovie.overview}
              </p>

              <div className="additional-details">
                <span className="genre-list"></span>
                <span className="production-list"></span>
                <div className="nopadding release-details">
                  <div className="col-xs-6">
                    Directed by:
                    <span className="meta-data">{detailMovie.director}</span>
                  </div>
                  <div className="col-xs-6">
                    Status:
                    <span className="meta-data">{detailMovie.status}</span>
                  </div>
                  <div className="col-xs-6">
                    Vote Count:
                    <span className="meta-data">{detailMovie.vote_count}</span>
                  </div>
                  <div className="col-xs-6">
                    Vote Average:
                    <span className="meta-data">
                      {detailMovie.vote_average} / 10
                    </span>
                  </div>

                  <div className="col-xs-6">
                    <button
                      type="button"
                      className="btn btn-red btn-lg"
                      data-toggle="modal"
                      data-target="#myModal"
                      onClick={handleShow}
                    >
                      Watch Trailer
                    </button>
                    <Modal show={show} onHide={handleClose} size="lg">
                      <Modal.Header closeButton>
                        <Modal.Title>Youtube</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="modal-body">
                          <div className="video-container">
                            <div>
                              <iframe
                                title="x"
                                className="youtube"
                                allowfullscreen=""
                                src={`https://www.youtube.com/embed/${youtubeID}`}
                              ></iframe>
                            </div>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                  <div className="col-xs-6">
                    <a
                      href="/nowplaying"
                      className="btn-lg btn-green"
                      style={{ pointerEvents: "none" }}
                    >
                      View More
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="poster-container nopadding col-xs-12 col-md-4 pull-md-8 col-lg-5 pull-lg-7 ">
              <img className="poster" src={detailMovie.poster_path} alt="" />
            </div>
          </div>

          {/** MOVIE PARTs */}
          <div className="col-xs-12 cardcont nopadding">
            <div className="wrapper">
              <h3>WATCH NOW</h3>
              <div className="video-container">
                <iframe
                  title="movie"
                  src={`https://www.2embed.ru/embed/tmdb/movie?id=${movieID}`}
                  allow="fullscreen"
                  className="responsive-iframe"
                />
              </div>
            </div>
          </div>
          {/** CAST DETAILS */}
          <div className="col-xs-12 cardcont nopadding">
            <div className="wrapper">
              <h3>STARRING</h3>
              <div style={{ marginTop: "50px" }} className="row row-flex">
                {cast
                  ? cast.map((item) => (
                      <div className="col-md-3">
                        <div className="responsive-circle">
                          <div>
                            <img
                              src={item.profile_path}
                              className="image--cover"
                              alt=""
                            />
                            <figcaption>{item.name}</figcaption>
                          </div>
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
          {/**COMMENT */}
          <div className="col-xs-12 cardcont nopadding">
            <div className="wrapper">
              <h3>COMMENT</h3>
              <div classNameName="textarea">
                <textarea
                  style={{ maxWidth: "95%" }}
                  cols="110"
                  rows="5"
                  ref={textInput}
                  placeholder="Add comment..."
                />
              </div>
              <div classNameName="btn">
                <button
                  classNameName="btn btn-primary"
                  onClick={addComment}
                  type="submit"
                >
                  Post
                </button>
              </div>
              <div className="wrapper">
                {newComment.map((item) => (
                  <div classNameName="row">
                    <div classNameName="col-sm-12">
                      <hr />
                      <div classNameName="row">
                        <span className="tagline">
                          <h2>{item.name}</h2>
                          {item.date} at {item.hour}
                        </span>
                        <p
                          style={{
                            marginTop: "3.5vh",
                            color: "white",
                            fontSize: "25px"
                          }}
                        >
                          {item.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}{" "}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Detail;
