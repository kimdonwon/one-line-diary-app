import React from 'react';
import Svg, { Path } from 'react-native-svg';

// 투박하고 삐뚤삐뚤한 느낌을 살리기 위해
const STROKE_COLOR = "#37352F";
const STROKE_WIDTH = "1.2";

// 1. 웃음 (Smile Face) - 찌그러진 원, 삐뚤한 눈코입
export const LineSmile = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4.5 11.5C4 6.5 8 3.5 13 4C18.5 4.5 20.5 9.5 19.5 15C18.5 20 12.5 21.5 7.5 19.5C3.5 17.5 5 14.5 4.5 11.5Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8.5 11.5C9 10.5 10 10.5 10 11.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M14.5 11.5C15 10.5 16 10.5 16 11.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M9 15.5C11 17 14 17 16 14.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 2. 슬픔 (Sad Face) - 찌그러진 원, 울상
export const LineSad = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4.5 12.5C4 18 9 20.5 14 19.5C19 18.5 20.5 13 19 8C17.5 3.5 10.5 3.5 6 7.5C3.5 9.5 5 11.5 4.5 12.5Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M7 11C8 10 9 11 9.5 10.5M14.5 11C15.5 10 16.5 11 17 10.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M9 16C11 14.5 14 14.5 16 16.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M8 13.5C8.5 15 7.5 16 8 17" stroke={STROKE_COLOR} strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />
        <Path d="M16 14C15.5 15.5 16.5 16 16 17" stroke={STROKE_COLOR} strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />
    </Svg>
);

// 3. 화남 토끼 (Angry Rabbit) - 레퍼런스 스타일 완벽 반영
export const LineAngryRabbit = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 삐뚤빼뚤한 얼굴 윤곽과 두 귀 */}
        <Path d="M6 14C4.5 18.5 7.5 21 12 21.5C16.5 22 20 19 19 14.5C18 10.5 16 9.5 15 9.5C15 9.5 15.5 5.5 15 3.5C14 0.5 12.5 1.5 11.5 4.5C11 6 11 8.5 11 8.5C11 8.5 10 5.5 9 4C7 1 6.5 1.5 6.5 4.5C6.5 7.5 7 10.5 7 10.5C6 11 7 11 6 14Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        {/* 화난 눈썹과 눈 */}
        <Path d="M7.5 14.5L9.5 15.5C9.5 15.5 9.5 16 9 16" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16 14L14 15.5C14 15.5 14 16 14.5 16" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        {/* 삐뚤어진 입 */}
        <Path d="M11.5 17L12.5 18L13.5 17" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 4. 하트선 (Heart Outline) - 얇고 엉성한 선
export const LineHeart = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M11.5 20.5C10 19.5 4 15 3.5 10.5C3 6.5 6 4 8.5 5.5C10 6.5 11 8 11.5 8.5C12.5 7.5 14 5 16.5 4.5C19.5 4 21.5 6.5 20.5 10.5C19.5 15 13.5 19 12.5 20.5C12 21 11.5 20.5 11.5 20.5Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 5. 꽃 (Flower) - 레퍼런스 스타일 낙서 꽃
export const LineFlower = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 꽃잎 잎장 하나하나 삐뚤빼뚤하게 */}
        <Path d="M12 12C12 10 10.5 8.5 9 9C7.5 9.5 8 11.5 9.5 12C8 13.5 7.5 15.5 9 16C10.5 16.5 12 14 12 12Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 12C14 12 15.5 13.5 15 15C14.5 16.5 12.5 16 12 14.5C10.5 16 8.5 16.5 8 15C7.5 13.5 10 12 12 12Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 12C12 14 13.5 15.5 15 15C16.5 14.5 16 12.5 14.5 12C16 10.5 16.5 8.5 15 8C13.5 7.5 12 10 12 12Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 12C10 12 8.5 10.5 9 9C9.5 7.5 11.5 8 12 9.5C13.5 8 15.5 7.5 16 9C16.5 10.5 14 12 12 12Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        {/* 가운데 분홍색 수술 점 */}
        <Path d="M11.5 12.5C11.5 12 12.5 12 12.5 12.5C12.5 13 11.5 13 11.5 12.5Z" fill="#FF85C0" />
    </Svg>
);

// 6. 왕관 (Crown) - 찌그러지고 모서리가 안맞는 왕관
export const LineCrown = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 17.5L4.5 7.5L9 12.5L12.5 5.5L15.5 11.5L20 6.5L19.5 18C16 19 8 19 4 17.5Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5 14.5C8 15 15 15 18.5 14" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4 4C4.5 4.5 3.5 5 4 4ZM12.5 2C13 2.5 12 3 12.5 2ZM20 4C20.5 4.5 19.5 5 20 4Z" stroke={STROKE_COLOR} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

// 7. 카메라 (Camera)
export const LineCamera = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M3.5 9.5C6 9 17 8.5 20.5 9.5C21 13 21 17 20 19C15 20 8 19.5 4 18.5C3 15 3 12 3.5 9.5Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 18C14.5 17.5 15.5 15 15 13C14.5 10.5 12 11 10 12C8.5 13.5 9.5 16.5 12 18Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M7 9C7 7 8 5 10 5.5C10.5 5.5 13 5 15 6C15.5 7 16 8 15.5 9M17.5 12C18 12.5 17 13 17.5 12Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 8. 따봉 (Thumbs Up)
export const LineThumbsUp = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M7.5 20C7 16 7.5 12 8 10C10.5 9.5 11 7 12 4C13 2 15 3 14 5.5C13.5 8 13.5 9 15 9.5C16.5 9.5 20.5 10 20 13C19.5 16 20.5 18 19 19.5C17 21.5 10.5 21 7.5 20Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4 11C6 11.5 5.5 19.5 5 19" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M20 15C19 15.5 18 15 18 15M19.5 17C18.5 17.5 18 17 18 17" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 9. 구름 (Cloud) - 뭉게뭉게 삐뚤어짐
export const LineCloud = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M7 16C3 16 3 11 5 9C5 6 10 4 13 6C15 4 19 5 19.5 8C22 9 22 14 18 16C15 17 10 17 7 16Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 10. 말풍선 (Bubble) - 레퍼런스의 넓적한 말풍선
export const LineBubble = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4.5 11C3 7 7 4 13 4C19 4 22 7.5 21.5 12C21 16 17 18 13 18C11.5 18 10.5 17.5 10 17.5C9 18 7.5 19.5 6 19.5C6.5 18 7 17 7 16C4.5 15 5.5 13 4.5 11Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 11. 반짝이 (Sparkle) - 세 개의 불규칙한 빛무리
export const LineSparkle = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 4C11.5 8 10 9.5 6 9.5C10 10 11.5 12 12 16C12.5 12 14 10 18 9.5C14 9 12.5 8 12 4Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5.5 16C5 17 4 17.5 3 17.5C4 18 5 18.5 5.5 19.5C6 18.5 7 18 8 17.5C7 17 6 16.5 5.5 16Z" stroke={STROKE_COLOR} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M18.5 14C18 15 17.5 15.5 16.5 15.5C17.5 16 18 16.5 18.5 17.5C19 16.5 19.5 16 20.5 15.5C19.5 15 19 14.5 18.5 14Z" stroke={STROKE_COLOR} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 12. 꼬불 동그라미 (Scribble Circle) - 대충 휘갈긴 원
export const LineCircle = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M11 4.5C15 4 20 6 20.5 11C21 17 15 20 10 19.5C5 19 3 14 4 9C5 5 10 4.5 13 5C16 5.5 18 7 18 7" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 13. 네모 꾸밈 (Square) - 삐뚤거리는 모서리
export const LineSquare = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M5.5 5.5C8 4.5 16 5 18.5 5C19.5 8 19 16 19 18.5C15 19.5 8 19 5.5 19C4.5 15 5 8 5.5 5.5Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 14. 고양이 (Cat Face) - 레퍼런스 스타일 완벽 반영 (!=0_0=!)
export const LineCat = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 눌린 호빵같은 삐뚤한 얼굴형과 귀 */}
        <Path d="M6 16C5.5 18 7.5 21.5 12 21.5C16.5 21.5 19.5 18 18.5 15C18.5 14 18 12.5 18 12C18 11.5 18 8 16.5 8C15 8 14 10.5 14 10.5C13 10 11 10 9 10.5C9 10.5 8 8.5 6.5 9C5 9.5 5.5 12.5 5.5 13C5.5 14 6 15 6 16Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        {/* ^ ^ 감은 눈 */}
        <Path d="M8 15C8.5 13.5 10 13.5 10.5 14.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14 14.5C14.5 13.5 16 13.5 16.5 15" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        {/* ω 입 */}
        <Path d="M11 16L12 17L13 16" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        {/* 수염 살짝 */}
        <Path d="M7 16L5.5 16.5M7 17L5.5 17.5M17 16L18.5 16.5M17 17L18.5 17.5" stroke={STROKE_COLOR} strokeWidth="0.8" strokeLinecap="round" />
    </Svg>
);

// 15. 나뭇잎 (Leaf / Branch) - 엉성한 줄기와 잎
export const LineLeaf = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 21C11.5 15 12 9 13 4" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M12.5 16C15.5 15 17 13 17 11C15 10 13 13 12.5 16Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M12 12C9 11 7 9 7 7C9 6 11 9 12 12Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M12.5 8C15 7 16 5 15 3C13 3 12 5 12.5 8Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
        <Path d="M11.5 19C9 18 7 16 8 14C10 14 11 16 11.5 19Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
    </Svg>
);

// 16. 천사 날개 (Wing) - 삐뚤빼뚤 대충 그린 깃털
export const LineWing = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M5 13C8 12 11 8 16 5C19 4 20 6.5 18 8.5C19.5 9.5 19 11 17 11.5C18 13 17.5 15 15 15C13 15 10.5 18 5 13Z" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 17. 강조점선 (Dash Element) - 불규칙한 선들 묶음
export const LineDash = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M11.5 4.5V6M12 17.5V19.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M4.5 12.5L6 12M17.5 11.5L20 12" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M6.5 7L7.5 8M16 16.5L17.5 18" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M17 7L16 8.5M7 16L6 17" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 18. 강조 (Highlight Lines) - 대충 휘갈긴 3줄
export const LineHighlight = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4.5 10.5C8 10 11 8.5 14 4.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M7 14C10.5 13.5 14 11.5 17 7.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M9.5 17.5C13 17 16 15 19 11" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);
