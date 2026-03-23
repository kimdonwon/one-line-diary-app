import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

export const ADMOB_IDS = {
    // 실제 광고 노출 시점에는 사용자가 제공한 광고 단위 ID를 씁니다.
    // 개발 중에는 계정 정지 위험이 있으므로 TestIds 를 강제로 사용합니다.
    REWARDED: __DEV__
        ? TestIds.REWARDED
        : Platform.select({
            ios: 'ca-app-pub-1781835804890106/5632162943',
            android: 'ca-app-pub-1781835804890106/5632162943',
            default: TestIds.REWARDED
        }),
};
