import React, { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { usePrevProps } from "../../hooks/usePrevProps";
import { useBoard } from "../Board";
import "./tile.less";
import C1_IMG from "../../assets/images/c1.png";
import C2_IMG from "../../assets/images/c2.png";
import C3_IMG from "../../assets/images/c3.png";
import C4_IMG from "../../assets/images/c4.png";
import C5_IMG from "../../assets/images/c5.png";
import C6_IMG from "../../assets/images/c6.png";
import C7_IMG from "../../assets/images/c7.png";
import C8_IMG from "../../assets/images/c8.png";
import C9_IMG from "../../assets/images/c9.png";
import C10_IMG from "../../assets/images/c10.png";
import C11_IMG from "../../assets/images/c11.png";
import { useWindowSize } from "@react-hook/window-size";
type Props = {
  // tile value - 2, 4, 8, 16, 32, ..., 2048.∂
  value: number;
  // an array containing the x and y index on the board.
  position: [number, number];
  // the order of tile on the tile stack.
  zIndex: number;
};

export const Tile = ({ value, position, zIndex }: Props) => {
  // retrieves board properties
  const [containerWidth, tileCount] = useBoard();
  //  state required to animate the highlight
  const [scale, setScale] = useState(1);

  // the previous value (prop) - it is undefined if it is a new tile.
  const previousValue = usePrevProps<number>(value);

  // check if tile is within the board boundries
  const withinBoardBoundaries =
    position[0] < tileCount && position[1] < tileCount;
  invariant(withinBoardBoundaries, "Tile out of bound");
  const [width, height] = useWindowSize()

  // if it is a new tile...
  const isNew = previousValue === undefined;
  // ...or its value has changed...
  const hasChanged = previousValue !== value;
  // ... then the tile should be highlighted.
  const shallHighlight = isNew || hasChanged;

  // useEffect will decide if highlight should be triggered.
  useEffect(() => {
    if (shallHighlight) {
      setScale(1.1);
      setTimeout(() => setScale(1), 100);
    }
  }, [shallHighlight, scale]);

  /**
   * Converts tile position from array index to pixels.
   */
  const positionToPixels = (position: number) => {
    console.log(width);
    if (width > 576) {
      return (position / tileCount) * (containerWidth as number);
    }
    else if (width <= 410 && width > 375) {
      return (position / tileCount) * (318 as number);
    }
    else if (width <= 375 && width > 346) {
      return (position / tileCount) * (288 as number);
    }
    else if (width <= 345) {
      return (position / tileCount) * (290 as number);
    }
    else {
      return (position / tileCount) * (350 as number);
    }

  };

  // all animations come from CSS transition, and we pass them as styles
  const style = {
    top: positionToPixels(position[1]),
    left: positionToPixels(position[0]),
    transform: `scale(${scale})`,
    zIndex,
  };

  return (
    <div className={`tile tile-${value}`} style={style}>
      {
        value === 2 ?
          <div className="tile-control">
            <img src={C1_IMG} className={`pos-img my-auto`}></img>
            <span className="font-bg">2</span>
          </div> :
          value === 4 ?
            <div className="tile-control">
              <img src={C2_IMG} className={`pos-img my-auto`}></img>
              <span className="font-bg">4</span>
            </div> :
            value === 8 ?
              <div className="tile-control">
                <img src={C3_IMG} className={`pos-img my-auto`}></img>
                <span className="font-bg">8</span>
              </div> :
              value === 16 ?
                <div className="tile-control">
                  <img src={C4_IMG} className={`pos-img my-auto`}></img>
                  <span className="font-bg">16</span>
                </div> :
                value === 32 ?
                  <div className="tile-control">
                    <img src={C5_IMG} className={`pos-img my-auto`}></img>
                    <span className="font-bg">32</span>
                  </div> :
                  value === 64 ?
                    <div className="tile-control">
                      <img src={C6_IMG} className={`pos-img my-auto`}></img>
                      <span className="font-bg">64</span>
                    </div> :
                    value === 128 ?
                      <div className="tile-control">
                        <img src={C7_IMG} className={`pos-img my-auto`}></img>
                        <span className="font-bg">128</span>
                      </div> :
                      value === 256 ?
                        <div className="tile-control">
                          <img src={C8_IMG} className={`pos-img my-auto`}></img>
                          <span className="font-bg">256</span>
                        </div> :
                        value === 512 ?
                          <div className="tile-control">
                            <img src={C9_IMG} className={`pos-img my-auto`}></img>
                            <span className="font-bg">512</span>
                          </div> :
                          value === 1024 ?
                            <div className="tile-control">
                              <img src={C10_IMG} className={`pos-img my-auto`}></img>
                              <span className="font-bg">1024</span>
                            </div> :
                            value === 2048 ?
                              <div className="tile-control">
                                <img src={C11_IMG} className={`pos-img my-auto`}></img>
                                <span className="font-bg">2048</span>
                              </div> :
                              value
      }
    </div>
  );
};
