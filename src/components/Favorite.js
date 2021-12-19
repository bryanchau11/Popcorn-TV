import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import NavigationMenu from "./NavigationMenu";
import axios from "axios";
function Favorite() {
  const [allFavorite, setAllFavorite] = useState([]);
  const [detailTV, setDetailTV] = useState([]);
  const [movie, setMovie] = useState([]);
  const [tv, setTV] = useState([]);
  useEffect(() => {
    fetch("/all_favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setMovie(data.movieList);
        setTV(data.tvList);
      });
  }, []);
  console.log(tv);
  // Get TV list
  useEffect(() => {
    const lst = [];

    for (var i = 0; i < tv.length; i++) {
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/tv/${tv[i]}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      };

      axios
        .request(options)
        .then(function (response) {
          const genreList = [];
          const result = response.data;
          for (var i = 0; i < result["genres"].length; i++) {
            genreList.push(result["genres"][i]["name"]);
          }

          lst.push({
            first_air_date: result["first_air_date"],
            id_tv: result["id"],
            name: result["name"],
            vote_average: result["vote_average"],
            overview: result["overview"],
            poster_path:
              "https://image.tmdb.org/t/p/original" + result["poster_path"]
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    setDetailTV(lst);
  }, [tv]);
  console.log(detailTV);
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
              style={{ paddingTop: "50px", backgroundColor: "#150050" }}
            >
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1 style={{ color: "white" }}>Favorite Movies</h1>
                </div>
                <div className="row">
                  {allFavorite.map((item) => (
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
                        <h4 className="card-title">{item.title} </h4>

                        <div className="containerCard">
                          <div className="row">
                            <div className="col-sm-4 metadata">
                              <i className="fa fa-star" aria-hidden="true"></i>
                              <p>{item.vote_average}/10</p>
                            </div>
                            <div className="col-sm-8 metadata">
                              {item.release_date}
                            </div>
                          </div>
                        </div>

                        <p className="card-text">
                          {item.overview.substring(0, 245) + "..."}
                        </p>

                        {item.media_type == "movie" ? (
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
                <div className="row">
                  <h1 style={{ color: "white" }}>Favorite TV</h1>
                </div>
                <div className="row">
                  {detailTV
                    ? detailTV.map((item) => (
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
                            <h4 className="card-title">{item.name} </h4>

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
                                  {item.first_air_date}
                                </div>
                              </div>
                            </div>

                            <p className="card-text">
                              {item.overview.substring(0, 245) + "..."}
                            </p>

                            <Link
                              to={`/detailTV/${item.id_tv}`}
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
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Favorite;
