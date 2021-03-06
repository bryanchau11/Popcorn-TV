import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../style/Filter.css";
import "../../style/bootstrap.min.css";
import "../../App.css";
import SearchBar from "../SearchBar";
import Typography from "@mui/material/Typography";

import NavigationMenu from "../NavigationMenu";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
var axios = require("axios").default;
function Korean() {
  const [genre, setGenre] = useState("");
  const [Korean, setKorean] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);
  const [sort, setSort] = useState("popularity.desc");
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=${sort}&page=${page}&with_genres=${genre}&with_original_language=ko`
    };
    const lst = [];
    axios
      .request(options)
      .then(function (response) {
        const result = response.data.results;

        for (var i = 0; i < result.length; i++) {
          if (result[i]["poster_path"] !== null) {
            lst.push({
              id_movie: result[i].id,
              poster_path:
                "https://image.tmdb.org/t/p/original" +
                result[i]["poster_path"],
              title: result[i]["name"],
              vote_average: result[i]["vote_average"],
              release_date: result[i]["first_air_date"],
              popularity: result[i]["overview"]
            });
          }
        }
        setKorean(lst);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [genre, page, sort]);

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
      url: `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=${sort}&page=1&with_genres=${genre}&with_original_language=ko`
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
        <div className="container-fluid">
          <div className="row">
            <main
              role="main"
              className="movie_list"
              style={{ paddingTop: "50px", backgroundColor: "#181818" }}
            >
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1 style={{ color: "white" }}> Korean Movies for Bryan</h1>
                </div>
                <div className="classic">
                  <select onChange={(event) => setGenre(event.target.value)}>
                    {genreList
                      ? genreList.map((item) => (
                          <option value={item.value}>{item.name}</option>
                        ))
                      : ""}
                  </select>
                  <select onChange={(event) => setSort(event.target.value)}>
                    <option value="popularity.desc">Popularity</option>
                    <option value="vote_average.desc">Imdb Voting</option>
                  </select>
                </div>
                <div className="row">
                  {Korean
                    ? Korean.map((item) => (
                        <div
                          className="card"
                          style={{
                            width: "18rem",
                            margin: "20px",
                            padding: "0px",
                            backgroundColor: "#080808",
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
                              to={`/detailTV/${item.id_movie}`}
                              className="trailer-preview"
                            >
                              <i className="fa fa-play" aria-hidden="true"></i>
                            </Link>
                          </div>
                        </div>
                      ))
                    : ""}
                </div>
              </div>
              <Pagination
                page={page}
                count={count}
                size="large"
                color="primary"
                style={{ color: "white" }}
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    style={{ color: "white" }}
                    to={`/korean${item.page === 1 ? "" : `?page=${item.page}`}`}
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

export default Korean;
