import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
//import ReactStars from "react-rating-stars-component";
import "../../style/Detail.css";
import "../../style/bootstrap.min.css";
//import "../../App.css";
//import SearchBar from "../SearchBar";
//import NavigationMenu from "../NavigationMenu";
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
      fetch("/likedTV", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          movie_id: tvID,
          poster_path: detailTV[0].poster_path,
          name: detailTV[0].name,
          vote_average: detailTV[0].vote_average,
          release_date: detailTV[0].first_air_date,
          overview: detailTV[0].overview
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
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [tvList, setTVList] = useState(null);
  const [seasonList, setSeasonList] = useState([]);
  const [episodeList, setEpisodeList] = useState([]);
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
        let director = "";
        if (result["created_by"].length === 0) {
          director = "N/A";
        } else {
          director = result["created_by"][0]["name"];
        }
        lst.push({
          first_air_date: result["first_air_date"],
          director: director,
          vote_count: result["vote_count"],
          vote_average: result["vote_average"],
          status: result["status"],
          tagline: result["tagline"],
          id: result["id"],
          name: result["name"],
          overview: result["overview"],
          runtime: result["episode_run_time"][0],
          poster_path:
            "https://image.tmdb.org/t/p/original" + result["poster_path"],
          backdrop_path:
            "https://image.tmdb.org/t/p/original" + result["backdrop_path"],
          number_of_episodes: result["number_of_episodes"],
          number_of_seasons: result["number_of_seasons"],
          genres: genreList.join(", ")
        });
        setDetailTV(lst);
        const seasonAndEpisode = [];
        const seasonTemp = [];
        var str = "";
        for (i = 0; i < result["seasons"].length; i++) {
          if (
            result["seasons"][i]["episode_count"] !== 0 &&
            result["seasons"][i]["name"] !== "Specials"
          ) {
            for (var j = 0; j < result["seasons"][i]["episode_count"]; j++) {
              str =
                "Season: " +
                result["seasons"][i]["season_number"] +
                ", Episode: " +
                (j + 1).toString();

              seasonAndEpisode.push({
                label: str,
                season: i + 1,
                episode: j + 1
              });
            }
          }
        }
        for (i = 0; i < result["number_of_seasons"]; i++) {
          seasonTemp.push({ label: "Season: " + (i + 1), value: i + 1 });
        }
        setSeasonList(seasonTemp);
        setTVList(seasonAndEpisode);
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
            pic =
              "https://image.tmdb.org/t/p/original" + result[i]["profile_path"];
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

  function handleSeasonChange(evt) {
    const value = evt.target.value;
    //const numStr = value.match(/\d/g).join("");
    //setSeason(parseInt(numStr[0]));

    //setEpisode(parseInt(numStr.substring(1)));
    setSeason(value);
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/tv/${tvID}/season/${value}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    };
    const lst = [];
    axios
      .request(options)
      .then(function (response) {
        const result = response.data.episodes;
        console.log(result);
        for (var i = 0; i < result.length; i++) {
          lst.push({
            episode_number: result[i]["episode_number"],
            air_date: result[i]["air_date"],
            name: result[i]["name"],
            overview: result[i]["overview"],
            runtime: detailTV[0].runtime,
            vote_average: result[i]["vote_average"],
            still_path: result[i]["still_path"]
          });
        }
        setEpisodeList(lst);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {detailTV.length === 0 ? (
        ""
      ) : (
        <>
          <div>
            <img
              alt=""
              id="postertest"
              className="poster"
              src={detailTV[0].backdrop_path}
            />
          </div>

          <div className="col-xs-12 cardcont nopadding">
            <div className="meta-data-container col-xs-12 col-md-8 push-md-4 col-lg-7 push-lg-5">
              <h1>
                {detailTV[0].name}{" "}
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
                <h2>{detailTV[0].tagline}</h2>
                {detailTV[0].genres} | {detailTV[0].runtime} mins|{" "}
                {detailTV[0].number_of_seasons} seasons |{" "}
                {detailTV[0].first_air_date}
              </span>
              <p style={{ marginTop: "6.5vh" }}>
                <h4>SYNOPSIS</h4>
                {detailTV[0].overview}
              </p>

              <div className="additional-details">
                <span className="genre-list"></span>
                <span className="production-list"></span>
                <div className="nopadding release-details">
                  <div className="col-xs-6">
                    Directed by:
                    <span className="meta-data">{detailTV[0].director}</span>
                  </div>
                  <div className="col-xs-6">
                    Status:
                    <span className="meta-data">{detailTV[0].status}</span>
                  </div>
                  <div className="col-xs-6">
                    Vote Count:
                    <span className="meta-data">{detailTV[0].vote_count}</span>
                  </div>
                  <div className="col-xs-6">
                    Vote Average:
                    <span className="meta-data">
                      {detailTV[0].vote_average} / 10
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
                                width="auto"
                                height="auto"
                                className="youtube"
                                src="https://www.youtube.com/"
                                allowfullscreen=""
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
              <img className="poster" src={detailTV[0].poster_path} alt="" />
            </div>
          </div>

          {/** MOVIE PARTs */}
          <div className="col-xs-12 cardcont nopadding">
            <div className="wrapper">
              <h3>
                WATCH NOW | SEASON:{" "}
                <span style={{ color: "#00fc87" }}> {season} </span> | EPISODE:{" "}
                <span style={{ color: "#00fc87" }}> {episode} </span>
              </h3>

              {/* <select onChange={handleChange}>
                  {tvList
                    ? tvList.map((item) => (
                        <option value={item.label}>{item.label}</option>
                      ))
                    : ""}
                </select>* */}
              <select onChange={handleSeasonChange}>
                <option value={1} selected disabled hidden>
                  season 1
                </option>
                {seasonList
                  ? seasonList.map((item) => (
                      <option value={item.value}>{item.label}</option>
                    ))
                  : ""}
              </select>
              {episodeList.length !== 0
                ? episodeList.map((item) => (
                    <a href="#tvShow" style={{ textDecoration: "none" }}>
                      <div
                        className="movie_card"
                        id="bright"
                        onClick={() => setEpisode(item.episode_number)}
                      >
                        <div className="info_section">
                          <div className="movie_header">
                            <img
                              className="locandina"
                              src={`https://image.tmdb.org/t/p/original${item.still_path}`}
                              alt=""
                            />
                            <h4>{item.name}</h4>
                            <span style={{ color: "white", fontSize: "15px" }}>
                              {item.air_date}
                            </span>
                            <br />
                            <span className="minutes">{item.runtime} min</span>
                            <p className="type">{item.vote_average}/10</p>
                          </div>
                          <div className="movie_desc">
                            <p className="text">{item.overview}</p>
                          </div>
                        </div>
                        <div
                          className="blur_back"
                          style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${item.still_path})`
                          }}
                        ></div>
                      </div>
                    </a>
                  ))
                : ""}
            </div>
          </div>
          <div className="col-xs-12 cardcont nopadding">
            <div className="wrapper">
              <div className="video-container" id="tvShow">
                <iframe
                  title="movie"
                  src={`https://www.2embed.ru/embed/tmdb/tv?id=${tvID}&s=${season}&e=${episode}`}
                  width="1000"
                  height="700"
                  allow="fullscreen"
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

export default DetailTV;
