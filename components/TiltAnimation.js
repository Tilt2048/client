import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function TiltAnimation() {
  // X축과 Y축을 위한 애니메이션 값 생성
  const tiltXAnimation = useRef(new Animated.Value(0)).current;
  const tiltYAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // X축 기울기 애니메이션
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

    // Y축 기울기 애니메이션
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

    // 무한 반복 애니메이션
    Animated.loop(
      Animated.sequence([
        tiltX, // 먼저 X축 기울기
        tiltY, // 다음 Y축 기울기
      ]),
    ).start();
  }, [tiltXAnimation, tiltYAnimation]);

  // 로테이션 값 계산
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
          transform: [
            { rotateX: rotationX }, // X축 기울기 적용
            { rotateY: rotationY }, // Y축 기울기 적용
          ],
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
