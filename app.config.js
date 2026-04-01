const pkg = require('./package.json');

// 🔐 .env 파일에서 환경 변수를 읽어옵니다
require('dotenv').config();

module.exports = {
  expo: {
    name: "오늘조각",
    icon: "./assets/icon.png",
    slug: "today-piece",
    version: pkg.version, // 📦 package.json 버전과 동기화
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: {
      backgroundColor: "#FFF0F5",
      resizeMode: "contain"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.oneline.diary"
    },
    android: {
      package: "com.oneline.diary",
      adaptiveIcon: { // 👈 안드로이드 적응형 아이콘 설정
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      softwareKeyboardLayoutMode: "resize",
      versionCode: 8
    },
    web: {},
    plugins: [
      "expo-asset",
      "expo-sqlite",
      "expo-mail-composer",
      "expo-font",
      "expo-secure-store",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": process.env.ADMOB_ANDROID_APP_ID || "ca-app-pub-1781835804890106~9205277146",
          "iosAppId": process.env.ADMOB_IOS_APP_ID || "ca-app-pub-1781835804890106~9205277146"
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "d5848bb5-18eb-4737-b10e-47f90e01d196"
      },
      // 🔐 런타임에서 접근할 수 있도록 extra에 주입
      admobRewardedAndroid: process.env.ADMOB_REWARDED_ANDROID || "",
      admobRewardedIos: process.env.ADMOB_REWARDED_IOS || "",
      backupSecret: process.env.BACKUP_SECRET_KEY || ""
    },
    owner: "mrbob"
  }
};
