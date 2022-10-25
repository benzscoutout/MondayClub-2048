import { useCallback, useEffect, useState } from "react";
import { Button } from "./components/Button";
import { Game } from "./components/Game";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.less";
import { useGame } from "./components/Game/hooks/useGame";
import { Home } from "./components/Home/home";
import { Play } from "./components/Play/play";

/* eslint-disable react/jsx-no-target-blank */
export const App = () => {
 



  return (
    <div className="App">
    <BrowserRouter>

      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/start" element={<Play />} />
     
      </Routes>
    </BrowserRouter>
  </div>
   
  );
};
/* eslint-enable react/jsx-no-target-blank */
