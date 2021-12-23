import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../style/bootstrap.min.css";
import "../../App.css";
import SearchBar from "../SearchBar";
import Typography from "@mui/material/Typography";
import NavigationMenu from "../NavigationMenu";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
var axios = require("axios").default;
function PopularTV() {
  const args = JSON.parse(document.getElementById("data").text);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  const [movieList, setMovieList] = useState(null);

  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}`
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
              "https://image.tmdb.org/t/p/original" + result[i]["poster_path"],
            title: result[i]["original_name"],
            vote_average: result[i]["vote_average"],
            release_date: result[i]["first_air_date"],
            popularity: result[i]["overview"]
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
      url: `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
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
        <div className="container-fluid">
          <div className="row">
            <main
              role="main"
              className="movie_list"
              style={{ paddingTop: "50px", backgroundColor: "#181818" }}
            >
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1 style={{ color: "white" }}>Popular TV Shows</h1>
                </div>
                <div className="row">
                  {movieList
                    ? movieList.map((item) => (
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
                    to={`/popularTV${
                      item.page === 1 ? "" : `?page=${item.page}`
                    }`}
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

export default PopularTV;
