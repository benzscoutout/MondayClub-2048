import React, { useEffect, useState } from "react";
import { Game } from "../Game"
import { useGame } from "../Game/hooks/useGame";
import './play.less'
import IMG_CITY from "../../assets/images/city.png";
import IMG_LOGO from "../../assets/images/logo.png";
import Modal from 'react-modal';
import { store } from 'react-context-hook'
import ReactModal from "react-modal";
import '../Tile/modal.less';
import { useNavigate } from "react-router-dom";
import UtilityService from "../utils/utility";
export const Play = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [tiles, moveLeft, moveRight, moveUp, moveDown] = useGame();
  const [curr, setCurr] = useState(0);
  const handleRestart = () => {
    UtilityService().clickSendEvent('Click', 'Play', 'Restart');
    setDate(new Date());
  };
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
 

  return (
    <div>
    

      <div className="play">
        <div className="header">
          <div className="grid-control">
            <img src={IMG_LOGO} className="img-logo"></img>
          </div>
        </div>
        <div className="game-control">
          <Game key={date.toISOString()} />
        </div>

        <div className="grid-control">
          <button onClick={handleRestart} className="button-control">Restart</button>
        </div>
        <img src={IMG_CITY} className="img-city-2"></img>
        {/* {vw} x {vh} */}





        {/* <div>
        <p>
          <b>Wondering how was that built?</b> You can find a video tutorial and
          code here:
        </p>
        <ul>
          <li>
            <a href="https://youtu.be/vI0QArPnkUc" target="_blank">
              Tutorial (YouTube video)
            </a>
          </li>
          <li>
            <a
              href="https://github.com/mateuszsokola/2048-in-react/"
              target="_blank"
            >
              Source Code (Github)
            </a>
          </li>
          <li>
            <a
              href="https://mateuszsokola.github.io/2048-animation-examples/"
              target="_blank"
            >
              Animation Examples (Github Pages)
            </a>
          </li>
        </ul>
        <p>
          This game (2048) was built using <b>React</b> and <b>TypeScript</b>.
          The unique part of this example is animations. The animations in React
          aren't that straightforward, so I hope you can learn something new
          from it.
        </p>
      </div>
      <div className="footer">
        Made with ❤️ by{" "}
        <a
          href="https://www.youtube.com/channel/UCJV16_5c4A0amyBZSI4yP6A"
          target="_blank"
        >
          Matt Sokola
        </a>
      </div> */}
      </div>
    </div>
  )

}