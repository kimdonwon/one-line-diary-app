import { useState } from 'react';
import { Alert } from 'react-native';
import { getMoodByKey } from '../../constants/mood';
import { useLock } from '../../context/LockContext';

/**
 * ⚙️ 설정 화면용 비즈니스 로직 훅입니다.
 */
export function useSettingsLogic() {
    const { isLockEnabled, password, updateLockSettings } = useLock();
    const sosoMood = getMoodByKey('SOSO');

    // 잠금 토글 처리
    const toggleLock = async () => {
        if (!isLockEnabled) {
            // 암호 설정 유도 (실제 상용 앱에선 전용 입력 뷰를 띄우는 게 좋지만, 일단 더미/간단 구현)
            Alert.alert(
                '잠금 설정',
                '잠금에 사용할 4자리 비밀번호를 설정할까요?',
                [
                    { text: '취소', style: 'cancel' },
                    {
                        text: '설정하기',
                        onPress: () => {
                            // 여기선 간단하게 0000으로 기본 설정하거나 입력을 유도하는 로직이 필요함
                            // 사용자 경험을 위해 일단 1234로 가이드를 주고 나중에 바꾸게 함
                            updateLockSettings(true, '1234');
                            Alert.alert('설정 완료', '비밀번호가 [1234]로 설정되었습니다. 비밀번호 변경 버튼을 눌러 변경해주세요!');
                        }
                    }
                ]
            );
        } else {
            await updateLockSettings(false, '');
        }
    };

    // 비밀번호 변경 처리 (여기서는 prompt 대신 alert으로 가이드)
    const changePassword = () => {
        // 실제로는 TextInput이 포함된 Modal을 띄우는 것이 좋습니다.
        Alert.alert('준비 중', '비밀번호 변경 화면은 곧 추가될 예정입니다! 현재 비밀번호는 [1234]입니다.');
    };

    return {
        sosoMood,
        isLockEnabled,
        password,
        toggleLock,
        changePassword
    };
}
