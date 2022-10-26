import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import ReactModal from "react-modal";
import {
  animationDuration,
  tileCount as tileCountPerRowOrColumn,
} from "../../../Board";
import { TileMeta } from "../../../Tile";
import { useIds } from "../useIds";
import { GameReducer, initialState } from "./reducer";
import { store } from 'react-context-hook'
import { ifError } from "assert";
import { useGlobalState } from '../../../state';
export const useGame = () => {

  const isInitialRender = useRef(true);
  const [nextId] = useIds();
  // state
  const [state, dispatch] = useReducer(GameReducer, initialState);
  const [countTileMove, setCountTileMove] = useState(false);
  const { tiles, byIds, hasChanged, inMotion } = state;
  const [score, setScore] = useGlobalState('score')
  const [isEndGame, setIsEndGame] = useGlobalState('isEndGame')

  const createTile = useCallback(
    ({ position, value }: Partial<TileMeta>) => {
      const tile = {
        id: nextId(),
        position,
        value,
      } as TileMeta;

      dispatch({ type: "CREATE_TILE", tile });
    },
    [nextId]
  );



  const mergeTile = (source: TileMeta, destination: TileMeta) => {
    var currentScore = 0;
    if (score) {
      currentScore = score + source.value * 2;
      if (source.value === 4) {
        currentScore = score + (source.value * 2);
      } else if (source.value === 8) {
        currentScore = score + (source.value * 3);
      } else if (source.value === 16) {
        currentScore = score + (source.value * 4);
      } else if (source.value === 32) {
        currentScore = score + (source.value * 5);
      } else if (source.value === 64) {
        currentScore = score + (source.value * 6);
      } else if (source.value === 128) {
        currentScore = score + (source.value * 7);
      } else if (source.value === 256) {
        currentScore = score + (source.value * 8);
      } else if (source.value === 512) {
        currentScore = score + (source.value * 9);
      } else if (source.value === 1024) {
        currentScore = score + (source.value * 10);
      } else if (source.value === 2048) {
        currentScore = score + (source.value * 11);
      } else {
        currentScore = score + (source.value);
      }
      store.set('score', currentScore)
      setScore(currentScore);
    } else {
      currentScore = source.value * 2;

      if (source.value === 4) {
        currentScore = (source.value * 2);
      } else if (source.value === 8) {
        currentScore = (source.value * 3);
      } else if (source.value === 16) {
        currentScore = (source.value * 4);
      } else if (source.value === 32) {
        currentScore = (source.value * 5);
      } else if (source.value === 64) {
        currentScore = (source.value * 6);
      } else if (source.value === 128) {
        currentScore = (source.value * 7);
      } else if (source.value === 256) {
        currentScore = (source.value * 8);
      } else if (source.value === 512) {
        currentScore = (source.value * 9);
      } else if (source.value === 1024) {
        currentScore = (source.value * 10);
      } else if (source.value === 2048) {
        currentScore = (source.value * 11);
      } else {
        currentScore = (source.value);
      }
      store.set('score', currentScore)
      setScore(currentScore);
    }
    console.log(currentScore);
    dispatch({ type: "MERGE_TILE", source, destination });
  };

  // A must-have to keep the sliding animation if the action merges tiles together.
  const throttledMergeTile = (source: TileMeta, destination: TileMeta) => {
    setTimeout(() => {
      mergeTile(source, destination);
    }
      , animationDuration)
  };

  const updateTile = (tile: TileMeta) => {
    dispatch({ type: "UPDATE_TILE", tile });
  };

  const didTileMove = (source: TileMeta, destination: TileMeta) => {
    const hasXChanged = source.position[0] !== destination.position[0];
    const hasYChanged = source.position[1] !== destination.position[1];

    return hasXChanged || hasYChanged;
  };

  const retrieveTileMap = useCallback(() => {
    const tileMap = new Array(
      tileCountPerRowOrColumn * tileCountPerRowOrColumn
    ).fill(0) as number[];

    byIds.forEach((id) => {
      const { position } = tiles[id];
      const index = positionToIndex(position);
      tileMap[index] = id;
    });

    return tileMap;
  }, [byIds, tiles]);

  const findEmptyTiles = useCallback(() => {
    const tileMap = retrieveTileMap();
    const emptyTiles = tileMap.reduce((result, tileId, index) => {
      if (tileId === 0) {
        return [...result, indexToPosition(index) as [number, number]];
      }
      return result;
    }, [] as [number, number][]);

    return emptyTiles;
  }, [retrieveTileMap]);

  const generateRandomTile = useCallback(() => {
    const emptyTiles = findEmptyTiles();

    if (emptyTiles.length > 0) {
      const index = Math.floor(Math.random() * emptyTiles.length);
      const position = emptyTiles[index];

      createTile({ position, value: 2 });
    }
  }, [findEmptyTiles, createTile]);

  const positionToIndex = (position: [number, number]) => {
    return position[1] * tileCountPerRowOrColumn + position[0];
  };

  const indexToPosition = (index: number) => {
    const x = index % tileCountPerRowOrColumn;
    const y = Math.floor(index / tileCountPerRowOrColumn);
    return [x, y];
  };

  type RetrieveTileIdsPerRowOrColumn = (rowOrColumnIndex: number) => number[];

  type CalculateTileIndex = (
    tileIndex: number,
    tileInRowIndex: number,
    howManyMerges: number,
    maxIndexInRow: number
  ) => number;

  const move = (
    retrieveTileIdsPerRowOrColumn: RetrieveTileIdsPerRowOrColumn,
    calculateFirstFreeIndex: CalculateTileIndex
  ) => {
    // new tiles cannot be created during motion.
    dispatch({ type: "START_MOVE" });
 
    const maxIndex = tileCountPerRowOrColumn - 1;
    let mergeTileResult = 0;
    let mergedTilesCount = 0;
    // iterates through every row or column (depends on move kind - vertical or horizontal).
    for (
      let rowOrColumnIndex = 0;
      rowOrColumnIndex < tileCountPerRowOrColumn;
      rowOrColumnIndex += 1
    ) {
      // retrieves tiles in the row or column.
      const availableTileIds = retrieveTileIdsPerRowOrColumn(rowOrColumnIndex);


      // previousTile is used to determine if tile can be merged with the current tile.
      let previousTile: TileMeta | undefined;
      // mergeCount helps to fill gaps created by tile merges - two tiles become one.
      let mergedTilesCount = 0;

      // interate through available tiles.

      availableTileIds.forEach((tileId, nonEmptyTileIndex) => {
        const currentTile = tiles[tileId];

        // if previous tile has the same value as the current one they should be merged together.
        if (
          previousTile !== undefined &&
          previousTile.value === currentTile.value
        ) {
          const tile = {
            ...currentTile,
            position: previousTile.position,
            mergeWith: previousTile.id,
          } as TileMeta;

          // delays the merge by 250ms, so the sliding animation can be completed.
          throttledMergeTile(tile, previousTile);
          // previous tile must be cleared as a single tile can be merged only once per move.
          previousTile = undefined;
          // increment the merged counter to correct position for the consecutive tiles to get rid of gaps
          mergedTilesCount += 1;
          return updateTile(tile);
        }

        // else - previous and current tiles are different - move the tile to the first free space.
        const tile = {
          ...currentTile,
          position: indexToPosition(
            calculateFirstFreeIndex(
              rowOrColumnIndex,
              nonEmptyTileIndex,
              mergedTilesCount,
              maxIndex
            )
          ),
        } as TileMeta;


        // previous tile become the current tile to check if the next tile can be merged with this one.
        previousTile = tile;

        // only if tile has changed its position it will be updated
        if (didTileMove(currentTile, tile)) {
          return updateTile(tile);
        } 
      });
    }

    // wait until the end of all animations.
    setTimeout(() => {
     
      dispatch({ type: "END_MOVE" })
    }
      , animationDuration);

    setTimeout(() => {

      if (findEmptyTiles().length === 0) {
        let objectResult: any = [];
        for (let i = 0; i < 16; i++) {
          byIds.forEach((id) => {

            if (tiles[id].position.toString() == indexToPosition(i).toString()) {
              objectResult.push(tiles[id].value);
            }
          });
        }

        let checkEnd = true;
        objectResult.forEach((item: any, index: number) => {

          // row 1
          if (index === 0) {
            if (objectResult[1] !== item && objectResult[4] !== item) {
              console.log("0 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 1) {
            if (objectResult[0] !== item && objectResult[2] !== item && objectResult[5] !== item) {
              console.log("1 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 2) {
            if (objectResult[1] !== item && objectResult[3] !== item && objectResult[6] !== item) {
              console.log("2 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 3) {
            if (objectResult[2] !== item && objectResult[7] !== item) {
              console.log("3 Pass");
            } else {
              checkEnd = false;
            }
          }
          // row 2
          else if (index === 4) {
            if (objectResult[0] !== item && objectResult[5] !== item && objectResult[8] !== item) {
              console.log("4 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 5) {
            if (objectResult[1] !== item && objectResult[4] !== item && objectResult[6] !== item && objectResult[9] !== item) {
              console.log("5 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 6) {
            if (objectResult[2] !== item && objectResult[5] !== item && objectResult[7] !== item && objectResult[10] !== item) {
              console.log("6 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 7) {
            if (objectResult[3] !== item && objectResult[6] !== item && objectResult[11] !== item) {
              console.log("7 Pass");
            } else {
              checkEnd = false;
            }
          }
          // row 3
          else if (index === 8) {
            if (objectResult[4] !== item && objectResult[9] !== item && objectResult[12] !== item) {
              console.log("8 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 9) {
            if (objectResult[5] !== item && objectResult[8] !== item && objectResult[10] !== item && objectResult[13] !== item) {
              console.log("9 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 10) {
            if (objectResult[6] !== item && objectResult[9] !== item && objectResult[11] !== item && objectResult[14] !== item) {
              console.log("10 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 11) {
            if (objectResult[7] !== item && objectResult[10] !== item && objectResult[15] !== item) {
              console.log("11 Pass");
            } else {
              checkEnd = false;
            }
          } // row 4
          else if (index === 12) {
            if (objectResult[8] !== item && objectResult[13] !== item) {
              console.log("12 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 13) {
            if (objectResult[9] !== item && objectResult[12] !== item && objectResult[14] !== item) {
              console.log("13 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 14) {
            if (objectResult[10] !== item && objectResult[13] !== item && objectResult[15] !== item) {
              console.log("14 Pass");
            } else {
              checkEnd = false;
            }
          } else if (index === 15) {
            if (objectResult[11] !== item && objectResult[14] !== item) {
              console.log("15 Pass");
            } else {
              checkEnd = false;
            }
          }
        })
        if(checkEnd){
          setIsEndGame(true);
        }
      }else{
       
      }
    }
      , 1000);
  };

  const moveLeftFactory = () => {


    const retrieveTileIdsByRow = (rowIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInRow = [
        tileMap[rowIndex * tileCountPerRowOrColumn + 0],
        tileMap[rowIndex * tileCountPerRowOrColumn + 1],
        tileMap[rowIndex * tileCountPerRowOrColumn + 2],
        tileMap[rowIndex * tileCountPerRowOrColumn + 3],
      ];

      const nonEmptyTiles = tileIdsInRow.filter((id) => id !== 0);

      return nonEmptyTiles;
    };



    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInRowIndex: number,
      howManyMerges: number,
      _: number
    ) => {


      return (
        tileIndex * tileCountPerRowOrColumn + tileInRowIndex - howManyMerges
      );
    };
    return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);


  };

  const moveRightFactory = () => {

    const retrieveTileIdsByRow = (rowIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInRow = [
        tileMap[rowIndex * tileCountPerRowOrColumn + 0],
        tileMap[rowIndex * tileCountPerRowOrColumn + 1],
        tileMap[rowIndex * tileCountPerRowOrColumn + 2],
        tileMap[rowIndex * tileCountPerRowOrColumn + 3],
      ];

      const nonEmptyTiles = tileIdsInRow.filter((id) => id !== 0);
      return nonEmptyTiles.reverse();
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInRowIndex: number,
      howManyMerges: number,
      maxIndexInRow: number
    ) => {
      return (
        tileIndex * tileCountPerRowOrColumn +
        maxIndexInRow +
        howManyMerges -
        tileInRowIndex
      );
    };

    return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
  };

  const moveUpFactory = () => {
    const retrieveTileIdsByColumn = (columnIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInColumn = [
        tileMap[columnIndex + tileCountPerRowOrColumn * 0],
        tileMap[columnIndex + tileCountPerRowOrColumn * 1],
        tileMap[columnIndex + tileCountPerRowOrColumn * 2],
        tileMap[columnIndex + tileCountPerRowOrColumn * 3],
      ];

      const nonEmptyTiles = tileIdsInColumn.filter((id) => id !== 0);
      return nonEmptyTiles;
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInColumnIndex: number,
      howManyMerges: number,
      _: number
    ) => {
      return (
        tileIndex +
        tileCountPerRowOrColumn * (tileInColumnIndex - howManyMerges)
      );
    };

    return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
  };

  const moveDownFactory = () => {
    const retrieveTileIdsByColumn = (columnIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInColumn = [
        tileMap[columnIndex + tileCountPerRowOrColumn * 0],
        tileMap[columnIndex + tileCountPerRowOrColumn * 1],
        tileMap[columnIndex + tileCountPerRowOrColumn * 2],
        tileMap[columnIndex + tileCountPerRowOrColumn * 3],
      ];

      const nonEmptyTiles = tileIdsInColumn.filter((id) => id !== 0);
      return nonEmptyTiles.reverse();
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInColumnIndex: number,
      howManyMerges: number,
      maxIndexInColumn: number
    ) => {
      return (
        tileIndex +
        tileCountPerRowOrColumn *
        (maxIndexInColumn - tileInColumnIndex + howManyMerges)
      );
    };

    return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
  };

  useEffect(() => {

    if (isInitialRender.current) {
      createTile({ position: [0, 1], value: 2 });
      createTile({ position: [0, 2], value: 2 });
      isInitialRender.current = false;
      return;
    }

    if (!inMotion && hasChanged) {
      generateRandomTile();
    }

    if(!inMotion && !hasChanged){
      byIds.forEach((id) => {
        if(tiles[id].value === 2048){
          setIsEndGame(true);
        }
      });
    }
  }, [hasChanged, inMotion, createTile, generateRandomTile]);

  const tileList = byIds.map((tileId) => tiles[tileId]);

  const moveLeft = moveLeftFactory();
  const moveRight = moveRightFactory();
  const moveUp = moveUpFactory();
  const moveDown = moveDownFactory();

  return [tileList, moveLeft, moveRight, moveUp, moveDown] as [
    TileMeta[],
    () => void,
    () => void,
    () => void,
    () => void
  ];

  
};
