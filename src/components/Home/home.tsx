import { useEffect, useState } from "react";
import { Game } from "../Game"
import { useGame } from "../Game/hooks/useGame";
import IMG_LOGO from "../../assets/images/logo.png";
import IMG_CITY from "../../assets/images/city.png";
import IMG_GAME from "../../assets/images/img-game.jpg"
import './home.less';
import UtilityService from "../utils/utility";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    let navigate = useNavigate();
    const goPlay = () => {
        UtilityService().clickSendEvent('Click', 'Home', 'Start Play');
        navigate('/start');
    }
    const goLeaderboard = () => {
        UtilityService().clickSendEvent('Click', 'Home', 'Leaderboard');
        navigate('/leader-board');
    }

    const clickLicense = () => {
        UtilityService().clickSendEvent('Click', 'Home', 'License');
        window.open('https://mateuszsokola.github.io/2048-in-react/', '_blank');
    }

    useEffect(() => {

    }, [])


    return (
        <div className="home">
            <img src={IMG_LOGO} className="img-logo"></img>
            <img src={IMG_GAME} className="img-game"></img>
            <button className="button-start" onClick={goPlay}>Start</button>
            <button className="button-leader-board" onClick={goLeaderboard}>Leaderboard</button>
            <img src={IMG_CITY} className="img-city"></img>
            <span className="text-license" onClick={clickLicense}>@license https://mateuszsokola.github.io/2048-in-react/</span>
        </div>
    )

}