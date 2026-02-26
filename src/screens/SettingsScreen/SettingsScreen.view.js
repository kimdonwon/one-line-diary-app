import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { Header, Card } from '../../components';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { COLORS } from '../../constants/theme';

import { useSettingsLogic } from './SettingsScreen.logic';
import { styles } from './SettingsScreen.styles';

export function SettingsScreenView({ navigation }) {
    const { sosoMood, isLockEnabled, toggleLock, changePassword } = useSettingsLogic();

    return (
        <View style={styles.container}>
            <Header title="설정" />
            <View style={styles.content}>

                {/* 잠금 설정 섹션 */}
                <Text style={styles.sectionHeader}>보안</Text>
                <Card style={styles.settingCard}>
                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingLabel}>암호 잠금</Text>
                            <Text style={styles.settingDesc}>앱을 켤 때 암호를 입력합니다.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#D1D1D1', true: COLORS.happy }}
                            thumbColor={isLockEnabled ? '#FFF' : '#f4f3f4'}
                            onValueChange={toggleLock}
                            value={isLockEnabled}
                        />
                    </View>

                    {isLockEnabled && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={changePassword}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionButtonText}>비밀번호 변경</Text>
                        </TouchableOpacity>
                    )}
                </Card>

                <View style={styles.footer}>
                    <MoodCharacter character={sosoMood.character} size={60} />
                    <Text style={styles.versionText}>한줄일기 v1.0.0</Text>
                </View>
            </View>
        </View>
    );
}
