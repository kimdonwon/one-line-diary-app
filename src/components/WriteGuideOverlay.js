/**
 * 📘 WriteGuideOverlay — 초보자용 일기쓰기 가이드 오버레이
 *
 * 앱의 '오늘조각' 시그니처 감성(Doodle Flash, 손그림)에 맞춘 디자인.
 * 화면을 덮는 네이티브 느낌을 빼고, 진짜 펜으로 그린 듯한 화살표와 텍스트로 가이드합니다.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, Animated,
    StyleSheet, Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── 앱 테마 컬러 (검은 가이드 배경 대비 흰색 적용) ───
const DOODLE_COLOR = '#FFFFFF';
const STROKE_WIDTH = 2.8;

// ─── 손그림 스타일 커스텀 화살표 ───
const DoodleSwipeRight = () => (
    <Svg width={80} height={50} viewBox="0 0 80 50">
        <Path d="M 10 22 Q 40 18 65 24" stroke={DOODLE_COLOR} strokeWidth={STROKE_WIDTH} fill="none" strokeLinecap="round" />
        <Path d="M 15 32 Q 45 28 65 31" stroke={DOODLE_COLOR} strokeWidth={STROKE_WIDTH} fill="none" strokeLinecap="round" />
        <Path d="M 45 10 Q 55 18 69 24 Q 55 35 42 45" stroke={DOODLE_COLOR} strokeWidth={STROKE_WIDTH} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const DoodleCirclePoint = () => (
    <Svg width={50} height={50} viewBox="0 0 50 50">
        <Path d="M 25 10 C 38 7, 42 20, 36 32 C 30 45, 12 42, 8 30 C 4 18, 12 8, 22 12" stroke={DOODLE_COLOR} strokeWidth={STROKE_WIDTH} fill="none" strokeLinecap="round" />
        <Path d="M 33 28 C 40 32, 45 38, 48 45" stroke={DOODLE_COLOR} strokeWidth={STROKE_WIDTH} fill="none" strokeLinecap="round" />
    </Svg>
);

// 길고 시원한 위에서 아래 화살표
const DoodleLongArrowDown = () => (
    <Svg width={24} height={50} viewBox="0 0 24 100">
        <Path d="M 12 2 Q 15 45 12 94" stroke={DOODLE_COLOR} strokeWidth={STROKE_WIDTH} fill="none" strokeLinecap="round" />
        <Path d="M 4 84 C 8 92, 10 94, 12 96 C 14 88, 18 84, 20 84" stroke={DOODLE_COLOR} strokeWidth={STROKE_WIDTH} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// ─── 메인 컴포넌트 ───
const WriteGuideOverlay = ({ visible, onDismiss, insets = { bottom: 0, top: 0 } }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            onDismiss(dontShowAgain);
        });
    };

    if (!visible) return null;

    // 툴바 가이드들 공통적으로 위로 올리는 오프셋
    const toolbarGuideBottom = 150 + (insets.bottom || 0);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* 요청: 가이드 배경색을 살짝 어두운 검은색으로 */}
            <View style={styles.backdrop} />

            {/* ========== 1. 페이지 이동 (캔버스 우상단) ========== */}
            <View style={[styles.annotationGroup, { top: SH * 0.35, right: 30, alignItems: 'center', transform: [{ rotate: '-2deg' }] }]}>
                <DoodleSwipeRight />
                <Text style={[styles.doodleText, { marginTop: 8 }]}>옆으로 밀어 페이지 이동</Text>
            </View>

            {/* ========== 2. 일기 쓰기 (캔버스 중앙) ========== */}
            <View style={[styles.annotationGroup, { top: SH * 0.52, left: SW * 0.2, flexDirection: 'row', alignItems: 'center', transform: [{ rotate: '1deg' }] }]}>
                <DoodleCirclePoint />
                <Text style={[styles.doodleText, { marginLeft: 6 }]}>화면을 꾹 눌러 일기 쓰기</Text>
            </View>

            {/* ========== 하단 툴바 가이드 (텍스트 + 화살표) ========== */}
            <View style={[styles.toolbarAnnotation, { bottom: toolbarGuideBottom, left: SW * 0.08 }]}>
                <Text style={styles.doodleTextSmall}>스티커</Text>
                <DoodleLongArrowDown />
            </View>

            <View style={[styles.toolbarAnnotation, { bottom: toolbarGuideBottom, left: SW * 0.22 }]}>
                <Text style={styles.doodleTextSmall}>사진</Text>
                <DoodleLongArrowDown />
            </View>

            <View style={[styles.toolbarAnnotation, { bottom: toolbarGuideBottom, left: SW * 0.35 }]}>
                <Text style={styles.doodleTextSmall}>글씨</Text>
                <DoodleLongArrowDown />
            </View>

            <View style={[styles.toolbarAnnotation, { bottom: toolbarGuideBottom, right: 16 }]}>
                <Text style={styles.doodleTextSmall}>기분 및 활동 선택</Text>
                <DoodleLongArrowDown />
            </View>

            {/* ========== 하단 액션 버튼 (손그림 박스 스타일) ========== */}
            <View style={[styles.bottomButtonsWrap, { paddingBottom: (insets.bottom || 0) + 16 }]}>
                <TouchableOpacity
                    style={[styles.doodleBtnItem, { paddingHorizontal: 16 }]}
                    onPress={() => setDontShowAgain(prev => !prev)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.doodleBtnText}>
                        다시보지 않기 {dontShowAgain ? 'V' : 'O'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.doodleBtnItem, { paddingHorizontal: 28 }]}
                    onPress={handleClose}
                    activeOpacity={0.7}
                >
                    <Text style={styles.doodleBtnText}>종료</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

// ─── 스타일 ───
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 15000,
        elevation: 15000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 살짝 어두운 검은색
    },
    annotationGroup: {
        position: 'absolute',
    },
    toolbarAnnotation: {
        position: 'absolute',
        alignItems: 'center',
    },
    highlightBox: {
        position: 'absolute',
    },
    doodleText: {
        fontSize: 18,
        fontWeight: '800',
        color: DOODLE_COLOR,
        letterSpacing: -0.5,
    },
    doodleTextSmall: {
        fontSize: 15,
        fontWeight: '800',
        color: DOODLE_COLOR,
        marginBottom: 2,
    },
    bottomButtonsWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    doodleBtnItem: {
        borderWidth: 2.5,
        borderColor: DOODLE_COLOR,
        borderRadius: 12,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // 어두운 배경에 대비되는 반투명 버튼
    },
    doodleBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: DOODLE_COLOR,
    }
});

export default WriteGuideOverlay;
