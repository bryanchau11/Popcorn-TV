import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style/bootstrap.min.css";
import "./App.css";
import "./style/Filter.css";
import SearchBar from "./components/SearchBar";
import NavigationMenu from "./components/NavigationMenu";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Typography from "@mui/material/Typography";
var axios = require("axios").default;
function App() {
  const args = JSON.parse(document.getElementById("data").text);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  const [movieList, setMovieList] = useState(args.popular_movie);
  useEffect(() => {
    fetch("/popular_page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ page: page })
    })
      .then((response) => response.json())
      .then((data) => {
        setMovieList(data.popular_movie);
      });
  }, [page]);
  const [count, setCount] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
    };
    axios
      .request(options)
      .then(function (response) {
        const result = response.data.total_pages;
        console.log(response.data.total_pages);
        setCount(result);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);
  // Get trending movie
  const [trending, setTrending] = useState(null);
  const [mediaType, setMediaType] = useState("movie");
  const [timeWindow, setTimeWindow] = useState("day");
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${process.env.REACT_APP_API_KEY}`
    };
    const lst = [];
    axios
      .request(options)
      .then(function (response) {
        const result = response.data.results;
        var i = 0;
        if (mediaType === "tv") {
          for (i = 0; i < result.length; i++) {
            lst.push({
              id_movie: result[i].id,
              poster_path:
                "https://image.tmdb.org/t/p/original" +
                result[i]["poster_path"],
              title: result[i]["original_name"],
              vote_average: result[i]["vote_average"],
              release_date: result[i]["first_air_date"],
              popularity: result[i]["popularity"]
            });
          }
        } else {
          for (i = 0; i < result.length; i++) {
            lst.push({
              id_movie: result[i].id,
              poster_path:
                "https://image.tmdb.org/t/p/original" +
                result[i]["poster_path"],
              title: result[i]["title"],
              vote_average: result[i]["vote_average"],
              release_date: result[i]["release_date"],
              popularity: result[i]["popularity"]
            });
          }
        }
        setTrending(lst);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [mediaType, timeWindow]);

  return (
    <div className="App">
      <div className="container p-0">
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main
              role="main"
              className="movie_list"
              style={{ paddingTop: "50px", backgroundColor: "#150050" }}
            >
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1 style={{ color: "white" }}>Trending</h1>
                </div>
                <div className="classic">
                  <select
                    onChange={(event) => setMediaType(event.target.value)}
                  >
                    <option value="movie">movie</option>
                    <option value="tv">tv</option>
                  </select>
                  <br />
                  <select
                    onChange={(event) => setTimeWindow(event.target.value)}
                  >
                    <option value="day">today</option>
                    <option value="week">this week</option>
                  </select>
                </div>
                <div className="scrollmenu">
                  {trending
                    ? trending.map((item) => (
                        <div className="card-view">
                          <div className="card-header">
                            {mediaType === "movie" ? (
                              <Link to={`/detail/${item.id_movie}`}>
                                <img
                                  src={item.poster_path}
                                  alt=""
                                  style={{ width: "180px" }}
                                />
                              </Link>
                            ) : (
                              <Link to={`/detailTV/${item.id_movie}`}>
                                <img
                                  src={item.poster_path}
                                  alt=""
                                  style={{ width: "180px" }}
                                />
                              </Link>
                            )}
                          </div>
                          <div className="card-movie-content">
                            <div className="card-movie-content-head">
                              <h3 className="card-movie-title">
                                {item.title.substring(0, 10) + "..."}
                              </h3>
                              <div className="ratings">
                                <span>{item.vote_average}</span>
                                /10
                              </div>
                            </div>
                            <div className="card-movie-info">
                              <div className="movie-running-time">
                                <div className="text">Release Date</div>
                                <span>{item.release_date}</span>
                              </div>
                              <div className="movie-running-time">
                                <div className="text">Popularity</div>
                                <span>{item.popularity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : ""}
                </div>
              </div>

              <hr />
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1 style={{ color: "white" }}>Popular Movies</h1>
                </div>
                <div className="row">
                  {movieList.map((item) => (
                    <div
                      className="card"
                      style={{
                        width: "18rem",
                        margin: "20px",
                        padding: "0px",
                        backgroundColor: "#3F0071",
                        color: "white"
                      }}
                    >
                      <img
                        className="card-img-top"
                        src={item.poster_path}
                        alt="pic"
                      />
                      <div className="card-body">
                        <h4 className="card-title">{item.title}</h4>

                        <div className="containerCard">
                          <div className="row" style={{ marginTop: "0" }}>
                            <div className="col-sm-6 metadata">
                              <i
                                className="fa fa-star"
                                style={{ fontSize: "20px" }}
                                aria-hidden="true"
                              ></i>
                              <p>{item.vote_average}/10</p>
                            </div>
                            <div className="col-sm-6 metadata">
                              {item.release_date}
                            </div>
                          </div>
                        </div>

                        <p className="card-text">
                          {item.popularity.substring(0, 245) + "..."}
                        </p>

                        <Link
                          to={`/detail/${item.id_movie}`}
                          className="trailer-preview"
                        >
                          <i className="fa fa-play" aria-hidden="true"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Pagination
                style={{ color: "white" }}
                page={page}
                count={500}
                size="large"
                color="primary"
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    style={{ color: "white" }}
                    to={`/${item.page === 1 ? "" : `?page=${item.page}`}`}
                    {...item}
                  />
                )}
              />
              <Typography style={{ color: "white" }}>Page: {page}</Typography>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
