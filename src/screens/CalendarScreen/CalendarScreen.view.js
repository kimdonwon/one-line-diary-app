import React from 'react';
import { View, Text } from 'react-native';
import { Header } from '../../components';
import { MoodCharacter } from '../../constants/MoodCharacters';

import { useCalendarLogic } from './CalendarScreen.logic';
import { styles } from './CalendarScreen.styles';

/**
 * 🎨 캘린더 화면의 UI 뷰 모듈입니다.
 */
export function CalendarScreenView() {
    const { sosoMood } = useCalendarLogic();

    return (
        <View style={styles.container}>
            <Header title="달력" />
            <View style={styles.content}>
                <MoodCharacter character={sosoMood.character} size={80} />
                <Text style={styles.title}>준비 중이에요!</Text>
                <Text style={styles.subtitle}>달력 화면을 열심히 준비하고 있어요.</Text>
            </View>
        </View>
    );
}
