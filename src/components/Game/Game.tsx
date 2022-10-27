import React, { useEffect, useState } from "react";
import { useThrottledCallback } from "use-debounce";
import { useSwipeable } from 'react-swipeable';
import { useGame } from "./hooks/useGame";
import { Board, animationDuration, tileCount } from "../Board";
import './game.less';
import '../Tile/modal.less';
import { store } from "react-context-hook";

import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { useGlobalState } from '../state';
import ApiServices from "../score-service";
import UtilityService from "../utils/utility";
import { useNavigate } from "react-router-dom";


export const Game = () => {
  let navigate = useNavigate();
  const [score, setScore] = useGlobalState('score')
  const [isEndGame, setIsEndGame] = useGlobalState('isEndGame')
  const [tiles, moveLeft, moveRight, moveUp, moveDown] = useGame();
  const [name, setName] = useGlobalState('name');
  const [isName, setIsName] = useState(false);
  const theState = store.getState();
  const handleKeyDown = (e: KeyboardEvent) => {
    // disables page scrolling with keyboard arrows
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
        if (!isEndGame) {
          console.log("LEFT MOVE");
          moveLeft();
          calculateModal();
        }
        break;
      case "ArrowRight":
        if (!isEndGame) {
          moveRight();
          calculateModal();
        }
        break;
      case "ArrowUp":
        if (!isEndGame) {
          moveUp();
          calculateModal();
        }
        break;
      case "ArrowDown":
        if (!isEndGame) {
          moveDown();
          calculateModal();
        }
        break;
    }
  };

  // protects the reducer from being flooded with events.
  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    animationDuration,
    { leading: true, trailing: false }
  );

  const calculateModal = () => {

  }

  useEffect(() => {
    if (isEndGame) {
      setIsOpen(true);
    }
  }, [])

  useEffect(() => {

    window.addEventListener("keydown", throttledHandleKeyDown);

    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isEndGame) {
        moveLeft();
        calculateModal();
      }
    },
    onSwipedRight: () => {
      if (!isEndGame) {
        moveRight();
        calculateModal();
      }
    },
    onSwipedDown: () => {
      if (!isEndGame) {
        moveDown();
        calculateModal();

      }
    },
    onSwipedUp: () => {
      if (!isEndGame) {
        moveUp();
        calculateModal();

      }
    },
    swipeDuration: Infinity,
    preventScrollOnSwipe: false,
    trackMouse: false,
    trackTouch: true,
    touchEventOptions: { passive: true }
  });
  useEffect(() => {
    console.log(tiles);

  }, [])
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const closeModal = () => {
    navigate('/')
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsName(true);
    ApiServices().writeUserData(score,false,name);

    UtilityService().clickSendEvent('Click', 'Play', 'Submit ' + name + ' : ' + score);
  }

  const handleChange = (e: any) => {
    console.log(e.target.value);
    setName(e.target.value);
  }



  const customStyle = {
    content: {

      backgroundColor: 'black',
    },

  }
  return (
    <div className="container d-flex flex-column container-control" >
      {
        isEndGame &&
          score ?
          <div className="modal-control">
            <div className="modal-content">
              <div className="Modal" >

                {
                  !isName ?

                    <div className="score-control">
                      <h2 className="text-score-header">Your name</h2>
                      <form onSubmit={handleSubmit}>
                        <div className="input-control">
                          <input type="text" name="name" onChange={handleChange} maxLength={8} className="input-style" />
                          <input type="submit" value="Submit" className="button-start" />
                        </div>
                      </form>
                    </div> :
                    <div className="score-control">
                      <h2 className="text-score-header">Your Score</h2>
                      <span className="text-score">{score}</span>
                      <span className="close-text" onClick={closeModal}>close</span>
                    </div>
                }



              </div>
            </div>
          </div> : null
      }
      <div>
        Score : {score}
      </div>
      <div className="desktop-custom">
        <Board tiles={tiles} tileCountPerRow={tileCount} />
      </div>
      <div className="mobile-custom mobile-control" style={{ touchAction: 'pan-y' }} {...handlers}>
        <Board tiles={tiles} tileCountPerRow={tileCount} />
      </div>

    </div>
  )


};
