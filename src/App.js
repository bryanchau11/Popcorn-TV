import React, { useEffect, useState } from "react";
import {
  Link,
  MemoryRouter,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./style/bootstrap.min.css";
import "./App.css";
import SearchBar from "./components/SearchBar";
import NavigationMenu from "./components/NavigationMenu";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

function App() {
  const args = JSON.parse(document.getElementById("data").text);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);
  const [movieList, setMovieList] = useState(args.popular_movie);
  useEffect(() => {
    fetch("/popular_page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ page: page })
    })
      .then((response) => response.json())
      .then((data) => {
        setMovieList(data.popular_movie);
      });
  }, [page]);
  return (
    <div className="App">
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
                  <h1>Popular Movies</h1>
                </div>
                <div className="row">
                  {movieList.map((item) => (
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
              <Pagination
                page={page}
                count={100}
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    to={`/index${item.page === 1 ? "" : `?page=${item.page}`}`}
                    {...item}
                  />
                )}
              />
            </main>
          </div>
        </div>
      </div>
      <div>{page} </div>
    </div>
  );
}

export default App;
