import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import NavigationMenu from "./NavigationMenu";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
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
                    <h1>Search Movies</h1>
                  </div>
                  <div className="row">
                    {searchMovie.map((item) => (
                      <div className="card-view">
                        <div className="card-header">
                          {item.popularity == "movie" ? (
                            <Link to={`/detail/${item.id_movie}`}>
                              <img src={item.poster_path} alt="" />
                            </Link>
                          ) : (
                            <Link to={`/detailTV/${item.id_movie}`}>
                              <img src={item.poster_path} alt="" />
                            </Link>
                          )}
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
                              <div className="text">Movie Type</div>
                              <span>{item.popularity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Pagination
                  page={page}
                  count={count}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/search/${movieName}${
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
      ) : (
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
                    <h1>Search Movies</h1>
                  </div>
                  <h2>There are no movies that matched your query!!!</h2>
                </div>
                <Pagination
                  page={page}
                  count={4}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/search/${movieName}${
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
      )}
    </div>
  );
}

export default Search;
