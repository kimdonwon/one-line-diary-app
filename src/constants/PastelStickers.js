import React from 'react';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';

const STROKE_W = 7;
const ROUND = 'round';

const C_RED = '#F24E4E';
const C_YELLOW = '#FFC107';
const C_BLUE = '#4A90E2';
const C_GREEN = '#50B848';
const C_ORANGE = '#F58220';

function SvgBase({ size, style, children }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {children}
        </Svg>
    );
}

export function PastelCircleRed(props) {
    return (
        <SvgBase {...props}>
            <Circle cx="50" cy="50" r="30" stroke={C_RED} strokeWidth={STROKE_W} fill="none" />
        </SvgBase>
    );
}

export function PastelCircleBlue(props) {
    return (
        <SvgBase {...props}>
            <Circle cx="50" cy="50" r="30" stroke={C_BLUE} strokeWidth={STROKE_W} fill="none" />
        </SvgBase>
    );
}

export function PastelSquareYellow(props) {
    return (
        <SvgBase {...props}>
            <Rect x="20" y="20" width="60" height="60" stroke={C_YELLOW} strokeWidth={STROKE_W} fill="none" strokeLinejoin={ROUND} />
        </SvgBase>
    );
}

export function PastelSquareGreen(props) {
    return (
        <SvgBase {...props}>
            <Rect x="20" y="20" width="60" height="60" stroke={C_GREEN} strokeWidth={STROKE_W} fill="none" strokeLinejoin={ROUND} />
        </SvgBase>
    );
}

export function PastelHeartFilled(props) {
    return (
        <SvgBase {...props}>
            <Path d="M50 85 Q30 65 15 45 Q5 25 25 15 Q40 5 50 25 Q60 5 75 15 Q95 25 85 45 Q70 65 50 85 Z" fill={C_RED} />
        </SvgBase>
    );
}

export function PastelHeartOutline(props) {
    return (
        <SvgBase {...props}>
            <Path d="M50 85 Q30 65 15 45 Q5 25 25 15 Q40 5 50 25 Q60 5 75 15 Q95 25 85 45 Q70 65 50 85 Z" stroke={C_RED} strokeWidth={STROKE_W} fill="none" strokeLinejoin={ROUND} />
        </SvgBase>
    );
}

export function PastelStarYellow(props) {
    return (
        <SvgBase {...props}>
            <Path d="M50 15 L60 35 L85 40 L65 55 L70 80 L50 65 L30 80 L35 55 L15 40 L40 35 Z" fill={C_YELLOW} strokeLinejoin={ROUND} />
        </SvgBase>
    );
}

export function PastelMoonYellow(props) {
    return (
        <SvgBase {...props}>
            <Path d="M60 20 A35 35 0 0 0 60 80 A40 40 0 1 1 60 20" fill={C_YELLOW} />
        </SvgBase>
    );
}

export function PastelSunRed(props) {
    return (
        <SvgBase {...props}>
            <Circle cx="50" cy="50" r="18" fill={C_RED} />
            <Path d="M50 15 L50 25 M50 85 L50 75 M15 50 L25 50 M85 50 L75 50 M25 25 L32 32 M75 75 L68 68 M25 75 L32 68 M75 25 L68 32" stroke={C_RED} strokeWidth={STROKE_W} strokeLinecap={ROUND} />
        </SvgBase>
    );
}

export function PastelSunYellow(props) {
    return (
        <SvgBase {...props}>
            <Circle cx="50" cy="50" r="35" fill={C_YELLOW} />
        </SvgBase>
    );
}

export function PastelCloudBlue(props) {
    return (
        <SvgBase {...props}>
            <Path d="M30 65 Q20 65 20 55 Q20 45 35 45 Q40 30 55 30 Q70 30 75 45 Q85 45 85 55 Q85 65 75 65 Z" stroke={C_BLUE} strokeWidth={STROKE_W} fill="none" strokeLinejoin={ROUND} strokeLinecap={ROUND} />
        </SvgBase>
    );
}

export function PastelRainBlue(props) {
    return (
        <SvgBase {...props}>
            <Path d="M30 55 Q20 55 20 45 Q20 35 35 35 Q40 20 55 20 Q70 20 75 35 Q85 35 85 45 Q85 55 75 55 Z" stroke={C_BLUE} strokeWidth={STROKE_W} fill="none" strokeLinejoin={ROUND} strokeLinecap={ROUND} />
            <Path d="M35 65 L30 85 M50 65 L45 85 M65 65 L60 85" stroke={C_BLUE} strokeWidth={STROKE_W} strokeLinecap={ROUND} />
        </SvgBase>
    );
}

export function PastelLeafGreen(props) {
    return (
        <SvgBase {...props}>
            <Path d="M40 85 L50 65" stroke={C_GREEN} strokeWidth={STROKE_W} strokeLinecap={ROUND} />
            <Path d="M50 65 Q20 55 30 35 Q50 35 50 65 Z" fill={C_GREEN} />
            <Path d="M50 65 Q80 55 70 35 Q50 35 50 65 Z" fill={C_GREEN} />
        </SvgBase>
    );
}

export function PastelFlowerRed(props) {
    return (
        <SvgBase {...props}>
            <Path d="M50 40 Q65 20 70 40 Q90 45 70 60 Q65 80 50 60 Q35 80 30 60 Q10 45 30 40 Q35 20 50 40" stroke={C_RED} strokeWidth={STROKE_W} fill="none" strokeLinejoin={ROUND} strokeLinecap={ROUND} />
            <Circle cx="50" cy="50" r="5" stroke={C_RED} strokeWidth={STROKE_W} fill="none" />
        </SvgBase>
    );
}

export function PastelFlowerYellow(props) {
    return (
        <SvgBase {...props}>
            <Path d="M50 40 Q65 20 70 40 Q90 45 70 60 Q65 80 50 60 Q35 80 30 60 Q10 45 30 40 Q35 20 50 40" stroke={C_YELLOW} strokeWidth={STROKE_W} fill="none" strokeLinejoin={ROUND} strokeLinecap={ROUND} />
            <Circle cx="50" cy="50" r="5" stroke={C_YELLOW} strokeWidth={STROKE_W} fill="none" />
        </SvgBase>
    );
}

export function PastelSquiggleOrange(props) {
    return (
        <SvgBase {...props}>
            <Path d="M15 50 Q30 20 50 50 T85 50" stroke={C_ORANGE} strokeWidth={STROKE_W} fill="none" strokeLinecap={ROUND} />
        </SvgBase>
    );
}

export function PastelZigzagGreen(props) {
    return (
        <SvgBase {...props}>
            <Polyline points="20,60 40,40 60,60 80,40" stroke={C_GREEN} strokeWidth={STROKE_W} fill="none" strokeLinecap={ROUND} strokeLinejoin={ROUND} />
        </SvgBase>
    );
}

export function PastelMusicOrange(props) {
    return (
        <SvgBase {...props}>
            <Circle cx="35" cy="75" r="8" fill={C_ORANGE} />
            <Circle cx="65" cy="65" r="8" fill={C_ORANGE} />
            <Path d="M43 75 L43 35 L73 25 L73 65 M43 45 L73 35" stroke={C_ORANGE} strokeWidth={STROKE_W} fill="none" strokeLinecap={ROUND} strokeLinejoin={ROUND} />
        </SvgBase>
    );
}
