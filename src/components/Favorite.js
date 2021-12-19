import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import NavigationMenu from "./NavigationMenu";

function Favorite() {
  const [allFavorite, setAllFavorite] = useState([]);

  useEffect(() => {
    fetch("/all_favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const result = JSON.parse(data.all_favorite);
        setAllFavorite(result.favorite);
      });
  }, []);

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
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Favorite;
