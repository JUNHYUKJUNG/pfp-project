// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import './MintNFT.sol';

contract SaleNFT {
// 판매 등록 (컨트랙트 주소, 지갑 주소, NFT ID, 가격이 필요함)

    // tokenId => price
    mapping(uint => uint) public nftPrices;

    uint[] public onSaleNFTs;

   function setForSaleNFT(address _mintNftAddress, uint _tokenId, uint _price) public {
       ERC721 mintNftContract = ERC721(_mintNftAddress);
       address nftOwner = mintNftContract.ownerOf(_tokenId);

        require(msg.sender == nftOwner, "Caller is not NFT owner."); // msg.sender는 함수를 실행시키는 사람
        require(_price > 0, "Price is zero or lower.");
        require(nftPrices[_tokenId] == 0,"This NFT is already on sale.");
        require(mintNftContract.isApprovedForAll(msg.sender, address(this)), "NFT owner did not approve token.");

       nftPrices[_tokenId] = _price;

       onSaleNFTs.push(_tokenId);
   }



   // 구매 (컨트랙트 주소, 토큰 ID, 가격, 구매자가 필요함)
   function purchaseNFT(address _mintNftAddress, uint _tokenId) public payable {
        ERC721 mintNftContract = ERC721(_mintNftAddress);
        address nftOwner = mintNftContract.ownerOf(_tokenId);

        require(msg.sender != nftOwner, "Caller is NFT owner.");
        require(nftPrices[_tokenId] > 0, "This NFT not sale.");
        require(nftPrices[_tokenId] <= msg.value, "caller sent lower than price.");

        payable(nftOwner).transfer(msg.value); // 입력한 값을 nft 주인에게 보냄

        mintNftContract.safeTransferFrom(nftOwner, msg.sender, _tokenId);

        nftPrices[_tokenId] = 0;

        checkZeroPrice();
   }

        function checkZeroPrice() public {
        for(uint i = 0; i < onSaleNFTs.length; i++) {
            if(nftPrices[onSaleNFTs[i]] == 0) {
                onSaleNFTs[i] = onSaleNFTs[onSaleNFTs.length - 1]; // 같다는 뜻이 아니고 오른쪽에 있는 걸 왼쪽에 담겠다는 뜻
                onSaleNFTs.pop();
            }
        }
    }
    
    function getOnSaleNFTs() public view returns(uint[] memory) {
        return onSaleNFTs;
    }
}