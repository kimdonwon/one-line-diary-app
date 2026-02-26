import React from 'react';
import { View, Text } from 'react-native';
import { Header } from '../../components';
import { MoodCharacter } from '../../constants/MoodCharacters';

import { useSettingsLogic } from './SettingsScreen.logic';
import { styles } from './SettingsScreen.styles';

/**
 * 🎨 설정 화면의 UI를 그리는 View 컴포넌트입니다.
 * 외부 로직과 분리되어 디자인에 집중할 수 있도록 구성되었습니다.
 */
export function SettingsScreenView({ navigation }) {
    // 뷰 컴포넌트는 비즈니스 로직을 포함하지 않도록 처리합니다.
    const { sosoMood } = useSettingsLogic();

    return (
        <View style={styles.container}>
            <Header title="설정" />
            <View style={styles.content}>
                <MoodCharacter character={sosoMood.character} size={80} />
                <Text style={styles.title}>준비 중이에요!</Text>
                <Text style={styles.subtitle}>설정 화면을 열심히 준비하고 있어요.</Text>
            </View>
        </View>
    );
}
