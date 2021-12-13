/* eslint-disable no-alert */
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo2.png";
function SearchBar() {
  const textInput = useRef(null);
  const navigate = useNavigate();

  const searchMovie = (event) => {
    event.preventDefault();
    const movieName = textInput.current.value;
    if (movieName !== "") {
      navigate(`/search/${movieName}`);
    } else {
      alert("Please enter name of movie");
    }
  };

  return (
    <nav
      className="navbar fixed-top flex-md-nowrap p-0 shadow"
      style={{ backgroundColor: "black" }}
    >
      <div className="navbar-brand col-sm-3 col-md-2 mr-0">
        <img
          style={{ width: "150px", height: "100px" }}
          src={logo}
          alt="logo"
        />
      </div>

      <form onSubmit={searchMovie}>
        <div class="form-group">
          <input
            className="form-control form-control-dark "
            ref={textInput}
            type="text"
            placeholder="Search"
            aria-label="Search"
            size="500"
          />
        </div>
      </form>

      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
          <button
            className="btn btn-primary"
            onClick={searchMovie}
            type="submit"
          >
            Search
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default SearchBar;
