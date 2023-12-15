// React를 불러옴
import React from "react";

// @testing-library/react에서 render와 screen을 불러옴
import { render, screen } from "@testing-library/react";

// './App'에서 App을 불러옴
import App from "./App";

// 'learn react' 링크가 렌더링되는지 테스트함
test("renders learn react link", () => {
  // App 컴포넌트를 렌더링함
  render(<App />);

  // 'learn react' 텍스트를 가진 요소를 찾음
  const linkElement = screen.getByText(/learn react/i);

  // 'learn react' 텍스트가 문서에 존재하는지 확인함
  expect(linkElement).toBeInTheDocument();
});
