import React, { createContext, useContext, useState } from "react";

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    userId: "",
    nickname: "",
    board: [],
    score: 0,
  });

  const saveGameStateToDB = async () => {
    // 여기에 DB에 저장하는 로직을 구현합니다.
    // 예: axios.post('/api/save', gameState);
  };

  // 게임 상태 업데이트 함수
  const updateGameState = (newState) => {
    setGameState((prev) => ({ ...prev, ...newState }));
  };

  console.log(gameState);

  return (
    <GameStateContext.Provider
      value={{ gameState, updateGameState, saveGameStateToDB }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
