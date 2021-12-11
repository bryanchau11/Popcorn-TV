import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import '../style/Detail.css';
import ToolBar from './Toolbar';
import NavigationMenu from './NavigationMenu';

function Detail() {
  const { movieID } = useParams();
  const [detailMovie, setDetailMovie] = useState([]);
  const textInput = useRef(null);
  const [ratingMovie, setRatingMovie] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [newComment, setNewComment] = useState([]);
  const [liked, setLiked] = useState(false);

  const toggleLiked = () => {
    if (liked === false) {
      fetch('/liked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieID,
          poster_path: detailMovie.poster_path,
          title: detailMovie.title,
          vote_average: detailMovie.vote_average,
          release_date: detailMovie.release_date,
          popularity: detailMovie.popularity,
        }),
      });
    } else {
      fetch('/unliked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movieID }),
      });
    }
    setLiked(!liked);
  };

  useEffect(() => {
    fetch('/detail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movie_id: movieID }),
    }).then((response) => response.json()).then((data) => {
      const result = JSON.parse(data.detail);
      setDetailMovie(result);
    });

    fetch('/check_liked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movie_id: movieID }),
    }).then((response) => response.json()).then((data) => {
      setLiked(data.check);
    });

    fetch('/avg_rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movie_id: movieID }),
    }).then((response) => response.json()).then((data) => {
      const result = JSON.parse(data.avg_rating);
      setAvgRating(result);
    });

    fetch('/all_comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movie_id: movieID }),
    }).then((response) => response.json()).then((data) => {
      const result = JSON.parse(data.all_comment);
      setNewComment(result.comment);
    });
  }, []);

  const ratingChanged = (newRating) => {
    setRatingMovie(newRating);
  };

  const newListComment = [...newComment];

  function addComment() {
    const newItem = textInput.current.value;
    const currentdate = new Date();
    const dateComment = currentdate.toLocaleDateString();
    const hourComment = currentdate.toLocaleTimeString();

    newListComment.push({
      name: detailMovie.username,
      date: dateComment,
      hour: hourComment,
      comment: newItem,
      rating: ratingMovie,
    });
    setNewComment(newListComment);

    textInput.current.value = '';

    fetch('/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movie_id: movieID,
        comment_movie: newItem,
        date: dateComment,
        hour: hourComment,
        rating: ratingMovie,
      }),
    });

    fetch('/avg_rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movie_id: movieID }),
    }).then((response) => response.json()).then((data) => {
      const result = JSON.parse(data.avg_rating);
      setAvgRating(result);
    });
  }

  return (
    <div className="Detail">
      <div className="container p-0">
        <ToolBar />
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 movie_list">
              <div className="movie_card" id="bright">
                <div className="info_section">
                  <div className="movie_header">
                    <img className="locandina" src={detailMovie.poster_path} alt="" />
                    <h1>{detailMovie.title}</h1>
                    <h4>{detailMovie.release_date}</h4>
                    <span className="minutes">
                      {detailMovie.runtime}
                      {' '}
                      min
                    </span>
                    <p className="type">{detailMovie.genres}</p>
                  </div>
                  <div className="movie_desc">
                    <p className="text">{detailMovie.overview}</p>
                  </div>
                </div>
                <div>
                  <img className="blur_back bright_back" src={detailMovie.poster_path} alt="" />
                </div>
              </div>

              <hr />

              <div>
                <div>Favorite:</div>
                <button className="likedMovie" onClick={toggleLiked} type="button">
                  {liked ? (
                    <img src="https://img.icons8.com/color/24/000000/filled-like.png" alt="" />
                  ) : (
                    <img src="https://img.icons8.com/material-outlined/24/000000/like--v1.png" alt="" />
                  )}
                </button>
                <div>Rating:</div>
                <ReactStars count={5} onChange={ratingChanged} size={24} activeColor="#ffd700" />
                <div>Comment:</div>
                <div className="textarea">
                  <textarea cols="110" rows="5" ref={textInput} placeholder="Add comment..." />
                </div>
                <div className="btn">
                  <button className="btn btn-primary" onClick={addComment} type="submit">Post</button>
                </div>
              </div>

              <hr />

              <div className="col-sm-3">
                <div className="rating-block">
                  <h4>Average user rating</h4>
                  <h2 className="bold padding-bottom-7">
                    <strong>{avgRating}</strong>
                    {' '}
                    <small>/ 5</small>
                  </h2>
                  {[...Array(avgRating)].map(() => (
                    <img src="https://img.icons8.com/fluency/24/000000/star.png" alt="" />
                  ))}
                  {[...Array(5 - avgRating)].map(() => (
                    <img src="https://img.icons8.com/color/24/000000/star--v1.png" alt="" />
                  ))}
                </div>
              </div>

              {newComment.map((item) => (
                <div className="row">
                  <div className="col-sm-12">
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <img src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/60/000000/external-user-interface-kiranshastry-solid-kiranshastry.png" alt="" />
                        <div className="review-block-name">{item.name}</div>
                        <div className="review-block-date">
                          {item.date}
                          <br />
                          {item.hour}
                        </div>
                      </div>
                      <div className="col-sm-9">
                        <div className="review-block-rate">
                          {[...Array(item.rating)].map(() => (
                            <img src="https://img.icons8.com/fluency/24/000000/star.png" alt="" />
                          ))}
                        </div>
                        <div className="review-block-description">{item.comment}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
