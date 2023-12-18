import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import NftCard, { NftCardProps } from "./NftCard";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import { MINT_NFT_CONTRACT } from "../abis/contractAddress";

// SaleNftCardProps 인터페이스 정의
interface SaleNftCardProps extends NftCardProps {
  metadataArray: NftMetadata[]; // NftMetadata 배열
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>; // NftMetadata 배열을 업데이트하는 함수
}

// SaleNftCard 컴포넌트 정의
const SaleNftCard: FC<SaleNftCardProps> = ({
  tokenId,
  image,
  name,
  metadataArray,
  setMetadataArray,
}) => {
  const [registedPrice, setRegistedPrice] = useState<number>(0); // 등록된 가격 상태 변수

  const { saleNftContract, account, web3, mintNftContract } =
    useOutletContext<OutletContext>(); // OutletContext에서 상태 변수 및 함수 가져오기

  // 구매 버튼 클릭 시 실행되는 함수
  const onClickPurchase = async () => {
    try {
      const nftOwner: string = await mintNftContract.methods
        // @ts-expect-error
        .ownerOf(tokenId)
        .call();

      // 현재 계정이 없거나 NFT 소유자와 현재 계정이 같으면 함수 종료
      if (!account || nftOwner.toLowerCase() === account.toLowerCase()) return;

      await saleNftContract.methods
        // @ts-expect-error
        .purchaseNFT(MINT_NFT_CONTRACT, tokenId)
        .send({
          from: account,
          value: web3.utils.toWei(registedPrice, "ether"),
        });

      // metadataArray에서 tokenId와 다른 요소들만 필터링하여 temp에 저장
      const temp = metadataArray.filter((v) => {
        if (v.tokenId !== tokenId) {
          return v;
        }
      });

      // metadataArray 업데이트
      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  // 등록된 가격을 가져오는 함수
  const getRegistedPrice = async () => {
    try {
      // @ts-expect-error
      const response = await saleNftContract.methods.nftPrices(tokenId).call();

      // 등록된 가격을 wei에서 ether로 변환하여 registedPrice 상태 변수에 저장
      setRegistedPrice(Number(web3.utils.fromWei(Number(response), "ether")));
    } catch (error) {
      console.error(error);
    }
  };

  // 컴포넌트가 마운트되거나 saleNftContract가 변경될 때마다 실행되는 효과
  useEffect(() => {
    if (!saleNftContract) return;

    getRegistedPrice();
  }, [saleNftContract]);

  return (
    <div>
      <NftCard tokenId={tokenId} image={image} name={name} />
      <div>
        {registedPrice} ETH <button onClick={onClickPurchase}>구매</button>
      </div>
    </div>
  );
};

export default SaleNftCard;
