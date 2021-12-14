import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../style/bootstrap.min.css";
import "../../App.css";
import SearchBar from "../SearchBar";

import NavigationMenu from "../NavigationMenu";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
var axios = require("axios").default;
function TopRatedTV() {
  const args = JSON.parse(document.getElementById("data").text);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  const [movieList, setMovieList] = useState(null);

  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}`
    };
    const lst = [];
    axios
      .request(options)
      .then(function (response) {
        const result = response.data.results;
        for (var i = 0; i < result.length; i++) {
          lst.push({
            id_movie: result[i].id,
            poster_path:
              "https://image.tmdb.org/t/p/w200" + result[i]["poster_path"],
            title: result[i]["original_name"],
            vote_average: result[i]["vote_average"],
            release_date: result[i]["first_air_date"],
            popularity: result[i]["popularity"]
          });
        }
        setMovieList(lst);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [page]);

  const [count, setCount] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
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
  return (
    <div className="App">
      <div className="container p-0">
        <SearchBar />
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main
              role="main"
              className="col-md-9 ml-sm-auto col-lg-10 px-4 movie_list"
              style={{ paddingTop: "50px" }}
            >
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1>Top Rated TV Shows</h1>
                </div>
                <div className="row">
                  {movieList
                    ? movieList.map((item) => (
                        <div className="card-view">
                          <div className="card-header">
                            <Link to={`/detailTV/${item.id_movie}`}>
                              <img
                                src={item.poster_path}
                                alt=""
                                style={{ width: "180px" }}
                              />
                            </Link>
                          </div>
                          <div className="card-movie-content">
                            <div className="card-movie-content-head">
                              <h3 className="card-movie-title">{item.title}</h3>
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
              <Pagination
                page={page}
                count={count}
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    to={`/top_ratedTV${
                      item.page === 1 ? "" : `?page=${item.page}`
                    }`}
                    {...item}
                  />
                )}
              />
            </main>
          </div>
        </div>
      </div>
      <div>{page} </div>
    </div>
  );
}

export default TopRatedTV;
