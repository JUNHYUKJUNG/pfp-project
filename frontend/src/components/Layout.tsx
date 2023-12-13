import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Web3, { Contract, ContractAbi } from "web3";
import Header from "./Header";
import { useSDK } from "@metamask/sdk-react";
import mintNftAbi from "../abis/mintNftAbi.json";

export interface OutletContext {
  account: string;
  web3: Web3;
  mintNftContract: Contract<ContractAbi>;
}

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [web3, setWeb3] = useState<Web3>();
  const [mintNftContract, setMintNftConrtact] =
    useState<Contract<ContractAbi>>();

  const { provider } = useSDK();

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setMintNftConrtact(
      new web3.eth.Contract(
        mintNftAbi,
        "0x6bA74AdF3D0762A83CEC9ed9E8F7847D02fE7EF2"
      )
    );
  }, [web3]);

  useEffect(() => {
    console.log(mintNftContract);
  }, [mintNftContract]);

  return (
    <div className="bg-red-100 min-h-screen max-w-screen-md mx-auto flex flex-col">
      <Header account={account} setAccount={setAccount} />
      <Outlet context={{ account, web3, mintNftContract }} />
      {/* Outlet 태그는 라우터의 자식 컴포넌트를 렌더링하는데 사용. 이걸 사용하지 않으면 라우터의 자식 컴포넌트가 렌더링되지 않음. */}
    </div>
  );
};

export default Layout;
