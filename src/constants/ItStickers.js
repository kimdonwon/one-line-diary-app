import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

// 🎨 아이티 스티커팩 컴포넌트들 (Doodle Flash 스타일)
// - "No Outlines / Edgeless" 보다는 "카메라 아이콘 느낌의 Doodle Line Art" 요구사항 반영
// - 색상: 파스텔 톤 (바디), 둥근 선 처리, 반짝임(Flash Rays) 추가
const STROKE_COLOR = "#37352F";
const STROKE_WIDTH = "1.8";

const SvgBase = ({ size, children }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={STROKE_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
        {children}
    </Svg>
);

// 1. 스티커
export const ItSticker = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 2v2M8 4l1 1M16 4l-1 1" />
        <Path d="M6 7h12a2 2 0 0 1 2 2v7l-4 4H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" fill="#FFD485" />
        <Path d="M20 16l-4 4v-2a2 2 0 0 1 2-2h2z" fill="#FFF4E0" />
        <Circle cx="9" cy="12" r="0.8" fill={STROKE_COLOR} stroke="none" />
        <Circle cx="13" cy="12" r="0.8" fill={STROKE_COLOR} stroke="none" />
        <Path d="M10 15c.5.5 1.5.5 2 0" />
    </SvgBase>
);

// 2. 카메라
export const ItCamera = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 1.5v2M7.5 3.5l1.2 1.2M3.5 7l2 .5M16.5 3.5l-1.2 1.2M20.5 7l-2 .5" />
        <Path d="M9 9V7.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V9" fill="#8BBFEF" />
        <Rect x="3" y="9" width="18" height="12" rx="2.5" fill="#8BBFEF" />
        <Circle cx="12" cy="15" r="3.5" fill="#D6EFFF" />
        <Circle cx="12" cy="15" r="1.2" fill={STROKE_COLOR} stroke="none" />
        <Circle cx="18" cy="12" r="0.8" fill={STROKE_COLOR} stroke="none" />
    </SvgBase>
);

// 3. 노트북
export const ItLaptop = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 2v2M8 4l1 1M16 4l-1 1" />
        <Rect x="5" y="6" width="14" height="9" rx="1.5" fill="#BFFCC6" />
        <Path d="M3 15h18l1.5 3H1.5l1.5-3z" fill="#FFB3BA" />
        <Path d="M11 15h2" />
        <Circle cx="12" cy="10.5" r="0.8" fill={STROKE_COLOR} stroke="none" />
    </SvgBase>
);

// 4. 스마트폰
export const ItSmartphone = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M7 3l-.5-.5M17 3l.5-.5M3 12h2M19 12h2" />
        <Rect x="7" y="3" width="10" height="18" rx="2" fill="#E2F0CB" />
        <Rect x="8" y="5" width="8" height="12" rx="1" fill="#FFF" />
        <Circle cx="12" cy="19" r="1" fill={STROKE_COLOR} stroke="none" />
    </SvgBase>
);

// 5. 조이스틱
export const ItJoystick = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M15 2v2M20 5l-1.5 1.5" />
        <Rect x="4" y="10" width="16" height="10" rx="2" fill="#FFDFBA" />
        <Circle cx="8" cy="6" r="2.5" fill="#FFB3BA" />
        <Path d="M8 8.5V11" />
        <Circle cx="14" cy="14" r="1.5" fill="#8BBFEF" stroke="none" />
        <Circle cx="18" cy="15" r="1.5" fill="#BFFCC6" stroke="none" />
    </SvgBase>
);

// 6. 키보드
export const ItKeyboard = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 3v2M7 5l1 1M17 5l-1 1" />
        <Rect x="2" y="8" width="20" height="9" rx="1.5" fill="#FFB3BA" />
        <Rect x="5" y="11" width="3" height="2" rx="0.5" fill="#FFF" />
        <Rect x="9" y="11" width="3" height="2" rx="0.5" fill="#FFF" />
        <Rect x="13" y="11" width="3" height="2" rx="0.5" fill="#FFF" />
        <Rect x="17" y="11" width="2" height="2" rx="0.5" fill="#FFF" />
        <Rect x="7" y="14" width="10" height="1.5" rx="0.5" fill="#FFF" />
    </SvgBase>
);

// 7. 마우스
export const ItMouse = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 4v2M7 5l1 1M17 5l-1 1" />
        <Path d="M8 9a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0z" fill="#8BBFEF" />
        <Path d="M12 9v3" />
        <Path d="M8 12h8" />
        <Path d="M12 5C12 3 14 2 15 2" />
    </SvgBase>
);

// 8. 게임보이
export const ItGameboy = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 1v1.5M7 3l1 1M17 3l-1 1" />
        <Rect x="6" y="4" width="12" height="18" rx="1.5" fill="#FFD485" />
        <Rect x="8" y="6" width="8" height="6" rx="1" fill="#BFFCC6" />
        <Path d="M9 15v3m-1.5-1.5h3" />
        <Circle cx="16" cy="15" r="1" fill="#FFB3BA" stroke="none" />
        <Circle cx="14" cy="17" r="1" fill="#FFB3BA" stroke="none" />
    </SvgBase>
);

// 9. 헤드폰
export const ItHeadphones = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 2v2M6 4l1 1M18 4l-1 1" />
        <Path d="M5 12A7 7 0 0 1 19 12" />
        <Rect x="4" y="12" width="3" height="6" rx="1.5" fill="#E2F0CB" />
        <Rect x="17" y="12" width="3" height="6" rx="1.5" fill="#E2F0CB" />
    </SvgBase>
);

// 10. 스마트워치
export const ItSmartwatch = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 3v2M7 5l1 1M17 5l-1 1" />
        <Path d="M9 7v-3m6 3v-3" />
        <Path d="M9 17v3m6-3v3" />
        <Rect x="7" y="7" width="10" height="10" rx="2" fill="#8BBFEF" />
        <Circle cx="12" cy="12" r="1" fill="#FFF" stroke="none" />
        <Path d="M12 12l2 2" />
        <Path d="M17 10h1.5" />
    </SvgBase>
);

// 11. 플로피디스크
export const ItFloppy = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 2v2M6 4l1 1M18 4l-1 1" />
        <Path d="M6 7h10l3 3v10H6z" fill="#FFB3BA" />
        <Rect x="9" y="7" width="5" height="4" fill="#E2F0CB" />
        <Rect x="8" y="14" width="8" height="6" fill="#FFF" />
        <Path d="M9 16h6M9 18h6" />
    </SvgBase>
);

// 12. 태블릿
export const ItTablet = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 2v2M6 4l1 1M18 4l-1 1" />
        <Rect x="4" y="5" width="16" height="14" rx="1.5" fill="#FFDFBA" />
        <Rect x="6" y="7" width="12" height="10" rx="0.5" fill="#FFF" />
        <Circle cx="12" cy="12" r="1.5" fill="#8BBFEF" />
        <Path d="M11 20h2" />
    </SvgBase>
);

// 13. 마이크
export const ItMicrophone = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 2v2M6 4l1 1M18 4l-1 1" />
        <Rect x="10" y="5" width="4" height="9" rx="2" fill="#BFFCC6" />
        <Path d="M8 10v2a4 4 0 0 0 8 0v-2" />
        <Path d="M12 16v4" />
        <Path d="M9 20h6" />
    </SvgBase>
);

// 14. 스피커
export const ItSpeaker = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 1v2M6 3l1 1M18 3l-1 1" />
        <Rect x="6" y="5" width="12" height="16" rx="1.5" fill="#8BBFEF" />
        <Circle cx="12" cy="10" r="2.5" fill="#FFF" />
        <Circle cx="12" cy="17" r="2" fill="#FFF" />
    </SvgBase>
);

// 15. 배터리
export const ItBattery = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 3v2M7 5l1 1M17 5l-1 1" />
        <Rect x="5" y="8" width="14" height="8" rx="1.5" fill="#BFFCC6" />
        <Path d="M19 10h1.5v4H19" />
        <Path d="M8 12h2M9 11v2" />
        <Path d="M14 12h2" />
    </SvgBase>
);

// 16. 카세트테이프
export const ItCassette = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 2v2M6 4l1 1M18 4l-1 1" />
        <Rect x="4" y="7" width="16" height="10" rx="1.5" fill="#FFD485" />
        <Rect x="7" y="10" width="10" height="4" rx="1" fill="#FFF" />
        <Circle cx="9" cy="12" r="1" fill="#FFB3BA" stroke="none" />
        <Circle cx="15" cy="12" r="1" fill="#FFB3BA" stroke="none" />
    </SvgBase>
);

// 17. VR기기
export const ItVr = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 3v2M7 5l1 1M17 5l-1 1" />
        <Rect x="4" y="8" width="16" height="8" rx="2" fill="#8BBFEF" />
        <Path d="M3 12h2M19 12h2" />
        <Rect x="8" y="10" width="8" height="4" rx="1" fill="#FFF" />
    </SvgBase>
);

// 18. 모니터
export const ItMonitor = ({ size = 24 }) => (
    <SvgBase size={size}>
        <Path d="M12 2v2M6 4l1 1M18 4l-1 1" />
        <Rect x="3" y="5" width="18" height="12" rx="1" fill="#FFB3BA" />
        <Rect x="5" y="7" width="14" height="8" fill="#FFF" />
        <Path d="M12 17v4" />
        <Path d="M8 21h8" />
    </SvgBase>
);
