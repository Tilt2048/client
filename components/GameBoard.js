import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const BOARD_SIZE = 400;
const TILE_MARGIN = 5;
const calculateTileSize = (boardLength) => {
  return (BOARD_SIZE - TILE_MARGIN * (boardLength + 2)) / boardLength;
};

export default function Tile({ cell, tileSize }) {
  const position = useRef(
    new Animated.ValueXY({ x: 90 * cell.positionX, y: 90 * cell.positionY }),
  ).current;
  const [scaleAndOpacity, setScaleAndOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(position, {
      toValue: {
        x: cell.positionX * 90,
        y: cell.positionY * 90,
      },
      duration: 60,
      useNativeDriver: true,
    }).start();
  }, [cell.positionX, cell.positionY]);

  useEffect(() => {
    setScaleAndOpacity(new Animated.Value(0.7));
  }, [cell.value]);

  useEffect(() => {
    Animated.timing(scaleAndOpacity, {
      toValue: 1,
      duration: 60,
      delay: 25,
      useNativeDriver: true,
    }).start();
  }, [scaleAndOpacity]);

  return (
    <Animated.View
      style={{
        ...styles.tileContainer,
        opacity: scaleAndOpacity,
        transform: [
          ...position.getTranslateTransform(),
          { scale: scaleAndOpacity },
        ],
      }}
    >
      <View style={{ ...styles.tileInner, ...styles[`tile${cell.value}`] }}>
        <Text
          style={{
            ...styles.text,
            ...styles[`${cell.value > 1000 ? "smallFont" : ""}`],
          }}
        >
          {cell.value}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tileContainer: {
    position: "absolute",
    width: 90,
    height: 90,
    borderColor: "rgba(0,0,0,0.0)",
    borderWidth: 4,
  },
  tileInner: {
    backgroundColor: "blue",
    borderRadius: 5,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
  },
  smallFont: {
    fontSize: 16,
  },
  tile2: { backgroundColor: "#EBDCD0" },
  tile4: { backgroundColor: "#E9DBBA" },
  tile8: { backgroundColor: "#E9A067" },
  tile16: { backgroundColor: "#F08151" },
  tile32: { backgroundColor: "#F2654F" },
  tile64: { backgroundColor: "#F1462C" },
  tile128: { backgroundColor: "#E7C65E" },
  tile256: { backgroundColor: "#E8C350" },
  tile512: { backgroundColor: "#E8BE40" },
  tile1024: { backgroundColor: "#E8BB31" },
  tile2048: { backgroundColor: "#E7B723" },
});
