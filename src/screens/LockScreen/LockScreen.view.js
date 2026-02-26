import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Vibration } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { styles } from './LockScreen.styles';
import { useLock } from '../../context/LockContext';
import { MoodCharacter } from '../../constants/MoodCharacters';

export function LockScreen() {
    const { unlock } = useLock();
    const [input, setInput] = useState('');
    const [errorCount, setErrorCount] = useState(0);

    // 번호 입력 처리
    const handlePress = (num) => {
        if (input.length < 4) {
            setInput(prev => prev + num);
        }
    };

    const handleBack = () => {
        setInput(prev => prev.slice(0, -1));
    };

    // 4자리가 입력되면 자동으로 검증
    useEffect(() => {
        if (input.length === 4) {
            const success = unlock(input);
            if (!success) {
                // 실패 시 진동 및 초기화
                Vibration.vibrate(200);
                setErrorCount(prev => prev + 1);
                setTimeout(() => setInput(''), 300);
            }
        }
    }, [input, unlock]);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.headerWrap}>
                <MoodCharacter character="bear" size={100} />
                <Text style={styles.title}>비밀번호 입력</Text>
                <Text style={[
                    styles.subtitle,
                    errorCount > 0 && { color: '#FF7474', fontWeight: '700' }
                ]}>
                    {errorCount > 0 ? '비밀번호가 틀렸어요!' : '앱 잠금이 설정되어 있습니다.'}
                </Text>
            </View>

            {/* 도트 표시기 */}
            <View style={styles.dotsRow}>
                {[0, 1, 2, 3].map(i => (
                    <View
                        key={i}
                        style={[styles.dot, input.length > i && styles.dotFilled]}
                    />
                ))}
            </View>

            {/* 숫자 패드 */}
            <View style={styles.numpad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <TouchableOpacity
                        key={num}
                        style={styles.numButton}
                        onPress={() => handlePress(String(num))}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.numText}>{num}</Text>
                    </TouchableOpacity>
                ))}

                <View style={styles.emptyButton} />

                <TouchableOpacity
                    style={styles.numButton}
                    onPress={() => handlePress('0')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.numText}>0</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.numButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.numText, { fontSize: 20 }]}>⌫</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
