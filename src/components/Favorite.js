import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ToolBar from './Toolbar';
import NavigationMenu from './NavigationMenu';

function Favorite() {
  const [allFavorite, setAllFavorite] = useState([]);

  useEffect(() => {
    fetch('/all_favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((data) => {
      const result = JSON.parse(data.all_favorite);
      setAllFavorite(result.favorite);
    });
  }, []);

  return (
    <div className="Favorite">
      <div className="container p-0">
        <ToolBar />
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 movie_list">
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1>Favorite Movies</h1>
                </div>
                <div className="row">
                  {allFavorite.map((item) => (
                    <div className="card-view">
                      <div className="card-header">
                        <Link to={`/detail/${item.movie_id}`}><img src={item.poster_path} alt="" /></Link>
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
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Favorite;
