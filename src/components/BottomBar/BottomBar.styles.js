import { StyleSheet } from 'react-native';
import { COLORS, SOFT_SHADOW } from '../../constants/theme';

export const styles = StyleSheet.create({
    bottomTabBar: {
        position: 'absolute',
        bottom: 16,
        left: 20,
        right: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        borderTopWidth: 1,
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    navTabContainer: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    diaryContainer: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12, // 👈 중앙 버튼을 오른쪽으로 밀어냄 (결과적으로 일기 버튼은 왼쪽으로 이동)
    },
    summaryContainer: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,  // 👈 중앙 버튼에서 오른쪽으로 밀어냄
    },
});
