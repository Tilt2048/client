import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Accelerometer } from "expo-sensors";
import Tile from "./GameBoard.js";
import Login from "./Login.js";
import TiltAnimation from "./TiltAnimation.js";
import { moveTiles } from "../src/moveTiles.js";

const BOARD_SIZE = 400;
const TILE_MARGIN = 5;
const calculateTileSize = (boardLength) => {
  return (BOARD_SIZE - TILE_MARGIN * boardLength * 2) / boardLength;
};

export default function HomeScreen({ navigation }) {
  const [board, setBoard] = useState([]);
  const [boardSize, setBoardSize] = useState(4);
  const [direction, setDirection] = useState("");
  const homeBoard = true;
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [zeroPoint, setZeroPoint] = useState({ x: 0, y: 0, z: 0 });
  const [adjustedData, setAdjustedData] = useState({ x: 0, y: 0, z: 0 });
  const [tiltSetting, setTiltSetting] = useState(false);
  const [isTiltModalVisible, setIsTiltModalVisible] = useState(false);
  const [isStartModalVisible, setIsStartModalVisible] = useState(true);
  const [isTilted, setIsTilted] = useState(false);

  const getTilesArr = (board) => {
    return [].concat(...board);
  };

  useEffect(() => {
    startGame();
    const subscription = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);

      if (
        Math.abs(accelerometerData.x) > 0.4 ||
        Math.abs(accelerometerData.y) > 0.4
      ) {
        setIsTilted(true);
      }
    });
    Accelerometer.setUpdateInterval(600);

    return () => subscription.remove();
  }, [boardSize]);

  useEffect(() => {
    const TILT_THRESHOLD = 0.25;

    setAdjustedData({
      x: data.x - zeroPoint.x,
      y: data.y - zeroPoint.y,
    });

    if (
      Math.abs(adjustedData.x) < TILT_THRESHOLD &&
      Math.abs(adjustedData.y) < TILT_THRESHOLD
    ) {
      return;
    }

    const newDirection =
      Math.abs(adjustedData.x) > Math.abs(adjustedData.y)
        ? adjustedData.x > 0
          ? "right"
          : "left"
        : adjustedData.y > 0
          ? "up"
          : "down";

    setDirection(newDirection);
  }, [data, zeroPoint]);

  const setAsZeroPoint = () => {
    setZeroPoint(data);
  };

  useEffect(() => {
    if (Math.abs(data.x) > 0.2 || Math.abs(data.y) > 0.2) {
      setIsStartModalVisible(false);
    }
  }, [data]);

  useEffect(() => {
    if (direction) {
      const { newBoard } = moveTiles(board, direction, homeBoard);
      setBoard(newBoard);
      setDirection("");
    }
  }, [direction]);

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
        [
          { id: 1710919311204, positionX: 0, positionY: 0, value: 16 },
          { id: 1710919911205, positionX: 1, positionY: 0, value: 32 },
          { id: 1710919911206, positionX: 2, positionY: 0, value: 64 },
          { id: 1710919911207, positionX: 3, positionY: 0, value: 128 },
        ],
        [
          { id: 1710919911208, positionX: 0, positionY: 1, value: 8 },
          undefined,
          undefined,
          { id: 1710919911209, positionX: 3, positionY: 1, value: 256 },
        ],
        [
          { id: 1710919911200, positionX: 0, positionY: 2, value: 4 },
          undefined,
          undefined,
          { id: 1710919911201, positionX: 3, positionY: 2, value: 512 },
        ],
        [
          { id: 1710919911202, positionX: 0, positionY: 3, value: 2 },
          undefined,
          { id: 1710919911203, positionX: 2, positionY: 3, value: 2048 },
          { id: 1710919911277, positionX: 3, positionY: 3, value: 1024 },
        ],
      ]);
    } else if (boardSize === 5) {
      setBoard([
        [
          { id: 1710919911200, positionX: 0, positionY: 0, value: 32 },
          { id: 1710919911201, positionX: 1, positionY: 0, value: 64 },
          { id: 1710919911202, positionX: 2, positionY: 0, value: 128 },
          { id: 1710919911203, positionX: 3, positionY: 0, value: 256 },
          { id: 1710919911204, positionX: 4, positionY: 0, value: 512 },
        ],
        [
          { id: 1710919911205, positionX: 0, positionY: 1, value: 16 },
          undefined,
          undefined,
          undefined,
          { id: 1710919911206, positionX: 4, positionY: 1, value: 1024 },
        ],
        [
          { id: 1710919911207, positionX: 0, positionY: 2, value: 8 },
          undefined,
          undefined,
          undefined,
          { id: 1710919911208, positionX: 4, positionY: 2, value: 2048 },
        ],
        [
          { id: 1710919911209, positionX: 0, positionY: 3, value: 4 },
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [
          { id: 1710919911210, positionX: 0, positionY: 4, value: 2 },
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      ]);
    } else if (boardSize === 3) {
      setBoard([
        [
          { id: 1710919911202, positionX: 0, positionY: 0, value: 8 },
          { id: 1710919911203, positionX: 1, positionY: 0, value: 16 },
          { id: 1710919911204, positionX: 2, positionY: 0, value: 32 },
        ],
        [
          { id: 1710919911205, positionX: 0, positionY: 1, value: 4 },
          undefined,
          { id: 1710919911206, positionX: 2, positionY: 0, value: 64 },
        ],
        [
          { id: 1710919911207, positionX: 0, positionY: 2, value: 2 },
          undefined,
          undefined,
        ],
      ]);
    }
  }

  function handleGameStartOnPress() {
    navigation.navigate("Game", { boardSize: boardSize, isGameStarted: true });
  }

  const handleSetStandardSlope = () => {
    setIsTiltModalVisible(!isTiltModalVisible);
    setTiltSetting(!tiltSetting);
  };

  const setStandardSlopeDone = () => {
    setAsZeroPoint();
    setIsTiltModalVisible(false);
    setTiltSetting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>Tilt & Tilt</Text>
      <Text style={styles.title2}>2048</Text>
      <View style={styles.board}>
        {new Array(boardSize * boardSize).fill().map((cell, index) => (
          <View key={index} style={styles.cell}></View>
        ))}
        {getTilesArr(board).map((cell, index) =>
          cell ? <Tile key={cell.id} cell={cell} /> : null,
        )}
      </View>
      {!isTilted && (
        <View style={styles.tiltPrompt}>
          <Text style={styles.tiltMessage}>기울여 보세요!</Text>
          <TiltAnimation />
        </View>
      )}
      {/* <View style={styles.boardSizeSelector}>
        <TouchableOpacity onPress={() => changeBoardSize(-1)}>
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.boardSizeText}>
          {boardSize} x {boardSize}
        </Text>
        <TouchableOpacity onPress={() => changeBoardSize(1)}>
          <Text style={styles.arrowText}>&gt;</Text>
        </TouchableOpacity>
      </View> */}
      <Login boardSize={boardSize} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleGameStartOnPress()}
      >
        <Text style={styles.buttonText}>게스트로 시작</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSetStandardSlope}>
        <Text style={styles.buttonText}>기울기 설정</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isTiltModalVisible}
        onRequestClose={handleSetStandardSlope}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>X: {adjustedData.x.toFixed(2)}</Text>
          <Text style={styles.modalText}>Y: {adjustedData.y.toFixed(2)}</Text>
          <TouchableOpacity onPress={setStandardSlopeDone}>
            <Text style={styles.settingDone}>세팅 완료</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  },
  title2: {
    fontSize: 50,
    fontWeight: "bold",
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
  tiltPrompt: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 300,
  },
  tiltMessage: {
    fontSize: 30,
    fontWeight: "bold",
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
  settingDone: {
    fontSize: 30,
  },
});
