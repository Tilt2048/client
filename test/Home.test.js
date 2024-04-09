import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../HomeScreen";

describe("<HomeScreen />", () => {
  it("renders correctly", () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    // 초기 렌더링 테스트
    expect(getByText("Tilt & Tilt")).toBeTruthy();
    expect(getByText("2048")).toBeTruthy();
    expect(getByText("게스트로 시작")).toBeTruthy();

    // Modal 관련 상태 테스트
    const setStandardSlopeButton = getByText("기울기 설정");
    fireEvent.press(setStandardSlopeButton);
    // Modal이 보여지는지 검증하기 위해 Modal 관련 Text를 검색
    expect(getByText("세팅 완료")).toBeTruthy();

    // 기울기 설정 완료 버튼 클릭 테스트
    const settingDoneButton = getByText("세팅 완료");
    fireEvent.press(settingDoneButton);
    // Modal이 닫혔는지 검증할 상태 또는 변화가 필요. 예를 들어, Modal 상태를 테스트하려면 해당 상태를 확인할 수 있는 방법이 필요함.
  });

  // 기타 테스트 케이스...
});
