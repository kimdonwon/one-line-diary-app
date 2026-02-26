import { getMoodByKey } from '../../constants/mood';

/**
 * ⚙️ 설정 화면용 비즈니스 로직 훅입니다.
 * 현재는 준비 중 화면이므로 기본적인 상태만 반환하지만 향후 시스템 설정 로직이 추가될 공간입니다.
 */
export function useSettingsLogic() {
    // 임시로 사용할 'soso' 무드 캐릭터 객체 로드
    const sosoMood = getMoodByKey('soso');

    return {
        sosoMood
    };
}
