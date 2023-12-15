# PFP Project

Mint NFT Contract Address - 0x0bA858F107717Ce070e37339d2F09552173461b1

Sale NFT Contract Address -
0xC8FA584579bF052e454Ef0195e17cb8FEC207051

리믹스로 스마트컨트랙트 만들고
CRA - frontend 생성
모두다 git으로 하기 위해
gitignore
: .env .deps artifacts 추가
readme.md
: contract 주소

Tailwind 설치 react router dom 설치
레이아웃 작업
: 메타마스크 세팅, 웹3 세팅

Header는 타입 지정하고 props로 받아주면 됨
outlet은 레이아웃에 있는 값들에 접근하기 위해서는 리액트라우터돔에서 제공하는 outlet context기능활용(전역상태변수)

사용하는 위치에서 useOutletContext로 꺼내오기만 하면 됨. 제네릭으로 <OutletContext> 꺼내오면 됨.

그 후 기능들을 하나하나씩 붙여나가면 됨
Ex) mint modal 기능
