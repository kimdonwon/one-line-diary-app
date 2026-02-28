import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../../constants/theme';
import { MoodCharacter } from '../../constants/MoodCharacters';

/**
 * 🔐 비밀번호 설정/변경 모달 컴포넌트
 * 1단계: "새 비밀번호 입력" → 2단계: "비밀번호 확인" 플로우
 */
export function PinSetupModal({ isVisible, onClose, onComplete }) {
    const [step, setStep] = useState(1); // 1: 입력, 2: 확인
    const [firstPin, setFirstPin] = useState('');
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const dotScales = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

    // 모달 열릴 때 초기화
    useEffect(() => {
        if (isVisible) {
            setStep(1);
            setFirstPin('');
            setInput('');
            setError('');
        }
    }, [isVisible]);

    // 도트 애니메이션
    useEffect(() => {
        dotScales.forEach((scale, i) => {
            Animated.spring(scale, {
                toValue: input.length > i ? 1 : 0,
                friction: 4,
                tension: 200,
                useNativeDriver: true,
            }).start();
        });
    }, [input]);

    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handlePress = (num) => {
        if (input.length < 4) {
            setInput(prev => prev + num);
        }
    };

    const handleBack = () => {
        setInput(prev => prev.slice(0, -1));
        setError('');
    };

    // 4자리 완료 시 자동 처리
    useEffect(() => {
        if (input.length === 4) {
            if (step === 1) {
                // 1단계 완료 → 2단계로
                setFirstPin(input);
                setStep(2);
                setTimeout(() => setInput(''), 200);
            } else {
                // 2단계: 확인
                if (input === firstPin) {
                    onComplete(input);
                    setInput('');
                    setFirstPin('');
                    setStep(1);
                } else {
                    setError('비밀번호가 일치하지 않아요!');
                    Vibration.vibrate(200);
                    triggerShake();
                    setTimeout(() => {
                        setInput('');
                        setError('');
                    }, 500);
                }
            }
        }
    }, [input]);

    const stepTitle = step === 1 ? '새 비밀번호 입력' : '비밀번호 확인';
    const stepDesc = step === 1
        ? '4자리 숫자를 입력해주세요'
        : error || '한 번 더 입력해주세요';

    return (
        <Modal
            isVisible={isVisible}
            backdropOpacity={0.5}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={300}
            animationOutTiming={250}
            onBackdropPress={onClose}
            style={modalStyles.modalWrap}
        >
            <View style={modalStyles.container}>
                {/* 헤더 */}
                <View style={modalStyles.header}>
                    <MoodCharacter character="frog" size={44} />
                    <Text style={modalStyles.title}>{stepTitle}</Text>
                    <Text style={[
                        modalStyles.desc,
                        error && { color: COLORS.embarrassed, fontWeight: '700' }
                    ]}>
                        {stepDesc}
                    </Text>
                </View>

                {/* 도트 */}
                <Animated.View style={[modalStyles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
                    {[0, 1, 2, 3].map(i => (
                        <View key={i} style={modalStyles.dotOuter}>
                            <Animated.View
                                style={[
                                    modalStyles.dotInner,
                                    {
                                        transform: [{ scale: dotScales[i] }],
                                        opacity: dotScales[i],
                                    }
                                ]}
                            />
                        </View>
                    ))}
                </Animated.View>

                {/* 미니 넘패드 */}
                <View style={modalStyles.numpad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <TouchableOpacity
                            key={num}
                            style={modalStyles.numBtn}
                            onPress={() => handlePress(String(num))}
                            activeOpacity={0.6}
                        >
                            <Text style={modalStyles.numText}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={modalStyles.emptyBtn} />
                    <TouchableOpacity
                        style={modalStyles.numBtn}
                        onPress={() => handlePress('0')}
                        activeOpacity={0.6}
                    >
                        <Text style={modalStyles.numText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={modalStyles.numBtn}
                        onPress={handleBack}
                        activeOpacity={0.6}
                    >
                        <Text style={[modalStyles.numText, { fontSize: 18 }]}>⌫</Text>
                    </TouchableOpacity>
                </View>

                {/* 취소 버튼 */}
                <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose}>
                    <Text style={modalStyles.cancelText}>취소</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const MINI_BTN = 56;

const modalStyles = StyleSheet.create({
    modalWrap: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: RADIUS.lg,
        borderTopRightRadius: RADIUS.lg,
        paddingTop: SPACING.lg,
        paddingBottom: 40,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        ...FONTS.subtitle,
        fontSize: 18,
        color: COLORS.text,
        marginTop: 8,
    },
    desc: {
        ...FONTS.caption,
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 16,
    },
    dotOuter: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#F0E6EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.happy,
    },
    numpad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        maxWidth: MINI_BTN * 3 + 30,
    },
    numBtn: {
        width: MINI_BTN,
        height: MINI_BTN,
        borderRadius: MINI_BTN / 2,
        backgroundColor: '#FFF5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyBtn: {
        width: MINI_BTN,
        height: MINI_BTN,
    },
    numText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },
    cancelButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    cancelText: {
        ...FONTS.body,
        fontSize: 15,
        color: COLORS.textSecondary,
    },
});
