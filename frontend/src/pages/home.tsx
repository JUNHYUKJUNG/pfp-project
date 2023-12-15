import { FC, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import NftCard from "../components/NftCard";

const GET_AMOUNT = 6; // 한 번에 가져올 NFT의 개수

const Home: FC = () => {
  const [searchTokenId, setSearchTokenId] = useState<number>(0); // 검색할 NFT의 토큰 ID
  const [totalNFT, setTotalNFT] = useState<number>(0); // 전체 NFT의 개수
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]); // NFT의 메타데이터 배열

  const { mintNftContract } = useOutletContext<OutletContext>(); // OutletContext에서 mintNftContract 가져오기

  const detectRef = useRef<HTMLDivElement>(null); // 감지할 요소의 Ref
  const observer = useRef<IntersectionObserver>(); // IntersectionObserver의 Ref

  const observe = () => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && metadataArray.length !== 0) {
        getNFTs(); // 요소가 교차되고 메타데이터 배열이 비어있지 않으면 NFT 가져오기
      }
    });

    if (!detectRef.current) return; // 요소가 없으면 종료

    observer.current.observe(detectRef.current); // 요소 감지 시작
  };

  const getTotalSupply = async () => {
    // getTotalSupply = 전체 NFT 갯수 조회
    try {
      if (!mintNftContract) return; // mintNftContract가 없으면 종료

      const totalSupply = await mintNftContract.methods.totalSupply().call(); // mintNftContract의 totalSupply 메서드 호출

      setSearchTokenId(Number(totalSupply)); // 검색할 토큰 ID 설정
      setTotalNFT(Number(totalSupply)); // 전체 NFT 개수 설정
    } catch (error) {
      console.error(error);
    }
  };

  const getNFTs = async () => {
    try {
      if (!mintNftContract || searchTokenId <= 0) return; // mintNftContract가 없거나 검색할 토큰 ID가 0보다 작거나 같으면 종료

      let temp: NftMetadata[] = []; // 임시 메타데이터 배열

      for (let i = 0; i < GET_AMOUNT; i++) {
        if (searchTokenId - i > 0) {
          const metadataURI: string = await mintNftContract.methods
            // @ts-expect-error
            .tokenURI(searchTokenId - i)
            .call(); // mintNftContract의 tokenURI 메서드 호출

          const response = await axios.get(metadataURI); // metadataURI로부터 메타데이터 가져오기

          temp.push({ ...response.data, tokenId: searchTokenId - i }); // 임시 배열에 메타데이터 추가
        }
      }

      setSearchTokenId(searchTokenId - GET_AMOUNT); // 검색할 토큰 ID 업데이트
      setMetadataArray([...metadataArray, ...temp]); // 메타데이터 배열 업데이트
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTotalSupply(); // 컴포넌트가 마운트될 때 전체 NFT 개수 조회
  }, [mintNftContract]);

  useEffect(() => {
    if (totalNFT === 0) return; // 전체 NFT 개수가 0이면 종료

    getNFTs(); // 전체 NFT 개수가 업데이트될 때 NFT 가져오기
  }, [totalNFT]);

  useEffect(() => {
    observe(); // 컴포넌트가 마운트될 때 요소 감지 시작

    return () => observer.current?.disconnect(); // 컴포넌트가 언마운트될 때 요소 감지 중단
  }, [metadataArray]);

  return (
    <>
      <div className="grow">
        <ul className="p-8 grid grid-cols-2 gap-8">
          {metadataArray?.map((v, i) => (
            <NftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
            />
          ))}
        </ul>
      </div>
      <div ref={detectRef} className="text-white py-4">
        Detecting Area
      </div>
    </>
  );
};

export default Home;
