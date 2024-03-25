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
import { PanGestureHandler, State } from "react-native-gesture-handler";

import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Tile from "./GameBoard.js";
import {
  createRandomTile,
  createGameBoard,
  isGameOver,
  moveTiles,
} from "../src/moveTiles.js";
import { useGameState } from "./GameStateContext";

const getTilesArr = (board) => {
  return [].concat(...board);
};

export default function GameScreen({ route, navigation }) {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const { nickname, tileSize } = route.params;
  const [direction, setDirection] = useState("");
  const [prevBoards, setPrevBoards] = useState([null]);
  const [newScore, setNewScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { updateGameState } = useGameState();
  const [inputMode, setInputMode] = useState("swipe");

  useEffect(() => {
    startGame();
    const TILT_THRESHOLD = 0.5;
    Accelerometer.setUpdateInterval(800);

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

  const onSwipe = (event) => {
    if (
      event.nativeEvent.state !== State.ACTIVE ||
      isPaused ||
      inputMode !== "swipe"
    )
      return;

    const { velocityX, velocityY } = event.nativeEvent;
    let detectedDirection = "";

    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      detectedDirection = velocityX > 0 ? "right" : "left";
    } else {
      detectedDirection = velocityY > 0 ? "down" : "up";
    }

    setDirection(detectedDirection);
  };

  useEffect(() => {
    if (!isPaused && direction) {
      const { newBoard, newScore, preBoard } = moveTiles(board, direction);
      if (JSON.stringify(preBoard) !== JSON.stringify(newBoard)) {
        setPrevBoards([...prevBoards, preBoard]);
        setBoard(newBoard);
        setScore(score + newScore);
        updateGameState({ board: newBoard, score: score + newScore });
        setDirection("");
      }
    }
  }, [direction]);

  const undoMove = () => {
    if (prevBoards.length > 0) {
      const lastBoard = prevBoards.pop();
      setBoard(lastBoard);
      setPrevBoards([...prevBoards]);
    }
  };

  function startGame() {
    let newBoard = createGameBoard(4);
    newBoard = [...createRandomTile(newBoard)];
    setScore(0);
    setBoard(newBoard);
    setPrevBoards([]);
  }

  function handleGoHome() {
    navigation.push("Home");
  }

  const togglePause = () => {
    setIsModalVisible(!isModalVisible);
    setIsPaused(!isPaused);
  };
  const resumeGame = () => {
    setIsModalVisible(false);
    setIsPaused(false);
  };

  const resetGame = () => {
    startGame();
  };

  return (
    <PanGestureHandler onGestureEvent={onSwipe}>
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
          <Text style={styles.nickname}>{nickname}</Text>
        </TouchableOpacity>
        <Text style={styles.twoZeroFourEight}>2048</Text>
        <Text style={styles.score}>{`Score: ${score}`}</Text>
        <View style={styles.board}>
          {new Array(16).fill().map((cell, index) => (
            <View key={index} style={styles.cell}></View>
          ))}
          {getTilesArr(board).map((cell, index) =>
            cell ? (
              <Tile key={cell.id} cell={cell} tileSize={tileSize} />
            ) : null,
          )}
        </View>
        <TouchableOpacity onPress={undoMove}>
          <Text>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetGame}>
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  homeIcon: {
    fontSize: 50,
    position: "absolute",
    top: -150,
    left: -170,
    zIndex: 10,
  },
  pause: {
    fontSize: 50,
    position: "absolute",
    top: -150,
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
    fontSize: 60,
    fontWeight: "bold",
    top: -120,
  },
  nickname: {
    fontSize: 30,
    top: -40,
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
