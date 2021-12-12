import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Filter.css";
import ToolBar from "./Toolbar";
import NavigationMenu from "./NavigationMenu";

var axios = require("axios").default;
function Filter() {
  const [genre, setGenre] = useState("");
  const [filterMovie, setFilterMovie] = useState([]);

  const filter = () => {
    fetch("/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ movie_genre: genre })
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.filter);
        setFilterMovie(result.filter_movie);
      });
  };
  const [genreList, setGenreList] = useState(null);
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
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
  return (
    <div className="Favorite">
      <div className="container p-0">
        <ToolBar />
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main
              role="main"
              className="col-md-9 ml-sm-auto col-lg-10 px-4 movie_list"
            >
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1>Filter Movies</h1>
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
                  {filterMovie.map((item) => (
                    <div className="card-view">
                      <div className="card-header">
                        <Link to={`/detail/${item.id_movie}`}>
                          <img src={item.poster_path} alt="" />
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
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
