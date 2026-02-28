import React from 'react';
import Svg, { Path, Circle, Rect, Ellipse, G, Polygon } from 'react-native-svg';

// 1. 도넛 (Donut)
export const FoodDonut = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill="#F4B969" />
        <Path d="M4 11C4.5 6 8.5 3 13 4C17 5 19 9 18 13C17 18 11 19 6 16C4 14.5 3.5 12.5 4 11Z" fill="#F48498" />
        <Circle cx="12" cy="12" r="3.5" fill="#FFFFFF" />
        <Rect x="8" y="7" width="2.5" height="1.5" rx="0.75" fill="#FFFFFF" transform="rotate(20 8 7)" />
        <Rect x="14" y="6" width="2.5" height="1.5" rx="0.75" fill="#FFD166" transform="rotate(-30 14 6)" />
        <Rect x="16" y="11" width="2.5" height="1.5" rx="0.75" fill="#06D6A0" transform="rotate(45 16 11)" />
        <Rect x="7" y="14" width="2.5" height="1.5" rx="0.75" fill="#FFFFFF" transform="rotate(-15 7 14)" />
    </Svg>
);

// 2. 커피 (Coffee - Takeout Cup)
export const FoodCoffee = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M7 8L8 20C8 21 9 22 10 22H14C15 22 16 21 16 20L17 8H7Z" fill="#EAE5DF" />
        <Path d="M6 7C6 6 6.5 5 7.5 5H16.5C17.5 5 18 6 18 7C18 7.5 17.5 8 16.5 8H7.5C6.5 8 6 7.5 6 7Z" fill="#4A4A4A" />
        <Rect x="11.5" y="1.5" width="1.5" height="4" fill="#06D6A0" />
        <Rect x="7.5" y="12" width="9" height="5" fill="#8B5A2B" />
    </Svg>
);

// 3. 마라탕 (Malatang Bowl - Top Down composition)
export const FoodMalatang = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Bowl (dark border) */}
        <Circle cx="12" cy="12" r="11" fill="#2E2E2E" />

        {/* Broth (red-orange) */}
        <Circle cx="12" cy="12" r="10" fill="#E63946" />
        <Circle cx="12" cy="12" r="10" fill="#F4A261" opacity="0.3" />
        <Circle cx="7" cy="7" r="1.5" fill="#D62828" opacity="0.5" />
        <Circle cx="16" cy="16" r="2" fill="#D62828" opacity="0.5" />
        <Circle cx="9" cy="18" r="1" fill="#D62828" opacity="0.6" />

        {/* Wood Ear Mushroom (Top Center) */}
        <Path d="M9 5C10 3 13 4 14 5C15 6 15 8 13 8C14 9 11 10 10 9C8 10 7 8 8 7C7 6 8 4 9 5Z" fill="#4A4A4A" />
        {/* Wood Ear Mushroom (Left) */}
        <Path d="M4 12C5 11 7 11 7 12C8 13 8 14 7 15C5 15 3 14 4 12Z" fill="#4A4A4A" />

        {/* Meat slices (Brown) */}
        <Path d="M5 14C6 13 9 14 10 16C12 18 9 20 7 19C4 18 4 16 5 14Z" fill="#9E6A55" />
        <Path d="M14 17C15 15 18 16 19 18C20 20 18 21 16 20C13 19 12 18 14 17Z" fill="#9E6A55" />

        {/* Yuba / Tofu Skin (Yellowish rects) */}
        <G transform="translate(4, 7) rotate(15)">
            <Rect x="0" y="0" width="7" height="1.5" rx="0.5" fill="#FFF3B0" />
            <Rect x="0" y="2" width="7" height="1.5" rx="0.5" fill="#FFF3B0" />
            <Rect x="0" y="4" width="6" height="1.5" rx="0.5" fill="#FFF3B0" />
        </G>
        <G transform="translate(10, 14) rotate(-60)">
            <Rect x="0" y="0" width="8" height="1.5" rx="0.5" fill="#FFF3B0" />
            <Rect x="0" y="2" width="8" height="1.5" rx="0.5" fill="#FFF3B0" />
        </G>

        {/* Bok Choy (Green Leaves) */}
        <Path d="M14 14C17 13 21 13 20 16C19 19 16 19 13 17C11 16 11 16 14 14Z" fill="#A7C957" />
        <Path d="M7 8C9 6 14 9 12 13C10 16 7 14 5 11C4 9 5 10 7 8Z" fill="#A7C957" />
        <Path d="M14 14.5C16 14.5 18 14.5 19 16" stroke="#F2E8CF" strokeWidth="0.5" fill="none" />
        <Path d="M8 9C10 10 11 11 11 12.5" stroke="#F2E8CF" strokeWidth="0.5" fill="none" />

        {/* Enoki Mushroom (Center Right) */}
        <Path d="M15 9L11 14M16 10L12 14M17 11L13 14.5M16 8L12 13" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
        <Circle cx="15" cy="9" r="1" fill="#FFF" />
        <Circle cx="16" cy="10" r="1" fill="#FFF" />
        <Circle cx="17" cy="11" r="1" fill="#FFF" />
        <Circle cx="16" cy="8" r="1" fill="#FFF" />

        {/* Fish Balls (Whiteish round shapes) */}
        <Circle cx="8" cy="5" r="2.2" fill="#F8EDEB" />
        <Circle cx="18" cy="7" r="2.5" fill="#F8EDEB" />
        <Circle cx="19" cy="12" r="2" fill="#F8EDEB" />
        <Circle cx="16" cy="20" r="1.5" fill="#F8EDEB" />
    </Svg>
);

// 4. 쿠키 (Chocolate Chip Cookie)
export const FoodCookie = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" fill="#E9C46A" />
        <Circle cx="9" cy="9" r="1.5" fill="#6F4E37" />
        <Circle cx="15" cy="10" r="1.5" fill="#6F4E37" />
        <Circle cx="13" cy="15" r="1.5" fill="#6F4E37" />
        <Circle cx="9" cy="14" r="1" fill="#6F4E37" />
        <Circle cx="12" cy="11" r="1" fill="#6F4E37" />
    </Svg>
);

// 5. 라면 (Cup Noodle)
export const FoodRamen = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 9L7 20C7 21 8 22 9 22H15C16 22 17 21 17 20L18 9H6Z" fill="#F4A261" />
        <Path d="M5 8C5 7 5.5 6 6.5 6H17.5C18.5 6 19 7 19 8C19 8.5 18.5 9 17.5 9H6.5C5.5 9 5 8.5 5 8Z" fill="#E63946" />
        <Path d="M9 5C10 3 11 7 12 5C13 3 14 7 15 5" stroke="#F4A261" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M8 7C9 4 10 8 11 6C12 4 13 8 14 6" stroke="#E9C46A" strokeWidth="1.5" strokeLinecap="round" />
        <Rect x="7" y="12" width="10" height="4" fill="#E63946" />
    </Svg>
);

// 6. 래빗 아이스크림 팝 (Ice Cream Rabbit Pop)
export const FoodIceCreamRabbit = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="10.5" y="16" width="3" height="6" rx="1.5" fill="#DDB892" />
        <Path d="M6 10C6 5.5 9 3 12 3C15 3 18 5.5 18 10V16C18 17 17 18 16 18H8C7 18 6 17 6 16V10Z" fill="#F48498" />
        <Path d="M6 10C7 12 10 11 12 13C14 11 17 12 18 10V4C18 4 15 4 12 4C9 4 6 4 6 4V10Z" fill="#6F4E37" />
        <Ellipse cx="8" cy="7" rx="1.5" ry="3.5" fill="#FFB5A7" transform="rotate(-15 8 7)" />
        <Ellipse cx="16" cy="7" rx="1.5" ry="3.5" fill="#FFB5A7" transform="rotate(15 16 7)" />
        <Circle cx="10" cy="13" r="1" fill="#4A4A4A" />
        <Circle cx="14" cy="13" r="1" fill="#4A4A4A" />
        <Ellipse cx="12" cy="14" rx="1" ry="0.5" fill="#FF9EAA" />
    </Svg>
);

// 7. 버블티 (Boba Tea)
export const FoodBobaTea = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M7 8L8 21C8 22 9 23 10 23H14C15 23 16 22 16 21L17 8H7Z" fill="#FFD166" />
        <Rect x="6.5" y="6" width="11" height="2" rx="1" fill="#F4A261" />
        <Rect x="11.5" y="1" width="1.5" height="7" fill="#E63946" />
        <Circle cx="10" cy="20" r="1.5" fill="#4A4A4A" />
        <Circle cx="13" cy="19" r="1.5" fill="#4A4A4A" />
        <Circle cx="9" cy="17" r="1.5" fill="#4A4A4A" />
        <Circle cx="14" cy="16" r="1.5" fill="#4A4A4A" />
        <Circle cx="11.5" cy="17.5" r="1.5" fill="#4A4A4A" />
    </Svg>
);

// 8. 곰돌이 캔 (Bear Drink Can)
export const FoodBearDrink = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M7 6C7 4.5 8 4 12 4C16 4 17 4.5 17 6V18C17 19.5 16 20 12 20C8 20 7 19.5 7 18V6Z" fill="#E63946" />
        <Rect x="8" y="3" width="8" height="2" rx="1" fill="#D3D3D3" />
        <Rect x="11" y="2" width="2" height="1.5" rx="0.5" fill="#A9A9A9" />
        <Circle cx="12" cy="12" r="3.5" fill="#DDB892" />
        <Circle cx="9.5" cy="9.5" r="1.5" fill="#DDB892" />
        <Circle cx="14.5" cy="9.5" r="1.5" fill="#DDB892" />
        <Circle cx="11" cy="11.5" r="0.8" fill="#4A4A4A" />
        <Circle cx="13" cy="11.5" r="0.8" fill="#4A4A4A" />
        <Ellipse cx="12" cy="13" rx="1" ry="0.6" fill="#6F4E37" />
    </Svg>
);

// 9. 딸기 조각 케이크 (Strawberry Cake Slice)
export const FoodCake = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Polygon points="5,18 19,18 19,10 5,6" fill="#FFD166" />
        <Polygon points="5,6 19,10 19,12 5,8" fill="#FFFFFF" />
        <Path d="M5 6L19 10C19 10 18 12 16 12C14 12 13 10 11 10C9 10 8 12 6 12C5 12 5 6 5 6Z" fill="#F48498" />
        <Circle cx="9" cy="4.5" r="2" fill="#E63946" />
        <Rect x="8.5" y="2" width="1" height="1.5" fill="#2A9D8F" />
    </Svg>
);

// 10. 마카롱 (Macaron Stack)
export const FoodMacaron = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Bottom Macaron */}
        <Ellipse cx="12" cy="16" rx="6" ry="2.5" fill="#F4A261" />
        <Ellipse cx="12" cy="18" rx="6.5" ry="2.5" fill="#FFD166" />
        <Ellipse cx="12" cy="19.5" rx="6" ry="2.5" fill="#F4A261" />

        {/* Top Macaron */}
        <Ellipse cx="12" cy="8" rx="5.5" ry="2.5" fill="#06D6A0" />
        <Ellipse cx="12" cy="10" rx="6" ry="2.5" fill="#B5E48C" />
        <Ellipse cx="12" cy="11.5" rx="5.5" ry="2.5" fill="#06D6A0" />
    </Svg>
);

// 11. 감자튀김 (Fries)
export const FoodFries = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M7 12L8 21C8 22 9 22 12 22C15 22 16 22 16 21L17 12H7Z" fill="#E63946" />
        <Path d="M7 12C9 14 15 14 17 12C17 12 18 14 16 16C13 18 11 18 8 16C6 14 7 12 7 12Z" fill="#FFB5A7" />
        <Rect x="8" y="6" width="1.5" height="7" rx="0.5" fill="#FFD166" />
        <Rect x="10.5" y="4" width="1.5" height="9" rx="0.5" fill="#FFD166" />
        <Rect x="12.5" y="5" width="1.5" height="8" rx="0.5" fill="#FFD166" />
        <Rect x="14.5" y="7" width="1.5" height="6" rx="0.5" fill="#FFD166" />
    </Svg>
);

// 12. 소프트 아이스크림 (Soft Serve)
export const FoodSoftServe = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Polygon points="8,15 16,15 13,22 11,22" fill="#E9C46A" />
        <Path d="M8 15L16 15C16 15 17 12 16 12C15 12 14.5 13.5 12 13.5C9.5 13.5 9 12 8 12C7 12 8 15 8 15Z" fill="#F48498" />
        <Path d="M8 12C8 9 10 10.5 12 10.5C14 10.5 16 9 16 12C16 12 16 8 12 8C8 8 8 12 8 12Z" fill="#FFFFFF" />
        <Path d="M9.5 8C9.5 5 12 3 12 3C12 3 14.5 5 14.5 8" fill="#F48498" />
        <Circle cx="12" cy="3.5" r="1.5" fill="#E63946" />
    </Svg>
);

// 13. 탕후루 (Tanghulu)
export const FoodTanghulu = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="11.5" y="4" width="1" height="18" fill="#DDB892" />
        <Circle cx="12" cy="7" r="3" fill="#E63946" />
        <Circle cx="12" cy="13" r="3" fill="#E63946" />
        <Circle cx="12" cy="19" r="3" fill="#E63946" />
        <Circle cx="11" cy="6" r="1" fill="#FFFFFF" opacity="0.6" />
        <Circle cx="11" cy="12" r="1" fill="#FFFFFF" opacity="0.6" />
        <Circle cx="11" cy="18" r="1" fill="#FFFFFF" opacity="0.6" />
    </Svg>
);

// 14. 크로플 (Croffle)
export const FoodCroffle = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Ellipse cx="12" cy="12" rx="7" ry="5" fill="#F4A261" transform="rotate(-30 12 12)" />
        <Ellipse cx="12" cy="12" rx="7" ry="3.5" fill="#E9C46A" transform="rotate(-30 12 12)" />
        <Path d="M8 10L14 15M10 8L16 13M7 12L12 16M14 9L9 15M16 11L11 17M12 7L7 13" stroke="#DDB892" strokeWidth="1" strokeLinecap="round" />
        <Circle cx="12" cy="11" r="2.5" fill="#FFFFFF" />
    </Svg>
);

// 15. 민트 모히토 (Mint Mojito)
export const FoodMintChoco = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M7 8L8 20C8 21 9 22 10 22H14C15 22 16 21 16 20L17 8H7Z" fill="#A8DADC" />
        <Ellipse cx="12" cy="8" rx="5" ry="1.5" fill="#E0FBFC" />
        <Rect x="12.5" y="2" width="1.5" height="7" fill="#F4A261" transform="rotate(15 12.5 2)" />
        <Path d="M12 11C10 10 9 12 10 13C11 14 13 13 12 11Z" fill="#2A9D8F" />
        <Path d="M14 14C13 13 11 15 12 16C13 17 15 16 14 14Z" fill="#2A9D8F" />
        <Path d="M9 16C8 15 7 17 8 18C9 19 11 18 9 16Z" fill="#2A9D8F" />
        <Circle cx="10" cy="17" r="1" fill="#FFFFFF" opacity="0.5" />
        <Circle cx="14" cy="12" r="0.8" fill="#FFFFFF" opacity="0.5" />
    </Svg>
);

// 16. 녹차 케이크 (Matcha Cake)
export const FoodMatchaCake = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="6" y="11" width="12" height="9" rx="1" fill="#A7C957" />
        <Rect x="6" y="15" width="12" height="1.5" fill="#6A994E" />
        <Path d="M5 11C6 8 8 10 12 10C16 10 18 8 19 11V12H5V11Z" fill="#E9C46A" />
        <Circle cx="12" cy="6" r="2" fill="#E63946" />
        <Path d="M12 8L10 9L11 10M12 8L14 9L13 10" stroke="#F4F1DE" strokeWidth="1" />
    </Svg>
);

// 17. 푸딩 (Pudding)
export const FoodPudding = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M7 10C7 7 9 6 12 6C15 6 17 7 17 10L18 19C18 20 17 21 16 21H8C7 21 6 20 6 19L7 10Z" fill="#F4A261" />
        <Path d="M7 10C7 7 9 6 12 6C15 6 17 7 17 10C17 10 16 12 14 12C12 12 12 11 10 11C8 11 7 12 7 10Z" fill="#E63946" />
        <Ellipse cx="12" cy="21" rx="6" ry="1.5" fill="#E9C46A" />
        <Circle cx="10" cy="14" r="0.8" fill="#4A4A4A" />
        <Circle cx="14" cy="14" r="0.8" fill="#4A4A4A" />
        <Ellipse cx="12" cy="15" rx="1" ry="0.6" fill="#F48498" />
    </Svg>
);

// 18. 찐빵 (Bun)
export const FoodBun = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 6C6 6 4 12 4 15C4 18 6 19 12 19C18 19 20 18 20 15C20 12 18 6 12 6Z" fill="#FFF3B0" />
        <Rect x="6" y="19" width="12" height="1.5" rx="0.5" fill="#E0E1DD" />
        <Path d="M4 15C6 14 8 16 12 16C16 16 18 14 20 15" stroke="#E9C46A" strokeWidth="1.5" strokeLinecap="round" />
        <Circle cx="10" cy="12" r="1.2" fill="#4A4A4A" />
        <Circle cx="14" cy="12" r="1.2" fill="#4A4A4A" />
        <Path d="M11 13C11 13 12 14 13 13" stroke="#4A4A4A" strokeWidth="1" strokeLinecap="round" />
    </Svg>
);
