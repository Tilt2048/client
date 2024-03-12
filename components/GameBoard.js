import { useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const BOARD_SIZE = 400;
const TILE_MARGIN = 5;
const calculateTileSize = (boardLength) => {
  return (BOARD_SIZE - TILE_MARGIN * (boardLength + 2)) / boardLength;
};

const Tile = ({ value, size }) => {
  const tileAnim = new Animated.ValueXY();
  const backgroundColor = getTileBackgroundColor(value);
  const tileStyle = {
    width: size,
    height: size,
    backgroundColor,
    margin: TILE_MARGIN / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    transform: tileAnim.getTranslateTransform(),
  };

  useEffect(() => {
    Animated.spring(tileAnim, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <Animated.View style={tileStyle}>
      <Text style={styles.cellText}>{value !== 0 ? value : ""}</Text>
    </Animated.View>
  );
};

function getTileBackgroundColor(value) {
  switch (value) {
    case 2:
      return "#FAF8EF";
    case 4:
      return "#FFE7CF";
    case 8:
      return "#FFC3A0";
    case 16:
      return "#F29563";
    case 32:
      return "#FF775C";
    case 64:
      return "#E64C2E";
    case 128:
      return "#EDE291";
    case 256:
      return "#F1C947";
    case 512:
      return "#FAB042";
    case 1024:
      return "#F99827";
    case 2048:
      return "#FF7A00";
    default:
      return "#cdc1b4";
  }
}

const GameBoard = ({ board }) => {
  const tileSize = calculateTileSize(board.length);

  return (
    <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <Tile key={cellIndex} value={cell} size={tileSize} />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    padding: TILE_MARGIN,
    backgroundColor: "#bbada0",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  cellText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default GameBoard;
