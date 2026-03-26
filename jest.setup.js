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
  useRewardedAd: jest.fn(() => ({
    load: jest.fn(),
    isLoaded: false,
    show: jest.fn(),
  })),
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
