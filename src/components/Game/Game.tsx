import React, { useEffect } from "react";
import { useThrottledCallback } from "use-debounce";
import { useSwipeable } from 'react-swipeable';
import { useGame } from "./hooks/useGame";
import { Board, animationDuration, tileCount } from "../Board";
import './game.less';

export const Game = () => {
  const [tiles, moveLeft, moveRight, moveUp, moveDown] = useGame();

  const handleKeyDown = (e: KeyboardEvent) => {
    // disables page scrolling with keyboard arrows
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowDown":
        moveDown();
        break;
    }
  };

  // protects the reducer from being flooded with events.
  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    animationDuration,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    window.addEventListener("keydown", throttledHandleKeyDown);

    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);
  const handlers = useSwipeable({
    onSwipedLeft: () => moveLeft(),
    onSwipedRight: () => moveRight(),
    onSwipedDown: () => moveDown(),
    onSwipedUp: () => moveUp(),
    swipeDuration: Infinity,
    preventScrollOnSwipe: false,
    trackMouse: false,
    trackTouch: true,
    touchEventOptions: { passive: true }
  });


  return (
    <div className="container d-flex flex-column container-control" >
      <div className="desktop-custom">
      <Board tiles={tiles} tileCountPerRow={tileCount} />
      </div>
      <div className="mobile-custom mobile-control" style={{ touchAction: 'pan-y' }} {...handlers}>
        <Board tiles={tiles} tileCountPerRow={tileCount}   />
      </div>

    </div>
  )


};
