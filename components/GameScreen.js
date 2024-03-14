import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";
import GameBoard from "./GameBoard.js";
import { moveTiles } from "../src/moveTiles.js";

export default function GameScreen({ route, navigation }) {
  const [board, setBoard] = useState([]);
  const { nickname, boardSize } = route.params;
  const [direction, setDirection] = useState("");

  useEffect(() => {
    startGame();
    const TILT_THRESHOLD = 0.5;
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
      moveTiles(
        board,
        direction,
        boardSize,
        setBoard,
        setDirection,
        createNew2Tile,
      );
    }
  }, [direction]);

  function createGameBoard(size) {
    return new Array(size).fill(null).map(() => new Array(size).fill(0));
  }

  function startGame() {
    const initialBoard = createGameBoard(boardSize);

    setBoard(initialBoard);
    createNew2Tile(initialBoard);
  }

  function createNew2Tile(currentBoard) {
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
  }

  function handleGoHome() {
    navigation.navigate("Home");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={() => handleGoHome(1)}>
        <Text style={styles.homeIcon}>Home</Text>
      </TouchableOpacity>
      <Text style={styles.homeIcon}>{nickname}</Text>
      <Text>Score:</Text>
      <GameBoard board={board} />
    </View>
  );
}

const styles = StyleSheet.create({
  homeIcon: {
    fontSize: 20,
  },
});
