import { getMoodByKey } from '../../constants/mood';

/**
 * ⚙️ 캘린더 화면의 비즈니스 로직 훅입니다.
 */
export function useCalendarLogic() {
    const sosoMood = getMoodByKey('soso');
    return { sosoMood };
}
