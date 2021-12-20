import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
//import "./index.css";
import App from "./App";
import TopRated from "./components/TopRated";
import Search from "./components/Search";
import Detail from "./components/Detail";
import Filter from "./components/Filter";
import Favorite from "./components/Favorite";
import Contact from "./components/Contact";
import Settings from "./components/Settings";
import PopularTV from "./components/TV/PopularTV";
import TopRatedTV from "./components/TV/TopRatedTV";
import FilterTV from "./components/TV/FilterTV";
import DetailTV from "./components/TV/DetailTV";
import Footer from "./components/Footer";
import Korean from "./components/TV/Korean";
import Disclaimer from "./components/Disclaimer";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/index" element={<App />} />
      <Route path="/top_rated" element={<TopRated />} />
      <Route path="/search/:movieName" element={<Search />} />
      <Route path="/detail/:movieID" element={<Detail />} />
      <Route path="/filter" element={<Filter />} />
      <Route path="/favorite" element={<Favorite />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="/popularTV" element={<PopularTV />} />
      <Route path="/top_ratedTV" element={<TopRatedTV />} />
      <Route path="/filterTV" element={<FilterTV />} />
      <Route path="/detailTV/:tvID" element={<DetailTV />} />
      <Route path="/korean" element={<Korean />} />

      <Route path="/disclaimer" element={<Disclaimer />} />
    </Routes>
    <Footer />
  </HashRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
