import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../style/Filter.css";
import "../../style/bootstrap.min.css";
import "../../App.css";
import SearchBar from "../SearchBar";

import NavigationMenu from "../NavigationMenu";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
var axios = require("axios").default;
function FilterTV() {
  const [genre, setGenre] = useState("");
  const [filterTV, setFilterTV] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=${genre}&include_null_first_air_dates=false`
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
        setFilterTV(lst);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [genre, page]);
  const filter = () => {
    fetch("/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ movie_genre: genre, page: page })
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.filter);
        setFilterTV(result.filter_movie);
      });
  };
  const [genreList, setGenreList] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    };
    const lst = [];
    axios
      .request(options)
      .then(function (response) {
        const result = response.data.genres;
        for (var i = 0; i < result.length; i++) {
          lst.push({ value: result[i].id, name: result[i].name });
        }
        setGenreList(lst);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);
  const [count, setCount] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&page=1&with_genres=${genre}&include_null_first_air_dates=false`
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
  }, [genre]);
  return (
    <div className="Favorite">
      <div className="container p-0">
        <SearchBar />
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main
              role="main"
              className="col-md-9 ml-sm-auto col-lg-10 px-4 movie_list"
            >
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1>Filter TV Shows</h1>
                </div>
                <div className="classic">
                  <select onChange={(event) => setGenre(event.target.value)}>
                    {genreList
                      ? genreList.map((item) => (
                          <option value={item.value}>{item.name}</option>
                        ))
                      : ""}
                  </select>
                  <button
                    className="btn btn-primary btn-filter"
                    onClick={filter}
                    type="submit"
                  >
                    Filter
                  </button>
                </div>
                <div className="row">
                  {filterTV
                    ? filterTV.map((item) => (
                        <div className="card-view">
                          <div className="card-header">
                            <Link to={`/detail/${item.id_movie}`}>
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
                    to={`/filterTV${
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
    </div>
  );
}

export default FilterTV;
