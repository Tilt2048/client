import React, { createContext, useContext, useState, useEffect } from "react";
import { AppState } from "react-native";
import axios from "axios";

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
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
      } else if (nextAppState === "background") {
        saveGameStateToDB();
      }

      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const saveGameStateToDB = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.45:8000/api/gameState",
        gameState,
      );
    } catch (error) {
      console.error("Error saving game state:", error);
    }
  };

  const updateGameState = (newState) => {
    setGameState((prev) => ({ ...prev, ...newState }));
  };

  return (
    <GameStateContext.Provider
      value={{ gameState, updateGameState, saveGameStateToDB }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
