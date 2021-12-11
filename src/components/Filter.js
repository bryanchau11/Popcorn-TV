import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Filter.css';
import ToolBar from './Toolbar';
import NavigationMenu from './NavigationMenu';

function Filter() {
  const [genre, setGenre] = useState('');
  const [filterMovie, setFilterMovie] = useState([]);

  const filter = () => {
    fetch('/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movie_genre: genre }),
    }).then((response) => response.json()).then((data) => {
      const result = JSON.parse(data.filter);
      setFilterMovie(result.filter_movie);
    });
  };

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
                  <h1>Filter Movies</h1>
                </div>
                <div className="classic">
                  <select onChange={(event) => setGenre(event.target.value)}>
                    <option value="28">Action</option>
                    <option value="12">Adventure</option>
                    <option value="16">Animation</option>
                    <option value="35">Comedy</option>
                    <option value="80">Crime</option>
                    <option value="18">Drama</option>
                    <option value="10751">Family</option>
                    <option value="14">Fantasy</option>
                    <option value="36">History</option>
                    <option value="27">Horror</option>
                    <option value="9648">Mystery</option>
                    <option value="10749">Romance</option>
                    <option value="878">Science Fiction</option>
                    <option value="53">Thriller</option>
                    <option value="10752">War</option>
                  </select>
                  <button className="btn btn-primary btn-filter" onClick={filter} type="submit">Filter</button>
                </div>
                <div className="row">
                  {filterMovie.map((item) => (
                    <div className="card-view">
                      <div className="card-header">
                        <Link to={`/detail/${item.id_movie}`}><img src={item.poster_path} alt="" /></Link>
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

export default Filter;
