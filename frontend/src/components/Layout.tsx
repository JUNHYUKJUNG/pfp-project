import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: FC = () => {
  return (
    <div className="bg-red-100 min-h-screen max-w-screen-md mx-auto">
      <Header />
      <Outlet />
      {/* Outlet 태그는 라우터의 자식 컴포넌트를 렌더링하는데 사용. 이걸 사용하지 않으면 라우터의 자식 컴포넌트가 렌더링되지 않음. */}
    </div>
  );
};

export default Layout;
