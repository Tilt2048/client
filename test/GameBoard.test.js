import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import Tile from "./Tile";

describe("Tile 컴포넌트 테스트", () => {
  it("Tile 컴포넌트가 올바르게 렌더링 되는지 확인", () => {
    const cell = {
      positionX: 0,
      positionY: 0,
      value: 2,
    };
    const tileSize = 90;

    const { getByText } = render(<Tile cell={cell} tileSize={tileSize} />);

    expect(getByText("2")).toBeTruthy();
  });
});
