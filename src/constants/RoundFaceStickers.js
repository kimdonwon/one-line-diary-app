import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

const STROKE_COLOR = "#2C2A29";
const STROKE_WIDTH = "1.5";
const WHITE_STROKE = "#FFFFFF";

// Color Palette from the reference image
const C_ORANGE = "#FFCFA1";
const C_YELLOW = "#FFF08E";
const C_PINK = "#F3ACF3";
const C_PURPLE = "#D2B3F0";
const C_BEIGE = "#E8D8C8"; // Warm latte/beige for our app
const C_BLUE = "#9DBBF5";
const C_MINT = "#A1E6CA";
const C_GREEN = "#C0E8BF";

// Wobbly Blob Paths for hand-drawn look
const BLOB_1 = "M12 2C7 2 2 6 2 12C2 17 6 22 12 22C18 22 22 18 22 12C22 7 17 2 12 2Z";
const BLOB_2 = "M12 1.5C8 2 2 6.5 2.5 12C3 18 8 22.5 12 22C17 21.5 22 18 21.5 12C21 6 16 2.5 12 1.5Z";
const BLOB_3 = "M12 2C5 2.5 1.5 7 2.5 12C3.5 17 6.5 21.5 12 21.5C18 21.5 22 17 21 12C20 6 18 1.5 12 2Z";
const BLOB_4 = "M12 2.5C6.5 2.5 2 6 2.5 11.5C3 17 6.5 21.5 12 21.5C17.5 21.5 21.5 17.5 21.5 12C21.5 6.5 17 2.5 12 2.5Z";

const FaceEye = ({ cx, cy, fill }) => (
    <Circle cx={cx} cy={cy} r="0.9" fill={fill || STROKE_COLOR} />
);

// 1. Orange Wobbly mouth
export const RfOrangeWobbly = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_1} fill={C_ORANGE} />
        <FaceEye cx="8" cy="11" />
        <FaceEye cx="14" cy="11" />
        <Path d="M7 16C8 14 9 17 10 16C11 15 12 17 13 16C14 15 15 17 16 16" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 2. Yellow Squint (>< face with zigzag mouth)
export const RfYellowSquint = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_2} fill={C_YELLOW} />
        {/* Left Eye > */}
        <Path d="M7 10.5L10 12L7 13.5" fill="none" stroke={STROKE_COLOR} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        {/* Right Eye < */}
        <Path d="M17 10.5L14 12L17 13.5" fill="none" stroke={STROKE_COLOR} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        {/* Zig-Zag Mouth */}
        <Path d="M8.5 16.5L9.5 15.5L10.5 16.5L11.5 15.5L12.5 16.5L13.5 15.5L14.5 16.5L15.5 15.5" fill="none" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 3. Pink Straight
export const RfPinkStraight = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_3} fill={C_PINK} />
        <FaceEye cx="9.5" cy="12" />
        <FaceEye cx="15.5" cy="11.5" />
        <Path d="M12 13V13.5" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <Path d="M9 16L16 15.5" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 4. Purple Smile
export const RfPurpleSmile = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_4} fill={C_PURPLE} />
        <FaceEye cx="9" cy="12" />
        <FaceEye cx="15" cy="11" />
        <Path d="M12 12.5L11.5 14" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <Path d="M10 16C12 17.5 14 17 15 15" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 5. Beige Sad (Warm tone instead of gray)
export const RfBeigeSad = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_2} fill={C_BEIGE} />
        <FaceEye cx="10" cy="11" />
        <FaceEye cx="15" cy="12" />
        <Path d="M15 16C14 14.5 12 14.5 11 16" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 6. Pink Open Mouth
export const RfPinkOpen = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_1} fill={C_PINK} />
        <FaceEye cx="8" cy="12" />
        <FaceEye cx="13" cy="12" />
        <Path d="M10 15C8 15 9 18 11 18C13 18 14 15 10 15Z" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
    </Svg>
);

// 7. Purple Frown
export const RfPurpleFrown = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_3} fill={C_PURPLE} />
        <FaceEye cx="9.5" cy="12" />
        <FaceEye cx="15.5" cy="12" />
        <Path d="M10 16C12 14.5 14 14.5 15 16" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 8. Green Sleepy (∪ ∪ face with straight mouth)
export const RfGreenSleepy = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_4} fill={C_GREEN} />
        {/* Sleepy Eyes ∪ ∪ */}
        <Path d="M7.5 10.5C8 11.5 9 11.5 9.5 10.5" stroke={STROKE_COLOR} strokeWidth="1.1" strokeLinecap="round" />
        <Path d="M14.5 10.5C15 11.5 16 11.5 16.5 10.5" stroke={STROKE_COLOR} strokeWidth="1.1" strokeLinecap="round" />
        {/* Straight Mouth _ */}
        <Path d="M10.5 16H13.5" stroke={STROKE_COLOR} strokeWidth="1.1" strokeLinecap="round" />
    </Svg>
);

// 9. Blue Vertical Open
export const RfBlueSurprise = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_2} fill={C_BLUE} />
        <FaceEye cx="9.5" cy="13" />
        <FaceEye cx="14" cy="13" />
        <Path d="M12 15C11 15 11 18 12 18C13 18 13 15 12 15Z" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
    </Svg>
);

// 10. Yellow Side Smile
export const RfYellowSideSmile = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_1} fill={C_YELLOW} />
        <FaceEye cx="11.5" cy="12" />
        <FaceEye cx="15.5" cy="12" />
        <Path d="M9 15C12 17.5 15 17 16 15" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
        <Path d="M16 15L16.5 14" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 11. Green Smile
export const RfGreenSmile = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_3} fill={C_GREEN} />
        <FaceEye cx="9" cy="12" />
        <FaceEye cx="14.5" cy="11" />
        <Path d="M11 14.5C12.5 16 14 15 14.5 14" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 12. Mint O
export const RfMintO = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_4} fill={C_MINT} />
        <FaceEye cx="9" cy="12" />
        <FaceEye cx="15" cy="11.5" />
        <Path d="M11 13V14" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <Circle cx="12" cy="16" r="1.5" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
    </Svg>
);

// 13. Beige Triangle Open
export const RfBeigeTriangle = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_1} fill={C_BEIGE} />
        <FaceEye cx="8" cy="12" />
        <FaceEye cx="12.5" cy="12" />
        <Path d="M8 15L12.5 15L10 19Z" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 14. Mint D Open
export const RfMintD = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_2} fill={C_MINT} />
        <FaceEye cx="10" cy="12" />
        <FaceEye cx="14" cy="12" />
        <Path d="M10 14H14V16C14 17 10 17 10 16Z" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 15. Orange Side Sad
export const RfOrangeSad = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_3} fill={C_ORANGE} />
        <FaceEye cx="12" cy="12" />
        <FaceEye cx="16" cy="12" />
        <Path d="M11 17C14 14 16 15 17 16L17 17" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 16. Blue Wide Smile
export const RfBlueWideSmile = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_4} fill={C_BLUE} />
        <FaceEye cx="10" cy="12" />
        <FaceEye cx="14" cy="12" />
        <Path d="M11.5 13V14" stroke={STROKE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <Path d="M8 16C10 18 13 18 14 16" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);

// 17. Yellow Dot Mouth
export const RfYellowDot = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_1} fill={C_YELLOW} />
        <FaceEye cx="9" cy="12" />
        <FaceEye cx="15" cy="12" />
        <Circle cx="12" cy="15" r="1" fill={STROKE_COLOR} />
    </Svg>
);

// 18. Purple Small Smile
export const RfPurpleSmallSmile = ({ size = 28 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={BLOB_2} fill={C_PURPLE} />
        <FaceEye cx="10" cy="11.5" />
        <FaceEye cx="14" cy="11.5" />
        <Path d="M11 15C11.5 16 12.5 16 13 15" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </Svg>
);
