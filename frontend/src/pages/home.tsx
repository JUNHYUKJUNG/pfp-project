import { FC, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import NftCard from "../components/NftCard";

const GET_AMOUNT = 6;

const Home: FC = () => {
  const [searchTokenId, setSearchTokenId] = useState<number>(0);
  const [totalNFT, setTotalNFT] = useState<number>(0);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract } = useOutletContext<OutletContext>();

  const detectRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const observe = () => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && metadataArray.length !== 0) {
        getNFTs();
      }
    });
    //emerald-labour-lobster-933.mypinata.cloud/ipfs/QmPybiH9xwBjMUK6a9N1ZXRpRkcucK7XbDWzJagiq5E4Sx/5.png

    https: if (!detectRef.current) return;

    observer.current.observe(detectRef.current);
  };

  //전체 NFT 갯수 조회
  const getTotalSupply = async () => {
    try {
      if (!mintNftContract) return;

      const totalSupply = await mintNftContract.methods.totalSupply().call();

      setSearchTokenId(Number(totalSupply));
      setTotalNFT(Number(totalSupply));
      // Number로 감싼 이유는 Web3에서 totalSupply가 string이기 때문에
    } catch (error) {
      console.error(error);
    }
  };

  const getNFTs = async () => {
    try {
      if (!mintNftContract || searchTokenId <= 0) return;

      let temp: NftMetadata[] = [];

      for (let i = 0; i < GET_AMOUNT; i++) {
        if (searchTokenId - i > 0) {
          const metadataURI: string = await mintNftContract.methods
            // @ts-expect-error
            .tokenURI(searchTokenId - i)
            .call();

          const response = await axios.get(metadataURI);

          temp.push({ ...response.data, tokenId: searchTokenId });
        }
      }

      // mA = [3, 2, 1] - metadataArray
      // t = [4, 5, 6] - temp

      // nA = [3, 2, 1, 4, 5, 6]
      // nA = [...mA, ...t]

      setSearchTokenId(searchTokenId - GET_AMOUNT);
      setMetadataArray([...metadataArray, ...temp]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTotalSupply();
  }, [mintNftContract]);

  useEffect(() => {
    if (totalNFT === 0) return;

    getNFTs();
  }, [totalNFT]);

  useEffect(() => {
    observe();

    return () => observer.current?.disconnect();
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
