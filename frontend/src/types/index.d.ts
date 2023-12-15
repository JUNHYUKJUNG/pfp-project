// 웹3(Web3) 라이브러리와 관련된 타입들을 가져옴
import Web3, { Contract, ContractAbi } from "web3";

// OutletContext 인터페이스를 정의
export interface OutletContext {
  account: string; // 계정 주소를 나타내는 문자열
  web3: Web3; // 웹3(Web3) 인스턴스
  mintNftContract: Contract<ContractAbi>; // NFT를 생성하는 스마트 컨트랙트 인스턴스
  saleNftContract: Contract<ContractAbi>; // NFT를 판매하는 스마트 컨트랙트 인스턴스
}

// NftMetadata 인터페이스를 정의
export interface NftMetadata {
  tokenId?: number; // NFT 토큰 ID를 나타내는 숫자 (선택적)
  name: string; // NFT의 이름을 나타내는 문자열
  image: string; // NFT의 이미지 URL을 나타내는 문자열
  description: string; // NFT의 설명을 나타내는 문자열
  attributes: {
    // NFT의 속성을 나타내는 객체
    trait_type: string; // 속성의 유형을 나타내는 문자열
    value: string; // 속성의 값(value)을 나타내는 문자열
  }[];
}
