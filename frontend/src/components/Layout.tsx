import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Web3, { Contract, ContractAbi } from "web3";
import { useSDK } from "@metamask/sdk-react";

import Header from "./Header";
import mintNftAbi from "../abis/mintNftAbi.json";
import saleNftAbi from "../abis/saleNftAbi.json";
import { MINT_NFT_CONTRACT, SALE_NFT_CONTRACT } from "../abis/contractAddress";

const Layout: FC = () => {
  const [account, setAccount] = useState<string>(""); // 사용자 계정 상태를 저장하는 상태 변수
  const [web3, setWeb3] = useState<Web3>(); // Web3 인스턴스를 저장하는 상태 변수
  const [mintNftContract, setMintNftContract] =
    useState<Contract<ContractAbi>>(); // mintNftContract 인스턴스를 저장하는 상태 변수
  const [saleNftContract, setSaleNftContract] =
    useState<Contract<ContractAbi>>(); // saleNftContract 인스턴스를 저장하는 상태 변수

  const { provider } = useSDK(); // MetaMask SDK에서 provider를 가져오는 hook

  useEffect(() => {
    if (!provider) return; // provider가 없으면 종료

    setWeb3(new Web3(provider)); // provider를 사용하여 Web3 인스턴스 생성 및 저장
  }, [provider]);

  useEffect(() => {
    if (!web3) return; // web3가 없으면 종료

    setMintNftContract(new web3.eth.Contract(mintNftAbi, MINT_NFT_CONTRACT));
    // mintNftContract 인스턴스 생성 및 저장
    setSaleNftContract(new web3.eth.Contract(saleNftAbi, SALE_NFT_CONTRACT)); // saleNftContract 인스턴스 생성 및 저장
  }, [web3]);

  return (
    <div className="min-h-screen max-w-screen-md mx-auto flex flex-col">
      <Header account={account} setAccount={setAccount} />
      {/* Header 컴포넌트 렌더링 */}
      <Outlet context={{ account, web3, mintNftContract, saleNftContract }} />
      {/* Outlet 컴포넌트 렌더링 */}
    </div>
  );
};

export default Layout;
