import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NavigationMenu() {
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/get_username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((data) => {
      setName(data.username);
    });
  }, []);

  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <div className="nav-link">
              <div>
                Welcome,
                {' '}
                {name}
              </div>
            </div>
          </li>
        </ul>

        <hr />

        <ul className="nav flex-column">
          <li className="nav-item">
            <div className="nav-link">
              <img src="https://img.icons8.com/ios/32/000000/video.png" alt="" />
              <div>
                <Link to="/index">Popular Movies</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img src="https://img.icons8.com/external-prettycons-lineal-prettycons/32/000000/external-movie-multimedia-prettycons-lineal-prettycons-1.png" alt="" />
              <div>
                <Link to="/top_rated">Top Rated Movies</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img src="https://img.icons8.com/ios/32/000000/filter--v1.png" alt="" />
              <div>
                <Link to="/filter">Filter Movies</Link>
              </div>
            </div>
          </li>
        </ul>

        <hr />

        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <div className="nav-link">
              <img src="https://img.icons8.com/material-outlined/32/000000/like--v1.png" alt="" />
              <div>
                <Link to="/favorite">Favorite Movies</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img src="https://img.icons8.com/ios/32/000000/contact-card.png" alt="" />
              <div>
                <Link to="/contact">Contact</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img src="https://img.icons8.com/ios/32/000000/settings.png" alt="" />
              <div>
                <Link to="/settings">Settings</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img src="https://img.icons8.com/ios/32/000000/logout-rounded--v1.png" alt="" />
              <form action="/signout" method="POST">
                <button className="signOut" type="submit">Sign out</button>
              </form>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavigationMenu;
