import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    rotationHandle: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        width: 36,
        height: 36,
        borderRadius: 18,
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
