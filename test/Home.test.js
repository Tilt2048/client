import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { act } from "@testing-library/react-native";
import HomeScreen from "../components/Home.js";
import { NavigationContainer } from "@react-navigation/native";

describe("<HomeScreen />", () => {
  it("renders correctly", async () => {
    await act(async () => {
      const { getByText } = render(
        <NavigationContainer>
          <HomeScreen />
        </NavigationContainer>,
      );

      expect(getByText("Tilt & Tilt")).toBeTruthy();
      expect(getByText("2048")).toBeTruthy();
      expect(getByText("게스트로 시작")).toBeTruthy();

      const setStandardSlopeButton = getByText("기울기 설정");
      fireEvent.press(setStandardSlopeButton);
      expect(getByText("세팅 완료")).toBeTruthy();

      const settingDoneButton = getByText("세팅 완료");
      fireEvent.press(settingDoneButton);
    });
  });
});
