import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import NavigationMenu from "./NavigationMenu";

function Favorite() {
  const [detailTV, setDetailTV] = useState(null);
  const [detailMovie, setDetailMovie] = useState(null);

  useEffect(() => {
    fetch("/all_favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setDetailMovie(data.movieList);
        setDetailTV(data.tvList);
      });
  }, []);
  console.log(detailTV);
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
                  <h1 style={{ color: "white" }}>Favorite Movies</h1>
                </div>
                <div className="row">
                  {detailMovie
                    ? detailMovie.map((item) => (
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
                            <h4 className="card-title">{item.name} </h4>

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
                            <Link
                              to={`/detail/${item.movie_id}`}
                              className="trailer-preview"
                            >
                              <i className="fa fa-play" aria-hidden="true"></i>
                            </Link>
                          </div>
                        </div>
                      ))
                    : ""}
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
                            <h4 className="card-title">{item.name} </h4>

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
                                  {item.first_air_date}
                                </div>
                              </div>
                            </div>

                            <p className="card-text">
                              {item.overview.substring(0, 245) + "..."}
                            </p>

                            <Link
                              to={`/detailTV/${item.tv_id}`}
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
