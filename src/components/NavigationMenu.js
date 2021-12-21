/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo2.png";

import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Form,
  Button,
  FormControl
} from "react-bootstrap";
import "../style/Navbar.css";
function NavigationMenu() {
  const [name, setName] = useState("");
  const [flag, setFlag] = useState(true);
  useEffect(() => {
    fetch("/get_username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setName(data.username);
        if (data.username === "") {
          setFlag(false);
        }
      });
  }, []);
  const SmoothScroll = (id) => {
    let element = document.getElementById(id);
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  };
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
    <>
      {/**
     * <nav
      className="col-md-2 d-none d-md-block sidebar"
      style={{ paddingTop: "50px", backgroundColor: "black" }}
    >
      <div
        className="sidebar-sticky"
        style={{ backgroundColor: "black", color: "white" }}
      >
        <ul className="nav flex-column">
          <li className="nav-item">
            <div className="nav-link" style={{ paddingTop: "50px" }}>
              {flag ? <div>Welcome, {name}</div> : <div>Please login</div>}
            </div>
          </li>
        </ul>

        <hr />
        <NavDropdown title="MOVIE">
          <NavDropdown.Item>
            <li className="nav-item">
              <div className="nav-link">
                <img
                  src="https://img.icons8.com/ios/32/000000/video.png"
                  alt=""
                />
                <div>
                  <Link to="/">Popular Movies</Link>
                </div>
              </div>
            </li>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <li className="nav-item">
              <div className="nav-link">
                <img
                  src="https://img.icons8.com/external-prettycons-lineal-prettycons/32/000000/external-movie-multimedia-prettycons-lineal-prettycons-1.png"
                  alt=""
                />
                <div>
                  <Link to="/top_rated">Top Rated Movies</Link>
                </div>
              </div>
            </li>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <li className="nav-item">
              <div className="nav-link">
                <img
                  src="https://img.icons8.com/ios/32/000000/filter--v1.png"
                  alt=""
                />
                <div>
                  <Link to="/filter">Filter Movies</Link>
                </div>
              </div>
            </li>
          </NavDropdown.Item>
        </NavDropdown>

        <hr />
        <NavDropdown title="TV SHOWS">
          <NavDropdown.Item>
            <li className="nav-item">
              <div className="nav-link">
                <img
                  src="https://img.icons8.com/ios/32/000000/video.png"
                  alt=""
                />
                <div>
                  <Link to="/popularTV">Popular TV Shows</Link>
                </div>
              </div>
            </li>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <li className="nav-item">
              <div className="nav-link">
                <img
                  src="https://img.icons8.com/external-prettycons-lineal-prettycons/32/000000/external-movie-multimedia-prettycons-lineal-prettycons-1.png"
                  alt=""
                />
                <div>
                  <Link to="/top_ratedTV">Top Rated TV Shows</Link>
                </div>
              </div>
            </li>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <li className="nav-item">
              <div className="nav-link">
                <img
                  src="https://img.icons8.com/ios/32/000000/filter--v1.png"
                  alt=""
                />
                <div>
                  <Link to="/filterTV">Filter TV Shows</Link>
                </div>
              </div>
            </li>
          </NavDropdown.Item>
        </NavDropdown>

        <hr />
        <ul className="nav flex-column">
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/ios/32/FFFFFF/video.png"
                alt=""
              />
              <div>
                <Link to="/korean">Bryan's KOREAN TV Shows!!</Link>
              </div>
            </div>
          </li>
        </ul>
        <hr />

        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/material-outlined/32/FFFFFF/like--v1.png"
                alt=""
              />
              <div>
                <Link to="/favorite">Favorite Movies</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/ios/32/FFFFFF/contact-card.png"
                alt=""
              />
              <div>
                <Link to="/contact">Contact</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/ios/32/FFFFFF/settings.png"
                alt=""
              />
              <div>
                <Link to="/settings">Settings</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/ios/32/FFFFFF/logout-rounded--v1.png"
                alt=""
              />
              {flag ? (
                <form action="/signout1" method="POST">
                  <button
                    className="signOut"
                    type="submit"
                    style={{ color: "white" }}
                  >
                    Sign out
                  </button>
                </form>
              ) : (
                <form action="/signout" method="POST">
                  <button
                    className="signOut"
                    type="submit"
                    style={{ color: "white" }}
                  >
                    Log In
                  </button>
                </form>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
     */}
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="fixed-top"
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span style={{ color: "#00fc87" }}> POPCORN TV </span>|{" "}
            {flag ? <div>Welcome, {name}</div> : <div>Please login</div>}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <NavDropdown title="MOVIES" id="collasible-nav-dropdown">
                <NavDropdown.Item as={Link} to="/">
                  <img
                    src="https://img.icons8.com/ios/32/000000/video.png"
                    alt=""
                  />{" "}
                  POPULAR MOVIES
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/top_rated">
                  <img
                    src="https://img.icons8.com/external-prettycons-lineal-prettycons/32/000000/external-movie-multimedia-prettycons-lineal-prettycons-1.png"
                    alt=""
                  />
                  TOP-RATED MOVIES
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/filter">
                  <img
                    src="https://img.icons8.com/ios/32/000000/filter--v1.png"
                    alt=""
                  />
                  FILTER MOVIES
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="TV SHOWS" id="collasible-nav-dropdown">
                <NavDropdown.Item as={Link} to="/popularTV">
                  <img
                    src="https://img.icons8.com/ios/32/000000/video.png"
                    alt=""
                  />
                  POPULAR TV SHOWS
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/top_ratedTV">
                  <img
                    src="https://img.icons8.com/external-prettycons-lineal-prettycons/32/000000/external-movie-multimedia-prettycons-lineal-prettycons-1.png"
                    alt=""
                  />
                  TOP-RATED TV SHOWS
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/filterTV">
                  <img
                    src="https://img.icons8.com/ios/32/000000/filter--v1.png"
                    alt=""
                  />
                  FILTER TV SHOWS
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Form className="d-flex" onSubmit={searchMovie}>
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  ref={textInput}
                />
                <Button variant="outline-success" onClick={searchMovie}>
                  Search
                </Button>
              </Form>

              {flag ? (
                <Form action="/signout1" method="POST">
                  <Button
                    variant="danger"
                    type="submit"
                    style={{ color: "white" }}
                  >
                    Sign out
                  </Button>
                </Form>
              ) : (
                <Form action="/signout" method="POST">
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ color: "white" }}
                  >
                    Log In
                  </Button>
                </Form>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationMenu;
