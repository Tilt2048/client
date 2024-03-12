import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Accelerometer } from "expo-sensors";
import GameBoard from "../components/GameBoard.js";

export default function GameScreen() {
  const [board, setBoard] = useState([]);
  const [direction, setDirection] = useState("");
  const BOARD_ROW = 5;

  useEffect(() => {
    const TILT_THRESHOLD = 0.5;
    startGame();

    Accelerometer.setUpdateInterval(1000);

    const subscription = Accelerometer.addListener(({ x, y }) => {
      if (Math.abs(x) < TILT_THRESHOLD && Math.abs(y) < TILT_THRESHOLD) {
        return;
      }

      const newDirection =
        Math.abs(x) > Math.abs(y)
          ? x > 0
            ? "right"
            : "left"
          : y > 0
            ? "up"
            : "down";
      setDirection(newDirection);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (direction) {
      moveTiles(direction);
    }
  }, [direction]);

  const createGameBoard = (size) => {
    return new Array(size).fill(null).map(() => new Array(size).fill(0));
  };

  function createNewData(row) {
    return new Array(row).fill(null).map(() => new Array());
  }

  const startGame = () => {
    const initialBoard = createGameBoard(5);
    setBoard(initialBoard);
    createNew2Tile(initialBoard);
  };

  const createNew2Tile = (currentBoard) => {
    const emptyCells = [];
    currentBoard.forEach((row, rowIndex) =>
      row.forEach((cell, cellIndex) => {
        if (cell === 0) emptyCells.push({ rowIndex, cellIndex });
      }),
    );

    if (emptyCells.length) {
      const randomCellIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, cellIndex } = emptyCells[randomCellIndex];
      const newBoard = [...currentBoard];
      newBoard[rowIndex][cellIndex] = 2;
      setBoard(newBoard);
    }
    console.log([...currentBoard]);
  };

  function moveTiles(direction) {
    let tiles = JSON.parse(JSON.stringify(board));
    switch (direction) {
      case "left": {
        const newData = createNewData(BOARD_ROW);
        console.log(newData);
        board.forEach((rowData, i) => {
          rowData.forEach((cellData, j) => {
            if (cellData) {
              const currentRow = newData[i];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === cellData) {
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[i].push(cellData);
              }
            }
          });
        });
        [...board].forEach((rowData, i) => {
          [...board].forEach((cellData, j) => {
            tiles[i][j] = Math.abs(newData[i][j]) || 0;
          });
        });
        break;
      }

      case "right": {
        const newData = createNewData(BOARD_ROW);
        board.forEach((rowData, i) => {
          rowData.forEach((cellData, j) => {
            if (rowData[board.length - 1 - j]) {
              const currentRow = newData[i];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === rowData[board.length - 1 - j]) {
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[i].push(rowData[board.length - 1 - j]);
              }
            }
          });
        });
        [...board].forEach((rowData, i) => {
          [...board].forEach((cellData, j) => {
            tiles[i][board.length - 1 - j] = Math.abs(newData[i][j]) || 0;
          });
        });
        break;
      }

      case "up": {
        const newData = createNewData(BOARD_ROW);
        board.forEach((rowData, i) => {
          rowData.forEach((cellData, j) => {
            if (cellData) {
              const currentRow = newData[j];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === cellData) {
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[j].push(cellData);
              }
            }
          });
        });
        [...board].forEach((cellData, i) => {
          [...board].forEach((rowData, j) => {
            tiles[j][i] = Math.abs(newData[i][j]) || 0;
          });
        });
        break;
      }

      case "down": {
        const newData = createNewData(BOARD_ROW);
        board.forEach((rowData, i) => {
          rowData.forEach((cellData, j) => {
            if (board[board.length - 1 - i][j]) {
              const currentRow = newData[j];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === board[board.length - 1 - i][j]) {
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[j].push(board[board.length - 1 - i][j]);
              }
            }
          });
        });
        [...board].forEach((cellData, i) => {
          [...board].forEach((rowData, j) => {
            tiles[board.length - 1 - j][i] = Math.abs(newData[i][j]) || 0;
          });
        });
        break;
      }
    }
    setBoard(tiles);
    createNew2Tile(tiles);
    setDirection("");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Score:</Text>
      <GameBoard board={board} />
    </View>
  );
}
