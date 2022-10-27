import React, { useEffect, useState } from "react";
import { Game } from "../Game"
import { useGame } from "../Game/hooks/useGame";
import './play-timer.less'
import IMG_CITY from "../../assets/images/city.png";
import IMG_LOGO from "../../assets/images/logo.png";
import '../Tile/modal.less';
import UtilityService from "../utils/utility";
import Countdown from "react-countdown";
import config from "../../config";
import { useGlobalState } from "../state";
import CountDownComp from "../CountDown/countdown";
const PlayTimer = () => {
    const [timerEnd, setTimerEnd] = useGlobalState('timerEnd')
    const [isEndGame, setIsEndGame] = useGlobalState('isEndGame')
    const [tiles, moveLeft, moveRight, moveUp, moveDown] = useGame();
    const [curr, setCurr] = useState(0);
  

    const [start, setStart] = useState(false);
    const timerCount = Number(config.timer) * 60000 + 1000;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
 

    const updateTimer = () => {
        console.log("update Timer");
    }

    useEffect(() => {

        console.log("Play timer")

    }, [start])

    return (
        <>
            <div>


                <div className="play-timer">
                    <div className="header">
                        <div className="grid-control">
                            <img src={IMG_LOGO} className="img-logo"></img>
                        </div>
                    </div>
                   
                    <div className="game-control">
                        <Game  />
                    </div>


                    <img src={IMG_CITY} className="img-city-2-timer"></img>

                </div>
            </div>
        </>
    )

}

export default PlayTimer;