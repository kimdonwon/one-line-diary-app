import 'react-native-gesture-handler/jestSetup';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock react-native-google-mobile-ads
jest.mock('react-native-google-mobile-ads', () => ({
  TestIds: {
    REWARDED: 'test-rewarded-id',
  },
  RewardedAd: {
    createForAdRequest: jest.fn(() => {
      const eventListeners = {};
      return {
        addAdEventListener: jest.fn((event, callback) => {
          eventListeners[event] = callback;
          return jest.fn(); // unsubscribe
        }),
        load: jest.fn(() => {
          // 테스트에서 즉시 LOADED 이벤트 발생 → isAdLoaded = true
          if (eventListeners['loaded']) eventListeners['loaded']();
        }),
        show: jest.fn(() => {
          // 테스트에서 즉시 EARNED_REWARD 이벤트 발생 → 보상 지급
          if (eventListeners['earned_reward']) {
            eventListeners['earned_reward']({ type: 'rewarded', amount: 1 });
          }
        }),
      };
    }),
  },
  RewardedAdEventType: {
    LOADED: 'loaded',
    EARNED_REWARD: 'earned_reward',
  },
  AdEventType: {
    CLOSED: 'closed',
    ERROR: 'error',
  },
}));

// Mock expo-constants for extra env vars
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      admobRewardedAndroid: 'test-ad-id',
      admobRewardedIos: 'test-ad-id',
    },
  },
}));
