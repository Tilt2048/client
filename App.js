import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Accelerometer } from "expo-sensors";
import GameBoard from "./src/GameBoard";
import { moveTiles } from "./src/moveTiles";

export default function App() {
  const [board, setBoard] = useState([]);
  const [boardSize, setBoardSize] = useState(4);
  const [direction, setDirection] = useState("");

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
  }, [boardSize]);

  useEffect(() => {
    if (direction) {
      moveTiles(board, direction, boardSize, setBoard, setDirection);
    }
  }, [direction]);

  function createGameBoard(size) {
    return new Array(size).fill(null).map(() => new Array(size).fill(0));
  }

  function changeBoardSize(change) {
    setBoardSize((currentSize) => {
      let newSize = currentSize + change;
      newSize = Math.max(3, Math.min(5, newSize));
      return newSize;
    });
  }

  function startGame() {
    if (boardSize === 4) {
      setBoard([
        [16, 32, 64, 128],
        [8, 0, 0, 256],
        [4, 0, 0, 512],
        [2, 0, 2048, 1024],
      ]);
    } else if (boardSize === 5) {
      setBoard([
        [32, 64, 128, 256, 512],
        [16, 0, 0, 0, 1024],
        [8, 0, 0, 0, 2048],
        [4, 0, 0, 0, 0],
        [2, 0, 0, 0, 0],
      ]);
    } else if (boardSize === 3) {
      setBoard([
        [8, 16, 32],
        [4, 0, 64],
        [2, 0, 0],
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>Shake & Tilt</Text>
      <Text style={styles.title2}>2048</Text>
      <GameBoard board={board} />
      <View style={styles.boardSizeSelector}>
        <TouchableOpacity onPress={() => changeBoardSize(-1)}>
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.boardSizeText}>
          {boardSize} x {boardSize}
        </Text>
        <TouchableOpacity onPress={() => changeBoardSize(1)}>
          <Text style={styles.arrowText}>&gt;</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>게스트로 시작</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  title1: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: -40,
  },
  title2: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 40,
  },
  boardSizeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  arrowText: {
    fontSize: 40,
    marginHorizontal: 20,
  },
  boardSizeText: {
    marginHorizontal: 10,
    fontSize: 40,
  },
  button: {
    backgroundColor: "#f2b179",
    width: 270,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 15,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 40,
  },
});
