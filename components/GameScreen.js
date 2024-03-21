import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Modal,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
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
  const [prevBoard, setPrevBoard] = useState([null]);
  const [newScore, setNewScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    startGame();
    const TILT_THRESHOLD = 0.5;
    Accelerometer.setUpdateInterval(600);

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
      if (isPaused) return;
      setDirection(newDirection);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isPaused && direction) {
      if (!prevBoard) {
        setPrevBoard([...board]);
      }
      const { newBoard, newScore } = moveTiles(board, direction);
      setScore((prevScore) => prevScore + newScore);
      setBoard(newBoard);
      setDirection("");
    }
  }, [direction]);

  function startGame() {
    let newBoard = createGameBoard(4);
    newBoard = [...createRandomTile(newBoard)];
    setScore(0);
    setBoard(newBoard);
    setPrevBoard([]);
  }

  function handleGoHome() {
    navigation.navigate("Home");
  }

  const togglePause = () => {
    setIsModalVisible(!isModalVisible);
    setIsPaused(!isPaused);
  };
  const resumeGame = () => {
    setIsModalVisible(false);
    setIsPaused(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={() => handleGoHome(1)}>
        <FontAwesome name="home" color="black" style={styles.homeIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={togglePause}>
        <FontAwesome6 name="pause" color="black" style={styles.pause} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={togglePause}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Game Paused</Text>
          <TouchableOpacity title="Resume" onPress={resumeGame}>
            <Text style={styles.resume}>Resume</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity>
        <Text style={styles.homeIcon}>{nickname}</Text>
      </TouchableOpacity>
      <Text style={styles.twoZeroFourEight}>2048</Text>
      <Text style={styles.score}>{`Score: ${score}`}</Text>
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
    fontSize: 50,
    position: "absolute",
    top: -180,
    left: -170,
    zIndex: 10,
  },
  pause: {
    fontSize: 50,
    position: "absolute",
    top: -180,
    left: 130,
    zIndex: 10,
  },
  modalView: {
    marginTop: 400,
    backgroundColor: "#FFC3A0",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  modalText: {
    marginBottom: 40,
    textAlign: "center",
    fontSize: 40,
    color: "white",
  },
  resume: {
    fontSize: 30,
  },
  twoZeroFourEight: {
    fontSize: 40,
  },
  score: {
    fontSize: 40,
  },
  board: {
    position: "relative",
    height: 365,
    width: 365,
    backgroundColor: "#bbada0",
    flexWrap: "wrap",
    borderWidth: 2,
    borderRadius: 5,
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
