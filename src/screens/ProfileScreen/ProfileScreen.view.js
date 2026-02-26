import React from 'react';
import { View, Text } from 'react-native';
import { Header } from '../../components';
import { MoodCharacter } from '../../constants/MoodCharacters';

import { useProfileLogic } from './ProfileScreen.logic';
import { styles } from './ProfileScreen.styles';

export function ProfileScreenView() {
    const { sosoMood } = useProfileLogic();

    return (
        <View style={styles.container}>
            <Header title="내 정보" />
            <View style={styles.content}>
                <MoodCharacter character={sosoMood.character} size={80} />
                <Text style={styles.title}>준비 중이에요!</Text>
                <Text style={styles.subtitle}>프로필 화면을 열심히 준비하고 있어요.</Text>
            </View>
        </View>
    );
}
