/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import logo from "./logo2.png"

import { useNavigate } from "react-router-dom"
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Form,
  Button,
  FormControl,
} from "react-bootstrap"
import "../style/Navbar.css"
function NavigationMenu() {
  const [name, setName] = useState("")
  const [flag, setFlag] = useState(true)
  useEffect(() => {
    fetch("/get_username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setName(data.username)
        if (data.username === "") {
          setFlag(false)
        }
      })
  }, [])
  const SmoothScroll = (id) => {
    let element = document.getElementById(id)
    element.scrollIntoView({ behavior: "smooth", block: "center" })
  }
  const textInput = useRef(null)
  const navigate = useNavigate()

  const searchMovie = (event) => {
    event.preventDefault()
    const movieName = textInput.current.value
    if (movieName !== "") {
      navigate(`/search/${movieName}`)
    } else {
      alert("Please enter name of movie")
    }
  }

  return (
    <>
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
              <Nav.Link as={Link} to="/favorite">
                SAVE FOR LATER
              </Nav.Link>
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
              <a href="https://www.buymeacoffee.com/popcorntv">
                <img
                  alt=""
                  src="https://img.buymeacoffee.com/button-api/?text=Buy me a popcorn&emoji=🍿&slug=popcorntv&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                />
              </a>
            </Nav>
            <Nav className="ms-auto">
              <Button as={Link} to="/korean" variant="warning">
                KOREAN MOVIES
              </Button>
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
  )
}

export default NavigationMenu
