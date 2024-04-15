import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import Login from "../components/Login.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock("./GameStateContext", () => ({
  useGameState: () => ({
    updateGameState: jest.fn(),
    gameState: {},
  }),
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: () => [{}, null, jest.fn()],
}));

describe("Login Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Login boardSize={4} />);
    expect(getByText("로그인")).toBeTruthy();
  });

  it("calls promptAsync on button press when not logged in", () => {
    const promptAsyncMock = jest.fn();
    jest.mock("expo-auth-session/providers/google", () => ({
      useAuthRequest: () => [{}, null, promptAsyncMock],
    }));

    const { getByText } = render(<Login boardSize={4} />);
    const loginButton = getByText("로그인");
    fireEvent.press(loginButton);

    expect(promptAsyncMock).toHaveBeenCalled();
  });
});
