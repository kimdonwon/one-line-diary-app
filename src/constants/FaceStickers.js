import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

const STROKE_COLOR = "#2C2A29";
const STROKE_WIDTH = "2";

// 얼굴 공통 색상
const SKIN_LIGHT = "#FDE2D3";
const SKIN_TAN = "#E8B291";
const SKIN_DARK = "#A06B50";
const BLUSH = "#FF9B9B";

// 레퍼런스의 도톰한 펜선 질감을 표현하기 위해 strokeLinecap과 strokeLinejoin을 round로 설정

export const FaceBoyBrown = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 얼굴형 */}
        <Path d="M6 11C6 16 8 20 12 20C16 20 18 16 18 11V9H6V11Z" fill={SKIN_LIGHT} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 머리카락 (밤송이 머리) */}
        <Path d="M5 9C4.5 7 5.5 3 12 3C18.5 3 19.5 7 19 9C15 9.5 9 9.5 5 9Z" fill="#C06B3E" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M8 3.5L8.5 6M11.5 3L12 6M15 3.5L14.5 6M18 5L17 7M6 5L7 7" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        {/* 눈, 코, 입, 볼터치 */}
        <Circle cx="9" cy="13" r="0.8" fill={STROKE_COLOR} />
        <Circle cx="15" cy="13" r="0.8" fill={STROKE_COLOR} />
        <Path d="M11 15C11.5 16 12.5 16 13 15" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <Ellipse cx="7.5" cy="14.5" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
        <Ellipse cx="16.5" cy="14.5" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
    </Svg>
);

export const FaceGirlPink = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M5.5 11C5.5 16.5 7.5 20.5 12 20.5C16.5 20.5 18.5 16.5 18.5 11C18.5 9 17 8 17 8C14 8 10 9 5.5 8C5.5 8 5.5 9 5.5 11Z" fill={SKIN_LIGHT} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 양갈래 머리 (핑크색) */}
        <Path d="M12 2.5C17 2.5 19 5.5 19 8C19 8 17 8 17 8C14 8 10 9 5.5 8C5.5 8 5 5.5 12 2.5Z" fill="#F48FB1" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M4 8C3 9 2.5 11 3 13C3.5 14.5 5 14 5 12.5C5 11 5.5 8 5.5 8L4 8Z" fill="#F48FB1" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M20 8C21 9 21.5 11 21 13C20.5 14.5 19 14 19 12.5C19 11 18.5 8 18.5 8L20 8Z" fill="#F48FB1" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 앞머리 디테일 */}
        <Path d="M9 3.5C9.5 5 10 8 10 8" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M15 3.5C14.5 5 14 8 14 8" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        {/* 이목구비 */}
        <Circle cx="9.5" cy="13.5" r="0.8" fill={STROKE_COLOR} />
        <Circle cx="14.5" cy="13.5" r="0.8" fill={STROKE_COLOR} />
        <Path d="M12 15C12 15 12.5 15.5 13 15" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <Ellipse cx="7.5" cy="15" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
        <Ellipse cx="16.5" cy="15" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
    </Svg>
);

export const FaceGirlBrownHair = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 얼굴 */}
        <Path d="M6 10C6 16 8 19.5 12 19.5C16 19.5 18 16 18 10V8H6V10Z" fill={SKIN_LIGHT} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 갈색 머리 */}
        <Path d="M5 10C4 5 7 2 12 2C17 2 20 5 19 10C18.5 12.5 16.5 12.5 17 10C17.5 8 16 5 12 5C8 5 6.5 8 7 10C7.5 12.5 5.5 12.5 5 10Z" fill="#4B3D3A" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />

        {/* 귀여운 점눈, 잔잔한 미소 */}
        <Circle cx="9.5" cy="13" r="0.8" fill={STROKE_COLOR} />
        <Circle cx="14.5" cy="13" r="0.8" fill={STROKE_COLOR} />
        <Path d="M11 16H13" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
);

export const FaceBoyCap = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 10C6 15 8 19 12 19C16 19 18 15 18 10H6Z" fill={SKIN_LIGHT} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 모자 */}
        <Path d="M5 9C5 5 8 3 12 3C16 3 19 5 19 9L21 9.5L5 9Z" fill="#3A86FF" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 선글라스 */}
        <Path d="M6.5 12C6.5 12 8 10 10.5 12C10.5 12 10.5 13.5 8.5 13.5C6.5 13.5 6.5 12 6.5 12Z" fill="#2C2A29" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinejoin="round" />
        <Path d="M13.5 12C13.5 12 15 10 17.5 12C17.5 12 17.5 13.5 15.5 13.5C13.5 13.5 13.5 12 13.5 12Z" fill="#2C2A29" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinejoin="round" />
        <Path d="M10.5 11.5H13.5" stroke={STROKE_COLOR} strokeWidth="1.5" />
        {/* 입 */}
        <Path d="M11.5 16C12 16.5 12.5 16.5 13 16" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
);

export const FaceTanGirl = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M5.5 11C5.5 16 7.5 20.5 12 20.5C16.5 20.5 18.5 16 18.5 11H5.5Z" fill={SKIN_TAN} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 앞머리 & 긴 머리 (갈색) */}
        <Path d="M4 11C4 7 7 4 12 4C17 4 20 7 20 11C20.5 14 21 16 20 18C19 18 19 15 18.5 11C18.5 9 17 7 12 7C7 7 5.5 9 5.5 11C5 15 5 18 4 18C3 16 3.5 14 4 11Z" fill="#79443B" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M5.5 11C6.5 8 9 7 12 7C14 8 16 9 18.5 11" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} fill="none" />
        {/* 헤어밴드 노란색 */}
        <Path d="M5.5 9C7 8.5 9 8.5 12 8.5C15 8.5 17 8.5 18.5 9" stroke="#FFD166" strokeWidth="2.5" />
        {/* 눈코입 */}
        <Circle cx="9.5" cy="13.5" r="0.8" fill={STROKE_COLOR} />
        <Circle cx="14.5" cy="13.5" r="0.8" fill={STROKE_COLOR} />
        <Path d="M11 16.5C11.5 17 12.5 17 13 16.5" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <Ellipse cx="7.5" cy="14.5" rx="1.5" ry="1" fill="#FF7F7F" opacity="0.6" />
        <Ellipse cx="16.5" cy="14.5" rx="1.5" ry="1" fill="#FF7F7F" opacity="0.6" />
        {/* 귀고리 */}
        <Circle cx="6" cy="16" r="1.5" fill="#FFD166" stroke={STROKE_COLOR} strokeWidth="1" />
        <Circle cx="18" cy="16" r="1.5" fill="#FFD166" stroke={STROKE_COLOR} strokeWidth="1" />
    </Svg>
);

export const FaceAfroDark = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 거대한 아프로 헤어 */}
        <Path d="M6 13C2 13 1 8 4 6C3 3 6 1 10 1.5C12 -0.5 16 0 18 2C21 2 23 5 21 8C23 11 20 14 17 13C17 15 15 16 12 16C9 16 7 15 6 13Z" fill={STROKE_COLOR} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />

        {/* 노란 귀걸이 */}
        <Circle cx="8" cy="16" r="1.5" fill="#F4D969" stroke={STROKE_COLOR} strokeWidth="1.2" />
        <Circle cx="16" cy="16" r="1.5" fill="#F4D969" stroke={STROKE_COLOR} strokeWidth="1.2" />

        {/* 갈색 얼굴 */}
        <Path d="M7.5 11C7.5 15 9 17.5 12 17.5C15 17.5 16.5 15 16.5 11C16.5 8.5 14.5 7 12 7C9.5 7 7.5 8.5 7.5 11Z" fill={SKIN_TAN} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />

        {/* 이목구비 */}
        <Circle cx="10" cy="12.5" r="0.8" fill={STROKE_COLOR} />
        <Circle cx="14" cy="12.5" r="0.8" fill={STROKE_COLOR} />
        {/* 작게 벌린 입 */}
        <Ellipse cx="12" cy="15.5" rx="1" ry="0.6" fill={STROKE_COLOR} />
    </Svg>
);

export const FaceGirlBlueHair = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6.5 11C6.5 16 8 20.5 12 20.5C16 20.5 17.5 16 17.5 11H6.5Z" fill={SKIN_LIGHT} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 단발 머리 통 */}
        <Path d="M5 12C4 10 5 4 12 4C19 4 20 10 19 12V18C19 19 17 19 17 18C17 19 14 19 14 18V8C14 8 13.5 8.5 12 8.5C10.5 8.5 10 8 10 8V18C10 19 7 19 7 18C7 19 5 19 5 18V12Z" fill="#118AB2" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Circle cx="9" cy="13.5" r="0.8" fill={STROKE_COLOR} />
        <Circle cx="15" cy="13.5" r="0.8" fill={STROKE_COLOR} />
        <Path d="M11 16H13" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <Ellipse cx="7.5" cy="14.5" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
        <Ellipse cx="16.5" cy="14.5" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
    </Svg>
);

export const FaceBearHat = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 얼굴 */}
        <Path d="M6 13C6 17.5 8 20 12 20C16 20 18 17.5 18 13H6Z" fill={SKIN_LIGHT} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 곰돌이 모자 */}
        <Path d="M5 13C5 7 7 4 12 4C17 4 19 7 19 13H5Z" fill="#FFFBEB" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M6 7C5 5 2 6 3 9C3.5 10 5 9 6 8Z" fill="#FFFBEB" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M18 7C19 5 22 6 21 9C20.5 10 19 9 18 8Z" fill="#FFFBEB" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 모자 이목구비 */}
        <Circle cx="10" cy="8" r="0.8" fill={STROKE_COLOR} />
        <Circle cx="14" cy="8" r="0.8" fill={STROKE_COLOR} />
        <Ellipse cx="12" cy="10" rx="1.5" ry="1" fill={STROKE_COLOR} />

        <Circle cx="9.5" cy="15.5" r="0.8" fill={STROKE_COLOR} />
        <Circle cx="14.5" cy="15.5" r="0.8" fill={STROKE_COLOR} />
        <Path d="M12 17C12.5 17.5 13 17 12 16.5" fill={STROKE_COLOR} />
        <Ellipse cx="7.5" cy="16.5" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
        <Ellipse cx="16.5" cy="16.5" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
    </Svg>
);

export const FaceBaby = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 아주 둥근 아기 얼굴 */}
        <Path d="M5 12C5 18 8 21.5 12 21.5C16 21.5 19 18 19 12C19 6 15 5 12 5C9 5 5 6 5 12Z" fill={SKIN_LIGHT} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 배내머리 */}
        <Path d="M11 5C11.5 3 12.5 3 13 5M12 5C12.5 4 13.5 4 14 5" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        {/* 눈물방울 눈 */}
        <Path d="M8.5 13.5C9 13 9.5 13 10 13.5" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M14 13.5C14.5 13 15 13 15.5 13.5" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        {/* 쪽쪽이 */}
        <Ellipse cx="12" cy="16" rx="2" ry="1.5" fill="#EF476F" stroke={STROKE_COLOR} strokeWidth="1" />
        <Circle cx="12" cy="16" r="0.6" fill="#FFF" />
        <Ellipse cx="7" cy="14" rx="2" ry="1" fill={BLUSH} opacity="0.8" />
        <Ellipse cx="17" cy="14" rx="2" ry="1" fill={BLUSH} opacity="0.8" />
    </Svg>
);

export const FaceCoolBoy = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 턱선 있는 얼굴 */}
        <Path d="M6.5 10C6.5 15 8 19.5 12 19.5C16 19.5 17.5 15 17.5 10H6.5Z" fill={SKIN_LIGHT} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 반깐 머리 (은발) */}
        <Path d="M5.5 10C5 6 8 3 12 3C16 3 19 6 18.5 10C17 10 16 5.5 12 5.5C8 5.5 7 10 5.5 10Z" fill="#E2E8F0" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 옆머리 포인트 */}
        <Path d="M6 10L6.5 12M18 10L17.5 12" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M12 5.5C11.5 7 10 9 8 9.5" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />

        {/* 일자눈 */}
        <Path d="M8.5 13H10.5M13.5 13H15.5" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M11.5 16H12.5" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
);

export const FaceHappyGirl = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 12C6 17 8 21 12 21C16 21 18 17 18 12H6Z" fill={SKIN_LIGHT} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 땋은 머리 (갈색) */}
        <Path d="M5 12C3 12 3 7 7 5C10 3.5 14 3.5 17 5C21 7 21 12 19 12C18 7 16 5 12 5C8 5 6 7 5 12Z" fill="#A47148" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Ellipse cx="5" cy="14" rx="1.5" ry="2" fill="#A47148" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <Ellipse cx="4" cy="18" rx="1.5" ry="2" fill="#A47148" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <Ellipse cx="19" cy="14" rx="1.5" ry="2" fill="#A47148" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <Ellipse cx="20" cy="18" rx="1.5" ry="2" fill="#A47148" stroke={STROKE_COLOR} strokeWidth="1.5" />
        <Path d="M4 16H6M18 16H20" stroke="#FF5D8F" strokeWidth="1.5" />
        {/* 앞머리 */}
        <Path d="M7 5C7 8 9 9 12 9C15 9 17 8 17 5" fill="#A47148" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinejoin="round" />

        <Path d="M8.5 14C9 13.5 10 13.5 10.5 14M13.5 14C14 13.5 15 13.5 15.5 14" stroke={STROKE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M11 16C11 17 13 17 13 16Z" fill={BLUSH} stroke={STROKE_COLOR} strokeWidth="1" strokeLinejoin="round" />
        <Ellipse cx="7" cy="15.5" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
        <Ellipse cx="17" cy="15.5" rx="1.5" ry="1" fill={BLUSH} opacity="0.6" />
    </Svg>
);

export const FaceHeadphones = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 11C6 16 8 20 12 20C16 20 18 16 18 11V9H6V11Z" fill={SKIN_TAN} stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 짧은 머리 */}
        <Path d="M6 9C6 5 8 4 12 4C16 4 18 5 18 9C15 8 9 8 6 9Z" fill="#1B1A17" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        {/* 헤드폰 밴드 */}
        <Path d="M5 11C5 5 8 2.5 12 2.5C16 2.5 19 5 19 11" stroke={STROKE_COLOR} strokeWidth="2.5" strokeLinecap="round" />
        {/* 헤드폰 이어컵 */}
        <Path d="M4 10C5 10 6 11 6 13C6 15 5 16 4 16C3 16 2 15 2 13C2 11 3 10 4 10Z" fill="#FF5D8F" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M20 10C19 10 18 11 18 13C18 15 19 16 20 16C21 16 22 15 22 13C22 11 21 10 20 10Z" fill="#FF5D8F" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />

        <Circle cx="9" cy="13.5" r="0.8" fill={STROKE_COLOR} />
        <Circle cx="15" cy="13.5" r="0.8" fill={STROKE_COLOR} />
        <Path d="M11 16.5C11.5 17 12.5 17 13 16.5" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
);
