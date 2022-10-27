import { useCallback, useEffect, useState } from "react";
import { Button } from "./components/Button";
import { Game } from "./components/Game";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.less";
import { useGame } from "./components/Game/hooks/useGame";
import { Home } from "./components/Home/home";
import { Play } from "./components/Play/play";
import ReactGA from "react-ga4";
import LeaderBoardComponent from "./components/LeaderBoard/leader-board";
/* eslint-disable react/jsx-no-target-blank */
import { createGlobalState } from "react-hooks-global-state";
import PlayTimer from "./components/Play-Timer/play-timer";
import CountDownComp from "./components/CountDown/countdown";
export const App = () => {

  const initialStateScore = { score: 0, isEndGame: false, isWinner: false };
  const { useGlobalState } = createGlobalState(initialStateScore);
  const [isEndGame] = useState('isEndGame');
  useEffect(() => {
    console.log(isEndGame);
  }, [])

  return (
    <div className="App">
       <CountDownComp></CountDownComp>
    <BrowserRouter>

      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/start" element={<Play />} />
        <Route path="/start-timer" element={<PlayTimer />} />
        <Route path="/leader-board" element={<LeaderBoardComponent />} />
        
      </Routes>
    </BrowserRouter>
  </div>
   
  );
};
ReactGA.initialize("G-P4R31P5B1T");
/* eslint-enable react/jsx-no-target-blank */
