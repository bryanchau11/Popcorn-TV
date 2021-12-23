import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import NavigationMenu from "./NavigationMenu";
import Pagination from "@mui/material/Pagination";
import "../style/Search.css";
import PaginationItem from "@mui/material/PaginationItem";
import Typography from "@mui/material/Typography";

var axios = require("axios").default;
function Search() {
  const { movieName } = useParams();
  const [searchMovie, setSearchMovie] = useState([]);
  const [existMovie, setExistMovie] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);
  //const [movieList, setMovieList] = useState(args.popular_movie);

  useEffect(() => {
    fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ movie_name: movieName, page: page })
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.search);
        setSearchMovie(result.search_movie);
        setExistMovie(result.exist_search_movie);
      });
  }, [movieName, page]);
  const [count, setCount] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_API_KEY}&query=${movieName}&page=1&include_adult=false`
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
  }, [movieName]);
  return (
    <div className="Search">
      {existMovie ? (
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
                    <h1 style={{ color: "white" }}>Search Movies</h1>
                  </div>
                  <div className="row">
                    {searchMovie.map((item) => (
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
                          <h4 className="card-title">{item.title} </h4>

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
                            {item.overview.substring(0, 245) + "..."}
                          </p>

                          {item.popularity == "movie" ? (
                            <Link
                              to={`/detail/${item.id_movie}`}
                              className="trailer-preview"
                            >
                              <i className="fa fa-play" aria-hidden="true"></i>
                            </Link>
                          ) : (
                            <Link
                              to={`/detailTV/${item.id_movie}`}
                              className="trailer-preview"
                            >
                              <i className="fa fa-play" aria-hidden="true"></i>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Pagination
                  style={{ color: "white" }}
                  page={page}
                  count={count}
                  size="large"
                  color="primary"
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      style={{ color: "white" }}
                      to={`/search/${movieName}${
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
      ) : (
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
                    <h1 style={{ color: "white" }}>Search Movies</h1>
                  </div>
                  <h2 style={{ color: "white" }}>
                    There are no movies that matched your query!!!
                  </h2>
                </div>
                <Pagination
                  style={{ color: "white" }}
                  page={page}
                  count={count}
                  size="large"
                  color="primary"
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      style={{ color: "white" }}
                      to={`/search/${movieName}${
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
      )}
    </div>
  );
}

export default Search;
