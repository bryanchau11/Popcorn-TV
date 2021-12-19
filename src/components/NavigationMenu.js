import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

  return (
    <nav
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

        <ul className="nav flex-column">
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/ios/32/FFFFFF/video.png"
                alt=""
              />
              <div>
                <Link to="/index">Popular Movies</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/external-prettycons-lineal-prettycons/32/FFFFFF/external-movie-multimedia-prettycons-lineal-prettycons-1.png"
                alt=""
              />
              <div>
                <Link to="/top_rated">Top Rated Movies</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/ios/32/FFFFFF/filter--v1.png"
                alt=""
              />
              <div>
                <Link to="/filter">Filter Movies</Link>
              </div>
            </div>
          </li>
        </ul>

        <hr />
        <ul className="nav flex-column">
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/ios/32/FFFFFF/video.png"
                alt=""
              />
              <div>
                <Link to="/popularTV">Popular TV Shows</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/external-prettycons-lineal-prettycons/32/FFFFFF/external-movie-multimedia-prettycons-lineal-prettycons-1.png"
                alt=""
              />
              <div>
                <Link to="/top_ratedTV">Top Rated TV Shows</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img
                src="https://img.icons8.com/ios/32/FFFFFF/filter--v1.png"
                alt=""
              />
              <div>
                <Link to="/filterTV">Filter TV Shows</Link>
              </div>
            </div>
          </li>
        </ul>

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
                <Link to="/favorite" style={{ pointerEvents: "none" }}>
                  Favorite Movies (underdeveloped)
                </Link>
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
  );
}

export default NavigationMenu;
