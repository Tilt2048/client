import React from "react";
import { render } from "@testing-library/react-native";
import GameBoard from "../components/GameScreenBoard";

describe("GameBoard", () => {
  const board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, 2048, 4096],
    [8192, 16384, 32768, 65536],
  ];
  const initialTiles = Array(4).fill(Array(4).fill(0));

  it("renders correctly", () => {
    const { getByText } = render(
      <GameBoard board={board} initialTiles={initialTiles} />,
    );

    expect(getByText("2")).toBeTruthy();
    expect(getByText("2048")).toBeTruthy();
    expect(getByText("65536")).toBeTruthy();
  });

  it("applies correct background color for tiles", () => {
    const { getByText } = render(
      <GameBoard board={board} initialTiles={initialTiles} />,
    );

    const tile2 = getByText("2").parent;
    const tile2048 = getByText("2048").parent;
    expect(tile2).toHaveStyle({ backgroundColor: "#FAF8EF" });
    expect(tile2048).toHaveStyle({ backgroundColor: "#FF7A00" });
  });
});
