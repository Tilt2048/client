import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";
import Tile from "./GameBoard.js";
import {
  createRandomTile,
  createGameBoard,
  isGameOver,
  moveTiles,
} from "../src/moveTiles.js";

const getTilesArr = (board) => {
  return [].concat(...board);
};

export default function GameScreen({ route, navigation }) {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const { nickname, tileSize } = route.params;
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
      const { newBoard } = moveTiles(board, direction);
      setBoard(newBoard);
      setDirection("");
    }
  }, [direction]);

  function startGame() {
    let newBoard = createGameBoard(4);
    newBoard = [...createRandomTile(newBoard)];
    setScore(0);
    setBoard(newBoard);
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
      <View style={styles.board}>
        {new Array(16).fill().map((cell, index) => (
          <View key={index} style={styles.cell}></View>
        ))}
        {getTilesArr(board).map((cell, index) =>
          cell ? <Tile key={cell.id} cell={cell} tileSize={tileSize} /> : null,
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeIcon: {
    fontSize: 20,
  },
  board: {
    position: "relative",
    height: 365,
    width: 365,
    backgroundColor: "#bbada0",
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "#bbada0",
  },
  cell: {
    width: 90,
    height: 90,
    backgroundColor: "#cdc1b4",
    borderColor: "#bbada0",
    borderWidth: 4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
