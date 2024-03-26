import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useGameState } from "./GameStateContext";

WebBrowser.maybeCompleteAuthSession();

export default function Login({ boardSize }) {
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const { updateGameState, gameState } = useGameState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "",
    iosClientId:
      "432674420028-ivc44isbiv4so3ooc5fffg5t8kn478lr.apps.googleusercontent.com",
    webClientId:
      "432674420028-u1ltrhiqt69jbmodieehnapfhltoqs7r.apps.googleusercontent.com",
  });

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    if (!user) {
      if (response?.type === "success") {
        // setToken(response.authentication.accessToken);
        getUserInfo(response.authentication.accessToken);
        navigation.navigate("Nickname", { boardSize: boardSize });
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  async function getLocalUser() {
    const data = await AsyncStorage.getItem("@userLoginInfo");

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  async function getUserInfo(token) {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const user = await response.json();
      await AsyncStorage.setItem("@userLoginInfo", JSON.stringify(user));
      setUserInfo(user);
      updateGameState({ userId: user.id });
      setIsLogin(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View>
      <TouchableOpacity
        disabled={!request}
        style={styles.button}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>{isLogin ? "로그아웃" : "로그인"}</Text>
      </TouchableOpacity>
      <Button
        title="remove local store"
        onPress={async () => {
          await AsyncStorage.removeItem("@userLoginInfo");
          await AsyncStorage.removeItem("@guestGameState");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
});
