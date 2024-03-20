import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const BOARD_SIZE = 400;
const TILE_MARGIN = 5;
const calculateTileSize = (boardLength) => {
  return (BOARD_SIZE - TILE_MARGIN * (boardLength + 2)) / boardLength;
};

const Tile = ({ value, size, moveInfo }) => {
  const initialPos = moveInfo && moveInfo.from ? moveInfo.from : { x: 0, y: 0 };
  const finalPos = moveInfo && moveInfo.to ? moveInfo.to : { x: 0, y: 0 };
  const backgroundColor = getTileBackgroundColor(value);
  let tileAnim = useRef(new Animated.ValueXY(initialPos)).current;

  useEffect(() => {
    // Animated.spring을 이용하여 타일을 최종 위치로 부드럽게 이동시킵니다.
    if (value !== 0 && moveInfo) {
      tileAnim = useRef(new Animated.ValueXY(moveInfo.from)).current;
      Animated.spring(tileAnim, {
        toValue: moveInfo.to,
        useNativeDriver: true,
      }).start();
    }
  }, [moveInfo, value]);

  const tileStyle = {
    width: size,
    height: size,
    backgroundColor,
    // position: "absolute",
    margin: TILE_MARGIN / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5, // 기존 타일 스타일
    transform: tileAnim.getTranslateTransform(),
  };

  return (
    <Animated.View style={tileStyle}>
      <Text style={styles.cellText}>{value !== 0 ? value : ""}</Text>
    </Animated.View>
  );
};

const InitialTile = ({ size }) => {
  const tileStyle = {
    width: size,
    height: size,
    backgroundColor: "#cdc1b4",
    // position: "absolute",
    margin: TILE_MARGIN / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5, // 기존 타일 스타일
  };

  return <View style={tileStyle}></View>;
};
// 기본 타일들을 다깔아두고 위에 새로 움직이느 타일들을 겹쳐두는 방식. 값이 없는 놈들은 투명하게 만들기. getTileBackgroundColor함수에서 case1 보고 추후 수정
// 먼가 움직이기는하는데 뭐가 움직이는 트리거인지 모름 찾아야함

function getTileBackgroundColor(value) {
  switch (value) {
    case 1:
      return "#cdc1b4";
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
      return;
  }
}

const GameBoard = ({ board, moveInfo, initialTiles = [], startBoard }) => {
  const tileSize = calculateTileSize(board.length);

  // if (!initialTiles) {
  //   console.log("initialTiles is undefined");
  //   return null; // 또는 적절한 대체 UI 렌더링
  // }

  return (
    <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
      <View>
        {initialTiles.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <InitialTile key={cellIndex} value={cell} size={tileSize} />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.tiles}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <Tile
                key={cellIndex}
                value={cell}
                size={tileSize}
                moveInfo={
                  moveInfo ? moveInfo[`${rowIndex}-${cellIndex}`] : undefined
                }
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    padding: TILE_MARGIN,
    backgroundColor: "#bbada0",
    borderRadius: 5,
  },
  tiles: {
    position: "absolute",
    top: 5,
    left: 5,
    // margin: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    // position: "absolute",
    top: 0,
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
