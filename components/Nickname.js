import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useGameState } from "./GameStateContext";

export default function Nickname({ route, navigation }) {
  const [nickname, setNickname] = useState("");
  const { boardSize } = route.params;
  const { updateGameState } = useGameState();

  const handleSaveNickname = () => {
    updateGameState({ nickname: nickname });
    navigation.navigate("Game", { nickname: nickname, boardSize: boardSize });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>닉네임 설정</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임을 입력하세요"
        value={nickname}
        onChangeText={setNickname}
      />
      <Button title="저장" onPress={handleSaveNickname} />
      {nickname ? (
        <Text style={styles.nickname}>저장된 닉네임: {nickname}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  nickname: {
    marginTop: 20,
    fontSize: 18,
  },
});
