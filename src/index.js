import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import TopRated from "./components/TopRated";
import Search from './components/Search';
import Detail from "./components/Detail";
import Filter from "./components/Filter";
import Favorite from './components/Favorite';
import Contact from './components/Contact';
import Settings from './components/Settings';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/index" element={<App />} />
      <Route path="/top_rated" element={<TopRated />} />
      <Route path="/search/:movieName" element={<Search />} />
      <Route path="/detail/:movieID" element={<Detail />} />
      <Route path="/filter" element={<Filter />} />
      <Route path="/favorite" element={<Favorite />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
