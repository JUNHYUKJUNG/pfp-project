import { FC, useState } from "react"; // react에서 FC와 useState를 import

import { Link } from "react-router-dom"; // react-router-dom에서 Link를 import

export interface NftCardProps {
  // NftCardProps 인터페이스 정의
  image: string; // 이미지 경로를 나타내는 문자열
  name: string; // 이름을 나타내는 문자열
  tokenId: number; // 토큰 ID를 나타내는 숫자
}

const NftCard: FC<NftCardProps> = ({ image, name, tokenId }) => {
  // NftCard 컴포넌트 정의
  const [isHover, setIsHover] = useState<boolean>(false); // isHover 상태와 setIsHover 함수를 useState 훅을 사용하여 초기화

  const onMouseEnter = () => {
    // 마우스가 컴포넌트에 진입했을 때 호출되는 함수
    setIsHover(true); // isHover 상태를 true로 변경
  };

  const onMouseLeave = () => {
    // 마우스가 컴포넌트를 벗어났을 때 호출되는 함수
    setIsHover(false); // isHover 상태를 false로 변경
  };

  return (
    <Link to={`/detail/${tokenId}`}>
      {/* tokenId를 사용하여 동적 경로를 생성하는 Link 컴포넌트 */}
      <li
        className="relative" // 상대적인 위치를 가지는 클래스
        onMouseEnter={onMouseEnter} // 마우스가 컴포넌트에 진입했을 때 onMouseEnter 함수 호출
        onMouseLeave={onMouseLeave} // 마우스가 컴포넌트를 벗어났을 때 onMouseLeave 함수 호출
      >
        <img src={image} alt={name} />
        {/* 이미지 태그로 이미지를 표시하고 alt 속성에 이름을 표시 */}
        <div className="font-semibold mt-1">{name}</div>
        {/* 이름을 나타내는 div 태그 */}
        {isHover && ( // isHover가 true일 때만 렌더링되는 조건부 렌더링
          <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50"></div> // 배경이 흰색이고 투명도가 50%인 div 태그
        )}
      </li>
    </Link>
  );
};

export default NftCard; // NftCard 컴포넌트를 내보내기
