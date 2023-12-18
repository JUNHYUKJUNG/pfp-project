import { FC, useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import MintModal from "../components/MintModal";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import MyNftCard from "../components/MyNftCard";
import { SALE_NFT_CONTRACT } from "../abis/contractAddress";

const My: FC = () => {
  // isOpen 상태를 관리하는 useState 훅
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // metadataArray 상태를 관리하는 useState 훅
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  // saleStatus 상태를 관리하는 useState 훅
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  // useOutletContext 훅을 사용하여 mintNftContract와 account를 가져옴
  const { mintNftContract, account } = useOutletContext<OutletContext>();

  // useNavigate 훅을 사용하여 navigate 함수를 가져옴
  const navigate = useNavigate();

  // MintModal을 열기 위한 onClick 이벤트 핸들러
  const onClickMintModal = () => {
    if (!account) return;

    setIsOpen(true);
  };

  // 내 NFT 목록을 가져오는 비동기 함수
  const getMyNFTs = async () => {
    try {
      if (!mintNftContract || !account) return;

      // mintNftContract의 balanceOf 메서드를 호출하여 계정의 NFT 수를 가져옴
      // @ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      let temp: NftMetadata[] = [];

      // 계정이 소유한 각 NFT의 tokenId와 metadataURI를 가져와서 metadataArray에 추가
      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await mintNftContract.methods
          // @ts-expect-error
          .tokenOfOwnerByIndex(account, i)
          .call();

        const metadataURI: string = await mintNftContract.methods
          // @ts-expect-error
          .tokenURI(Number(tokenId))
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(tokenId) });
      }

      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  // 판매 상태를 가져오는 비동기 함수
  const getSaleStatus = async () => {
    try {
      const isApproved: boolean = await mintNftContract.methods
        // @ts-expect-error
        .isApprovedForAll(account, SALE_NFT_CONTRACT)
        .call();

      setSaleStatus(isApproved);
    } catch (error) {
      console.error(error);
    }
  };

  // 판매 상태를 변경하는 onClick 이벤트 핸들러
  const onClickSaleStatus = async () => {
    try {
      await mintNftContract.methods
        // @ts-expect-error
        .setApprovalForAll(SALE_NFT_CONTRACT, !saleStatus)
        .send({
          from: account,
        });

      setSaleStatus(!saleStatus);
    } catch (error) {
      console.error(error);
    }
  };

  // 컴포넌트가 마운트될 때와 mintNftContract, account가 변경될 때마다 getMyNFTs 함수 호출
  useEffect(() => {
    getMyNFTs();
  }, [mintNftContract, account]);

  // account가 변경될 때마다 "/"로 이동하는 useEffect
  useEffect(() => {
    if (account) return;

    navigate("/");
  }, [account]);

  // account가 변경될 때마다 getSaleStatus 함수 호출
  useEffect(() => {
    if (!account) return;

    getSaleStatus();
  }, [account]);

  return (
    <>
      <div className="grow">
        <div className="flex justify-between p-2">
          {/* 판매 상태를 변경하는 버튼 */}
          <button className="hover:text-gray-500" onClick={onClickSaleStatus}>
            Sale Approved: {saleStatus ? "TRUE" : "FALSE"}
          </button>
          {/* MintModal을 열기 위한 버튼 */}
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
        <div className="text-center py-8">
          <h1 className="font-bold text-2xl">My NFTs</h1>
        </div>
        <ul className="p-8 grid grid-cols-2 gap-8">
          {/* metadataArray를 순회하며 MyNftCard 컴포넌트를 렌더링 */}
          {metadataArray?.map((v, i) => (
            <MyNftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
              saleStatus={saleStatus}
            />
          ))}
        </ul>
      </div>
      {/* isOpen이 true일 때 MintModal 컴포넌트를 렌더링 */}
      {isOpen && (
        <MintModal
          setIsOpen={setIsOpen}
          metadataArray={metadataArray}
          setMetadataArray={setMetadataArray}
        />
      )}
    </>
  );
};

export default My;
