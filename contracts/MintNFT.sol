// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// 형변환

contract MintNFT is ERC721Enumerable {
    string metadataURI;

    uint maxSupply;

// constructor() ERC721("JUNHYUKJUNG", "JUNHYUKJUNG") {}
         constructor(string memory _name, string memory _symbol, uint _maxSupply, string memory _metadataURI) ERC721(_name, _symbol) {
        maxSupply = _maxSupply;
        metadataURI = _metadataURI;
    }
    // 주석친 부분과 아래 코드는 입력 순서

       function mintNFT() public {
        require(totalSupply() < maxSupply, "No more mint.");
        // require() 는 조건을 확인하고 함수를 생성함
        uint tokenId = totalSupply() + 1;
        // totalSupply() 는 양수를 뽑아주는 함수

        _mint(msg.sender, tokenId);
        // _mint() 함수를 한 번 더 public 함수로 만드는 이유는 외부에서 직접 호출하기 위해서 작성함
    }
    function tokenURI(uint _tokenId) public override view returns(string memory) {
        return string(abi.encodePacked(metadataURI, '/', Strings.toString(_tokenId), '.json'));
        // abi.encodePacked(...)의 역할은 metadataURI/105.json 처럼 표현함
        // string 으로 형변환을 시켜줌
    }
        
}
// is는 상속을 의미하는 코드
// memory 함수로 영구저장