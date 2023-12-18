import { FC, FormEvent, useEffect, useState } from "react"; // React에서 사용할 FC, FormEvent, useEffect, useState를 import합니다.
import NftCard, { NftCardProps } from "./NftCard"; // NftCard 컴포넌트와 NftCardProps 타입을 import합니다.
import { useOutletContext } from "react-router-dom"; // react-router-dom에서 useOutletContext를 import합니다.
import { OutletContext } from "../types"; // "../types"에서 OutletContext를 import합니다.
import { MINT_NFT_CONTRACT } from "../abis/contractAddress"; // "../abis/contractAddress"에서 MINT_NFT_CONTRACT를 import합니다.

interface MyNftCardProps extends NftCardProps {
  // NftCardProps를 상속받는 MyNftCardProps 인터페이스를 선언합니다.
  saleStatus: boolean; // saleStatus라는 boolean 타입의 속성을 선언합니다.
}

const MyNftCard: FC<MyNftCardProps> = ({
  // MyNftCardProps 타입을 받아오는 MyNftCard 함수형 컴포넌트를 선언합니다.
  tokenId, // tokenId 속성을 받아옵니다.
  image, // image 속성을 받아옵니다.
  name, // name 속성을 받아옵니다.
  saleStatus, // saleStatus 속성을 받아옵니다.
}) => {
  const [price, setPrice] = useState<string>(""); // price와 setPrice라는 상태를 선언합니다. price의 초기값은 빈 문자열입니다.
  const [registedPrice, setRegistedPrice] = useState<number>(0); // registedPrice와 setRegistedPrice라는 상태를 선언합니다. registedPrice의 초기값은 0입니다.

  const { saleNftContract, account, web3 } = useOutletContext<OutletContext>(); // useOutletContext를 사용하여 saleNftContract, account, web3를 받아옵니다.

  const onSubmitForSale = async (e: FormEvent) => {
    // onSubmitForSale이라는 비동기 함수를 선언합니다.
    try {
      e.preventDefault(); // 이벤트의 기본 동작을 막습니다.

      if (isNaN(+price)) return; // price가 숫자가 아니라면 함수를 종료합니다.

      const response = await saleNftContract.methods // saleNftContract의 메서드를 사용하여
        .setForSaleNFT(
          // setForSaleNFT 함수를 호출합니다.
          // @ts-expect-error
          MINT_NFT_CONTRACT, // MINT_NFT_CONTRACT를 인자로 전달합니다.
          tokenId, // tokenId를 인자로 전달합니다.
          web3.utils.toWei(Number(price), "ether") // price를 ether로 변환하여 인자로 전달합니다.
        )
        .send({ from: account }); // 계정 정보를 포함하여 전송합니다.

      setRegistedPrice(+price); // registedPrice 상태를 업데이트합니다.
      setPrice(""); // price 상태를 초기화합니다.
    } catch (error) {
      console.error(error); // 에러를 콘솔에 출력합니다.
    }
  };

  const getRegistedPrice = async () => {
    // getRegistedPrice라는 비동기 함수를 선언합니다.
    try {
      // @ts-expect-error
      const response = await saleNftContract.methods.nftPrices(tokenId).call(); // saleNftContract의 메서드를 사용하여 nftPrices 함수를 호출합니다.

      setRegistedPrice(Number(web3.utils.fromWei(Number(response), "ether"))); // registedPrice 상태를 업데이트합니다.
    } catch (error) {
      console.error(error); // 에러를 콘솔에 출력합니다.
    }
  };

  useEffect(() => {
    // useEffect 훅을 사용합니다.
    if (!saleNftContract) return; // saleNftContract가 존재하지 않으면 함수를 종료합니다.

    getRegistedPrice(); // getRegistedPrice 함수를 호출합니다.
  }, [saleNftContract]);

  return (
    <div>
      <NftCard tokenId={tokenId} image={image} name={name} />
      {/* NftCard 컴포넌트를 렌더링합니다. */}
      {registedPrice ? ( // registedPrice가 존재한다면
        <div>{registedPrice} ETH</div> // registedPrice와 "ETH"를 출력합니다.
      ) : (
        saleStatus && ( // saleStatus가 true이면
          <form onSubmit={onSubmitForSale}>
            {/* onSubmitForSale 함수를 호출하는 폼을 렌더링합니다. */}
            <input
              type="text"
              className="border-2 mr-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {/* price를 입력받는 input 요소를 렌더링합니다. */}
            <input type="submit" value="등 록" />
            {/* "등 록"이라는 값을 가지는 submit 버튼을 렌더링합니다. */}
          </form>
        )
      )}
    </div>
  );
};

export default MyNftCard; // MyNftCard 컴포넌트를 내보냅니다.
