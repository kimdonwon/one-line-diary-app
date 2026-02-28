import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Vibration, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

import { styles } from './LockScreen.styles';
import { useLock } from '../../context/LockContext';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { COLORS } from '../../constants/theme';

export function LockScreen() {
    const { unlock, tryBiometricAuth, isBiometricAvailable, showPinFallback, setShowPinFallback } = useLock();
    const [input, setInput] = useState('');
    const [errorCount, setErrorCount] = useState(0);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const dotScales = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

    // 앱 시작 시 자동으로 생체인증 시도
    useEffect(() => {
        if (isBiometricAvailable && !showPinFallback) {
            tryBiometricAuth();
        } else {
            setShowPinFallback(true);
        }
    }, []);

    // 도트 채움 scale 애니메이션
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

    // 번호 입력 처리
    const handlePress = (num) => {
        if (input.length < 4) {
            setInput(prev => prev + num);
        }
    };

    const handleBack = () => {
        setInput(prev => prev.slice(0, -1));
    };

    // 흔들림 애니메이션
    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 12, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -12, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 4, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    // 4자리가 입력되면 자동으로 검증
    useEffect(() => {
        if (input.length === 4) {
            const success = unlock(input);
            if (!success) {
                Vibration.vibrate(200);
                setErrorCount(prev => prev + 1);
                triggerShake();
                setTimeout(() => setInput(''), 400);
            }
        }
    }, [input, unlock]);

    // 생체인증 재시도 핸들러
    const handleBiometricRetry = async () => {
        await tryBiometricAuth();
    };

    // 지문 아이콘 SVG
    const FingerprintIcon = ({ size = 28, color = '#FFFFFF' }) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M12 1a9 9 0 0 0-9 9c0 2 .7 3.9 2 5.4" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Path d="M19 5.6A8.97 8.97 0 0 1 21 10c0 3-1.5 5.7-3.8 7.3" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Path d="M12 5a5 5 0 0 0-5 5c0 1.4.6 2.7 1.5 3.7" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Path d="M15.5 6.3A5 5 0 0 1 17 10c0 1.7-.8 3.2-2 4.2" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Path d="M12 9a1 1 0 0 0-1 1c0 1.4.5 2.7 1.3 3.7" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Path d="M13 10c0 2-.5 3.8-1.4 5.3" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </Svg>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* 반짝이 데코 */}
            <Text style={styles.deco1}>✦</Text>
            <Text style={styles.deco2}>✧</Text>
            <Text style={styles.deco3}>✦</Text>

            <View style={styles.headerWrap}>
                <View style={styles.lockIconCircle}>
                    <MoodCharacter character="frog" size={60} />
                </View>
                <Text style={styles.title}>비밀번호 입력</Text>
                <Text style={[
                    styles.subtitle,
                    errorCount > 0 && styles.errorSubtitle
                ]}>
                    {errorCount > 0 ? '비밀번호가 틀렸어요!' : '앱 잠금이 설정되어 있습니다.'}
                </Text>
            </View>

            {/* 도트 표시기 (흔들림 애니메이션 적용) */}
            <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
                {[0, 1, 2, 3].map(i => (
                    <View key={i} style={styles.dotOuter}>
                        <Animated.View
                            style={[
                                styles.dotInner,
                                {
                                    transform: [{ scale: dotScales[i] }],
                                    opacity: dotScales[i],
                                }
                            ]}
                        />
                    </View>
                ))}
            </Animated.View>

            {/* 숫자 패드 */}
            <View style={styles.numpad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <TouchableOpacity
                        key={num}
                        style={styles.numButton}
                        onPress={() => handlePress(String(num))}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.numText}>{num}</Text>
                    </TouchableOpacity>
                ))}

                {/* 생체인증 버튼 (가용 시만 표시) */}
                {isBiometricAvailable ? (
                    <TouchableOpacity
                        style={styles.biometricButton}
                        onPress={handleBiometricRetry}
                        activeOpacity={0.6}
                    >
                        <FingerprintIcon size={26} color={COLORS.text} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.emptyButton} />
                )}

                <TouchableOpacity
                    style={styles.numButton}
                    onPress={() => handlePress('0')}
                    activeOpacity={0.6}
                >
                    <Text style={styles.numText}>0</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.numButton}
                    onPress={handleBack}
                    activeOpacity={0.6}
                >
                    <Text style={[styles.numText, { fontSize: 20 }]}>⌫</Text>
                </TouchableOpacity>
            </View>

            {/* 생체인증 안내 텍스트 */}
            {isBiometricAvailable && (
                <TouchableOpacity onPress={handleBiometricRetry} style={styles.biometricHint}>
                    <Text style={styles.biometricHintText}>생체인증으로 열기</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
