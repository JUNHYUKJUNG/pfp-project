/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

// tailwind.config.js 파일입니다.
// 이 파일은 Tailwind CSS의 구성을 정의하는 파일입니다.
//
// @type {import('tailwindcss').Config}
// 이 파일은 tailwindcss.Config 타입을 가지고 있습니다.
// 이 타입은 Tailwind CSS의 구성을 정의하는 객체입니다.
//
// content: ["./src/**/*.{js,jsx,ts,tsx}"]
// Tailwind CSS가 적용될 파일 경로를 설정합니다.
// "./src/**/*.{js,jsx,ts,tsx}"는 src 폴더 내의 모든 js, jsx, ts, tsx 파일을 대상으로 합니다.
//
// theme: {
//   extend: {}
// }
// Tailwind CSS의 테마를 확장하는 설정입니다.
// 현재는 테마를 확장하는 내용이 없으므로 빈 객체로 설정되어 있습니다.
//
// plugins: []
// Tailwind CSS의 플러그인을 설정합니다.
// 현재는 플러그인을 사용하지 않으므로 빈 배열로 설정되어 있습니다.
//
// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
