import { useState } from "react";
import { Game } from "../Game"
import { useGame } from "../Game/hooks/useGame";
import IMG_LOGO from "../../assets/images/logo.png";
import IMG_CITY from "../../assets/images/city.png";
import IMG_GAME from "../../assets/images/img-game.jpg"
import './home.less';

export const Home = () => {

    const goPlay = () => {

        window.open('/start', '_self');
    }
    const goLeaderboard = () => {

        window.open('/leader-board', '_self');
    }
  

    return (
        <div className="home">
            <img src={IMG_LOGO} className="img-logo"></img>
            <img src={IMG_GAME} className="img-game"></img>
           <button className="button-start" onClick={goPlay}>Start</button>
           <button className="button-leader-board" onClick={goLeaderboard}>Leaderboard</button>
           <img src={IMG_CITY} className="img-city"></img>
           <span className="text-license">@license https://mateuszsokola.github.io/2048-in-react/</span>
        </div>
    )

}