import React, { createContext, useContext, useState, useEffect } from "react";
import { AppState } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    userId: "",
    nickname: "",
    board: [],
    score: 0,
  });

  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          await loadGameState();
        } else if (nextAppState === "background") {
          await saveGameState();
        }
        setAppState(nextAppState);
      },
    );

    return () => subscription.remove();
  }, [appState]);

  const loadGameState = async () => {
    const userId = await AsyncStorage.getItem("@userId");
    let key = userId ? `@gameState_${userId}` : "@guestGameState";
    try {
      const storedGameState = await AsyncStorage.getItem(key);
      if (storedGameState) {
        setGameState(JSON.parse(storedGameState));
      }
    } catch (error) {
      console.error("Error loading game state:", error);
    }
  };

  const saveGameState = async () => {
    const { userId, board, score } = gameState;
    let key = userId ? `@gameState_${userId}` : "@guestGameState";
    try {
      await AsyncStorage.setItem(key, JSON.stringify({ userId, board, score }));
      if (userId) {
        await axios.post("http://192.168.0.45:8000/api/gameState", {
          userId,
          board,
          score,
        });
      }
    } catch (error) {
      console.error("Error saving game state:", error);
    }
  };

  const updateGameState = (newState) => {
    setGameState((prev) => ({ ...prev, ...newState }));
  };

  return (
    <GameStateContext.Provider
      value={{ gameState, updateGameState, saveGameState }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
