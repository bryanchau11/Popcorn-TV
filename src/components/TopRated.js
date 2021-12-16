import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/bootstrap.min.css";
import "../App.css";
import SearchBar from "./SearchBar";
import NavigationMenu from "./NavigationMenu";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Typography from "@mui/material/Typography";
var axios = require("axios").default;
function TopRated() {
  const args = JSON.parse(document.getElementById("data").text);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);
  const [movieList, setMovieList] = useState(args.top_rated_movie);
  useEffect(() => {
    fetch("/top_rate_movie_page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ page: page })
    })
      .then((response) => response.json())
      .then((data) => {
        setMovieList(data.top_rated_movie);
      });
  }, [page]);
  const [count, setCount] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
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
    <div className="TopRated">
      <div className="container p-0">
        <SearchBar />
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main
              role="main"
              className="col-md-9 ml-sm-auto col-lg-10 px-4 movie_list"
              style={{ paddingTop: "50px", backgroundColor: "#150050" }}
            >
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1 style={{ color: "white" }}>Top Rated Movies</h1>
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
                              <div className="row">
                                <div className="col-sm-4 metadata">
                                  <i
                                    className="fa fa-star"
                                    aria-hidden="true"
                                  ></i>
                                  <p>{item.vote_average}/10</p>
                                </div>
                                <div className="col-sm-8 metadata">
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
                      ))
                    : ""}
                </div>
              </div>
              <Pagination
                page={page}
                count={count}
                size="large"
                color="primary"
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    style={{ color: "white" }}
                    to={`/top_rated${
                      item.page === 1 ? "" : `?page=${item.page}`
                    }`}
                    {...item}
                  />
                )}
              />
              <Typography style={{ color: "white", textAlign: "center" }}>
                Page: {page}
              </Typography>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopRated;
