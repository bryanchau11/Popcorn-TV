/* eslint-disable no-alert */
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const textInput = useRef(null);
  const navigate = useNavigate();

  const searchMovie = () => {
    const movieName = textInput.current.value;
    if (movieName !== "") {
      navigate(`/search/${movieName}`);
    } else {
      alert("Please enter name of movie");
    }
  };

  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <div className="navbar-brand col-sm-3 col-md-2 mr-0">Popcorn TV</div>
      <input
        className="form-control form-control-dark w-100"
        ref={textInput}
        type="text"
        placeholder="Search"
        aria-label="Search"
      />
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
