import { useSDK } from "@metamask/sdk-react"; // Metamask SDK를 사용하기 위해 import
import { Dispatch, FC, SetStateAction } from "react"; // React의 타입들을 import
import { Link } from "react-router-dom"; // React Router의 Link 컴포넌트를 import

interface HeaderProps {
  account: string; // 계정 정보를 담을 문자열
  setAccount: Dispatch<SetStateAction<string>>; // 계정 정보를 업데이트하는 함수
}

const Header: FC<HeaderProps> = ({ account, setAccount }) => {
  const { sdk } = useSDK(); // Metamask SDK 훅을 사용하여 sdk 객체 가져오기

  const onClickMetaMask = async () => {
    try {
      const accounts: any = await sdk?.connect(); // Metamask와 연결하여 계정 정보 가져오기

      setAccount(accounts[0]); // 가져온 계정 정보를 업데이트
    } catch (error) {
      console.error(error); // 에러 발생 시 콘솔에 로그 출력
    }
  };

  return (
    <header className="p-2 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        {/* 홈으로 이동하는 링크 */}
        <Link to="/my">My</Link>
        {/* 내 정보로 이동하는 링크 */}
        <Link to="/sale">Sale</Link>
        {/* 판매 페이지로 이동하는 링크 */}
      </div>
      <div>
        {account ? (
          <div>
            <span>
              {account.substring(0, 7)}...
              {/* 계정 정보 일부만 표시 */}
              {account.substring(account.length - 5)}
              {/* 계정 정보 일부만 표시 */}
            </span>
            <button className="ml-2" onClick={() => setAccount("")}>
              Logout
              {/* 로그아웃 버튼 */}
            </button>
          </div>
        ) : (
          <button onClick={onClickMetaMask}>MetaMask Login</button> // MetaMask 로그인 버튼
        )}
      </div>
    </header>
  );
};

export default Header; // Header 컴포넌트를 내보내기
