import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';

// 🔐 app.config.js의 extra에서 환경변수로 주입된 광고 ID를 읽어옵니다
const extra = Constants.expoConfig?.extra || {};

export const ADMOB_IDS = {
    REWARDED: __DEV__
        ? TestIds.REWARDED
        : Platform.select({
            ios: extra.admobRewardedIos || TestIds.REWARDED,
            android: extra.admobRewardedAndroid || TestIds.REWARDED,
            default: TestIds.REWARDED
        }),
};
