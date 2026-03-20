import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 8,
        maxWidth: '95%',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    textWrapper: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        minWidth: 20,
        minHeight: 30,
    },
    unifiedText: {
        fontSize: 13,
        includeFontPadding: false, // 안드로이드 폰트 여백 제거
        lineHeight: 17,
        padding: 0,                // TextInput의 기본 패딩 제거
        margin: 0,
        minWidth: 20,
        textAlignVertical: 'top',
    },
    selected: {
        borderColor: 'rgba(232, 213, 204, 0.6)',
        borderRadius: 4,
        borderStyle: 'dashed',
        zIndex: 999,
    },
    // ✏️ 수정 버튼 (좌측 하단, 회전 핸들의 대칭 위치)
    editHandle: {
        position: 'absolute',
        left: -24,
        bottom: -24,
        width: 43,
        height: 43,
        borderRadius: 21.5,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.2,
        borderColor: '#D1C7BD',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        shadowColor: '#8B7E74',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
});
