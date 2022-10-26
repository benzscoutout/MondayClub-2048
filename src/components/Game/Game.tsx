import React, { useEffect } from "react";
import { useThrottledCallback } from "use-debounce";
import { useSwipeable } from 'react-swipeable';
import { useGame } from "./hooks/useGame";
import { Board, animationDuration, tileCount } from "../Board";
import './game.less';
import '../Tile/modal.less';
import { store } from "react-context-hook";
import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { useGlobalState } from '../state';
const firebaseConfig = {
  apiKey: "AIzaSyAntag2xWg6vUn1sjQYFLwilbzednL37Os",
  authDomain: "monday-club-48189.firebaseapp.com",
  projectId: "monday-club-48189",
  storageBucket: "monday-club-48189.appspot.com",
  messagingSenderId: "59628633346",
  appId: "1:59628633346:web:2a0c2fa4d80ca1ed87961b",
  measurementId: "G-DM31RQF8RH"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const Game = () => {
  const score = useGlobalState('score');
  const isEndGame = useGlobalState('isEndGame');
  const [tiles, moveLeft, moveRight, moveUp, moveDown] = useGame();
  const theState = store.getState();
  const handleKeyDown = (e: KeyboardEvent) => {
    // disables page scrolling with keyboard arrows
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
        moveLeft();
        calculateModal();
        break;
      case "ArrowRight":
        moveRight();
        calculateModal();
        break;
      case "ArrowUp":
        moveUp();
        calculateModal();
        break;
      case "ArrowDown":
        moveDown();
        calculateModal();
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
    console.log(isEndGame[0]);
    if (isEndGame[0]) {
      setIsOpen(true);
      if(score){
        writeUserData(Number(score), false);
      }
  
    }
  }
  const writeUserData = async (score: number, isWinner: boolean) => {
    try {
      const docRef = await addDoc(collection(db, "score-2048"), {
        score: score,
        isWinner: isWinner,
        timeStamp: new Date().toISOString()
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", throttledHandleKeyDown);

    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);
  const handlers = useSwipeable({
    onSwipedLeft: () => { moveLeft(); calculateModal(); },
    onSwipedRight: () => { moveRight(); calculateModal(); },
    onSwipedDown: () => { moveDown(); calculateModal(); },
    onSwipedUp: () => { moveUp(); calculateModal(); },
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
    window.open('/', '_self');
  }



  const customStyle = {
    content: {

      backgroundColor: 'black',
    },

  }
  return (
    <div className="container d-flex flex-column container-control" >
      {
        isEndGame[0] &&
          score[0] ?
          <div className="modal-control">
            <div className="modal-content">
              <div className="Modal" >

                <div className="score-control">
                  <h2 className="text-score-header">Your Score</h2>
                  <span className="text-score">{score[0]}</span>
                  <span className="close-text" onClick={closeModal}>close</span>
                </div>

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
