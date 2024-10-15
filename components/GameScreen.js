import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PanGestureHandler, State } from "react-native-gesture-handler";

import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Tile from "./GameBoard.js";
import {
  createRandomTile,
  createGameBoard,
  isGameOver,
  hasWon,
  moveTiles,
} from "../src/moveTiles.js";
import { useGameState } from "./GameStateContext";

const getTilesArr = (board) => {
  return [].concat(...board);
};

export default function GameScreen({ route, navigation }) {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const { tileSize } = route.params;
  const [direction, setDirection] = useState("");
  const [prevBoards, setPrevBoards] = useState([null]);
  const [nickname, setNickname] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { updateGameState, gameState } = useGameState();
  const [inputMode, setInputMode] = useState("swipe");
  const [haveUser, setHaveUser] = useState(false);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    if (route.params.isGameStarted) {
      console.log(route.params.isGameStarted + "a");
      setIsGameStarted(true);
    }
  }, [route.params.isGameStarted]);

  useEffect(() => {
    const TILT_THRESHOLD = 0.5;
    Accelerometer.setUpdateInterval(600);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
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
    const fetchGameState = async () => {
      const userId = await AsyncStorage.getItem("@userLoginInfo");
      if (userId) {
        try {
          const response = await axios.get(
            `http://192.168.45.150:8000/api/gameState/${userId.id}`,
          );
          if (response.data) {
            const { board, score } = response.data;
            setBoard(board);
            setScore(score);
            setNickname(gameState.nickname);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log(
              "No game state found on the server for the user, starting a new game.",
            );
            setNickname(gameState.nickname);
            startGame();
          } else {
            console.error("Failed to fetch game state:", error);
          }
        }
      } else {
        const guestGameState = await AsyncStorage.getItem("@guestGameState");

        if (JSON.parse(guestGameState).board.length) {
          const { board, score } = JSON.parse(guestGameState);
          setBoard(board);
          setScore(score);
        } else {
          startGame();
        }
      }
    };

    fetchGameState();
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
    if (!isPaused && direction && isGameStarted) {
      const { newBoard, newScore, preBoard } = moveTiles(board, direction);
      const flattenTiles = newBoard.flat();
      if (!isWon) {
        flattenTiles.forEach((tile) => {
          if (tile?.value === 2048) {
            setIsWon(true);
            Alert.alert(
              "성공!!!",
              "계속해서 플레이 하시겠습니까, 아니면 새 게임을 시작하시겠습니까?",
              [
                {
                  text: "계속하기",
                  onPress: () => console.log("게임 계속"),
                },
                {
                  text: "새 게임",
                  onPress: () => resetGame(),
                },
              ],
              { cancelable: false },
            );
          }
        });
      }

      if (JSON.stringify(preBoard) !== JSON.stringify(newBoard)) {
        setPrevBoards([...prevBoards, preBoard]);
        setBoard(newBoard);
        setScore(score + newScore);
        updateGameState({ board: newBoard, score: score + newScore });
        setDirection("");
      }
    }
  }, [direction, isWon]);

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
    // newBoard[0][0] = {
    //   id: Date.now(),
    //   positionX: 0,
    //   positionY: 0,
    //   value: 1024,
    // };
    // newBoard[0][1] = {
    //   id: Date.now() + 1,
    //   positionX: 1,
    //   positionY: 0,
    //   value: 1024,
    // };
    setScore(0);
    setBoard(newBoard);
    setPrevBoards([]);
  }

  function handleGoHome() {
    setIsGameStarted(false);
    console.log("Game stopped, going to Home");
    route.params.isGameStarted = false;
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
    <PanGestureHandler>
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
        {/* <TouchableOpacity onPress={undoMove}>
          <Text>Undo</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={resetGame}>
          <Text style={styles.reset}>Reset</Text>
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
    top: 70,
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
  reset: {
    fontSize: 20,
    top: 20,
  },
});
