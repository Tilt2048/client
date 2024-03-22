import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GameStateProvider } from "./components/GameStateContext.js"; // 여기에 GameStateContext를 import 합니다.
import HomeScreen from "./components/Home.js";
import GameScreen from "./components/GameScreen.js";
import Login from "./components/Login.js";
import Nickname from "./components/Nickname.js";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GameStateProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Nickname"
            component={Nickname}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameStateProvider>
  );
}
