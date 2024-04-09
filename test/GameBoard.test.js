import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import Tile from "./Tile"; // Tile 컴포넌트의 경로를 맞게 조정해주세요.

describe("Tile 컴포넌트 테스트", () => {
  it("Tile 컴포넌트가 올바르게 렌더링 되는지 확인", () => {
    const cell = {
      positionX: 0,
      positionY: 0,
      value: 2,
    };
    const tileSize = 90; // 테스트 목적으로 설정한 타일 사이즈

    const { getByText } = render(<Tile cell={cell} tileSize={tileSize} />);

    expect(getByText("2")).toBeTruthy();
  });

  // 추가적인 테스트 케이스를 여기에 구현할 수 있습니다.
  // 예를 들어, cell의 value가 변경될 때 애니메이션 값이 올바르게 업데이트되는지, 특정 value를 가진 타일의 스타일이 올바르게 적용되는지 등을 테스트할 수 있습니다.
});
