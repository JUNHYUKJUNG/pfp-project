import { Dispatch, FC, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { NftMetadata, OutletContext } from "../types";

interface MintModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>; // setIsOpen 상태를 변경하는 함수
  metadataArray: NftMetadata[]; // NftMetadata 배열
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>; // setMetadataArray 상태를 변경하는 함수
}

const MintModal: FC<MintModalProps> = ({
  setIsOpen,
  metadataArray,
  setMetadataArray,
}) => {
  const [metadata, setMetadata] = useState<NftMetadata>(); // metadata 상태와 setMetadata 함수를 생성
  const [isLoading, setIsLoading] = useState<boolean>(false); // isLoading 상태와 setIsLoading 함수를 생성

  const { mintNftContract, account } = useOutletContext<OutletContext>(); // useOutletContext 훅을 사용하여 mintNftContract와 account를 가져옴

  const onClickMint = async () => {
    try {
      if (!mintNftContract || !account) return; // mintNftContract 또는 account가 없으면 함수 종료

      setIsLoading(true); // 로딩 상태를 true로 변경

      await mintNftContract.methods.mintNFT().send({ from: account }); // mintNftContract의 mintNFT 메서드를 호출하여 NFT를 민팅

      // @ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call(); // mintNftContract의 balanceOf 메서드를 호출하여 계정의 잔액을 가져옴

      const tokenId = await mintNftContract.methods
        // @ts-expect-error
        .tokenOfOwnerByIndex(account, Number(balance) - 1)
        .call(); // mintNftContract의 tokenOfOwnerByIndex 메서드를 호출하여 계정의 토큰 ID를 가져옴

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(Number(tokenId))
        .call(); // mintNftContract의 tokenURI 메서드를 호출하여 메타데이터 URI를 가져옴

      const response = await axios.get(metadataURI); // axios를 사용하여 메타데이터를 가져옴

      setMetadata(response.data); // 가져온 메타데이터를 metadata 상태에 저장
      setMetadataArray([response.data, ...metadataArray]); // 가져온 메타데이터를 metadataArray에 추가
      setIsLoading(false); // 로딩 상태를 false로 변경
    } catch (error) {
      console.error(error); // 에러 출력

      setIsLoading(false); // 로딩 상태를 false로 변경
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
      <div className="p-8 bg-white rounded-xl">
        <div className="text-right mb-8">
          <button onClick={() => setIsOpen(false)}>x</button>
          {/* setIsOpen 함수를 호출하여 모달을 닫는 버튼 */}
        </div>
        {metadata ? (
          <div className="w-60">
            <img
              className="w-60 h-60"
              src={metadata.image}
              alt={metadata.name}
            />
            {/* 메타데이터의 이미지와 이름을 출력 */}
            <div className="font-semibold mt-1">{metadata.name}</div>
            {/* 메타데이터의 이름 출력 */}
            <div className="mt-1">{metadata.description}</div>
            {/* 메타데이터의 설명 출력 */}
            <ul className="mt-1 flex flex-wrap gap-1">
              {metadata.attributes.map((v, i) => (
                <li key={i}>
                  <span className="font-semibold">{v.trait_type}</span>
                  <span>: {v.value}</span>
                </li>
              ))}
              {/* 메타데이터의 속성을 출력 */}
            </ul>
            <div className="text-center mt-4">
              <button
                className="hover:text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                닫기
              </button>
              {/* setIsOpen 함수를 호출하여 모달을 닫는 버튼 */}
            </div>
          </div>
        ) : (
          <>
            <div>{isLoading ? "로딩중..." : "NFT를 민팅하시겠습니까?"}</div>
            {/* 로딩 중인지 민팅할지를 출력 */}
            <div className="text-center mt-4">
              <button className="hover:text-gray-500" onClick={onClickMint}>
                확인
              </button>
              {/* onClickMint 함수를 호출하여 NFT를 민팅하는 버튼 */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MintModal;
