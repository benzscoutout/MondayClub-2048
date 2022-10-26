import { useCallback, useEffect, useState } from "react";
import { Button } from "./components/Button";
import { Game } from "./components/Game";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.less";
import { useGame } from "./components/Game/hooks/useGame";
import { Home } from "./components/Home/home";
import { Play } from "./components/Play/play";
import { store } from "react-context-hook";
import ReactModal from "react-modal";
import LeaderBoardComponent from "./components/LeaderBoard/leader-board";
/* eslint-disable react/jsx-no-target-blank */
import { createGlobalState } from "react-hooks-global-state";
export const App = () => {

  const initialStateScore = { score: 0, isEndGame: false, isWinner: false };
  const { useGlobalState } = createGlobalState(initialStateScore);


  return (
    <div className="App">
    <BrowserRouter>

      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/start" element={<Play />} />
        <Route path="/leader-board" element={<LeaderBoardComponent />} />
      </Routes>
    </BrowserRouter>
  </div>
   
  );
};

/* eslint-enable react/jsx-no-target-blank */
