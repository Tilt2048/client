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
      duration: 80,
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
    borderRadius: 5,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
  },
  smallFont: {
    fontSize: 24,
  },
  tile2: { backgroundColor: "#FAF8EF" },
  tile4: { backgroundColor: "#FFE7CF" },
  tile8: { backgroundColor: "#FFC3A0" },
  tile16: { backgroundColor: "#F29563" },
  tile32: { backgroundColor: "#FF775C" },
  tile64: { backgroundColor: "#E64C2E" },
  tile128: { backgroundColor: "#EDE291" },
  tile256: { backgroundColor: "#F1C947" },
  tile512: { backgroundColor: "#FAB042" },
  tile1024: { backgroundColor: "#F99827" },
  tile2048: { backgroundColor: "#FF7A00" },
});
