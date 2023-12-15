import { FC, useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";

const Detail: FC = () => {
  const [metadata, setMetadata] = useState<NftMetadata>(); // NFT 메타데이터 상태 변수

  const { tokenId } = useParams(); // URL 매개변수에서 tokenId 추출

  const { mintNftContract } = useOutletContext<OutletContext>(); // Outlet 컨텍스트에서 mintNftContract 추출

  const navigate = useNavigate(); // react-router-dom의 navigate 함수

  const getMyNFT = async () => {
    try {
      if (!mintNftContract) return; // mintNftContract가 없으면 함수 종료

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(tokenId) // tokenId를 사용하여 NFT 메타데이터 URI 가져오기
        .call();

      const response = await axios.get(metadataURI); // 메타데이터 URI로부터 데이터 가져오기

      setMetadata(response.data); // 메타데이터 상태 업데이트
    } catch (error) {
      console.error(error); // 에러 처리
    }
  };

  useEffect(() => {
    getMyNFT(); // 컴포넌트가 마운트되면 getMyNFT 함수 호출
  }, [mintNftContract]);

  return (
    <div className="grow flex justify-center items-center relative">
      <button
        className="absolute top-8 left-8 hover:text-gray-500"
        onClick={() => navigate(-1)} // 이전 페이지로 이동하는 함수 호출
      >
        Back
      </button>
      {metadata && (
        <div className="w-60">
          <img className="w-60 h-60" src={metadata.image} alt={metadata.name} />
          {/* 이미지 표시 */}
          <div className="font-semibold mt-1">{metadata.name}</div>
          {/* 이름 표시 */}
          <div className="mt-1">{metadata.description}</div>
          {/* 설명 표시 */}
          <ul className="mt-1 flex flex-wrap gap-1">
            {metadata.attributes.map((v, i) => (
              <li key={i}>
                <span className="font-semibold">{v.trait_type}</span>
                {/* 특성 유형 표시 */}
                <span>: {v.value}</span>
                {/* 특성 값 표시 */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Detail;
