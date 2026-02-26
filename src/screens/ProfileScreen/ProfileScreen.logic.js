import { getMoodByKey } from '../../constants/mood';

export function useProfileLogic() {
    const sosoMood = getMoodByKey('soso');
    return { sosoMood };
}
