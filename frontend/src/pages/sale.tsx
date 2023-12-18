import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import SaleNftCard from "../components/SaleNftCard";

const Sale: FC = () => {
  // 상태 변수 선언
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  // OutletContext에서 saleNftContract와 mintNftContract 가져오기
  const { saleNftContract, mintNftContract } =
    useOutletContext<OutletContext>();

  // 판매 중인 NFT 정보 가져오는 함수
  const getSaleNFTs = async () => {
    try {
      // 판매 중인 NFT의 ID 배열 가져오기
      const onSaleNFTs: bigint[] = await saleNftContract.methods
        .getOnSaleNFTs()
        .call();

      let temp: NftMetadata[] = [];

      // 각 NFT의 메타데이터 가져오기
      for (let i = 0; i < onSaleNFTs.length; i++) {
        const metadataURI: string = await mintNftContract.methods
          // @ts-expect-error
          .tokenURI(Number(onSaleNFTs[i]))
          .call();

        // 메타데이터 URI로부터 실제 데이터 가져오기
        const response = await axios.get(metadataURI);

        // 메타데이터와 NFT의 ID를 합쳐서 임시 배열에 추가
        temp.push({ ...response.data, tokenId: Number(onSaleNFTs[i]) });
      }

      // 메타데이터 배열 업데이트
      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  // 컴포넌트가 마운트되거나 saleNftContract가 변경될 때마다 getSaleNFTs 함수 호출
  useEffect(() => {
    if (!saleNftContract) return;

    getSaleNFTs();
  }, [saleNftContract]);

  return (
    <div className="grow">
      <div className="text-center py-8">
        <h1 className="font-bold text-2xl">Sale NFTs</h1>
      </div>
      <ul className="p-8 grid grid-cols-2 gap-8">
        {/* 메타데이터 배열을 순회하며 SaleNftCard 컴포넌트 렌더링 */}
        {metadataArray?.map((v, i) => (
          <SaleNftCard
            key={i}
            image={v.image}
            name={v.name}
            tokenId={v.tokenId!}
            metadataArray={metadataArray}
            setMetadataArray={setMetadataArray}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sale;
