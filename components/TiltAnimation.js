import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function TiltAnimation() {
  const tiltXAnimation = useRef(new Animated.Value(0)).current;
  const tiltYAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const tiltX = Animated.sequence([
      Animated.timing(tiltXAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(tiltXAnimation, {
        toValue: -1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(tiltXAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]);

    const tiltY = Animated.sequence([
      Animated.timing(tiltYAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(tiltYAnimation, {
        toValue: -1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(tiltYAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]);

    Animated.loop(Animated.sequence([tiltX, tiltY])).start();
  }, [tiltXAnimation, tiltYAnimation]);

  const rotationX = tiltXAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-30deg", "30deg"],
  });
  const rotationY = tiltYAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-30deg", "30deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ rotateX: rotationX }, { rotateY: rotationY }],
        }}
      >
        <Icon name="mobile" size={100} color="#000" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
