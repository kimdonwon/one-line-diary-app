import { Platform } from 'react-native';

/**
 * 인앱 결제(IAP) 상품 ID 및 관련 상수
 * specs/product.md 명세와 1:1로 매칭되는 구성 파일입니다.
 */

// 프리미엄 구독 (연간) 식별자
export const PREMIUM_PRODUCT_ID = 'com.team.today_piece.premium_yearly';
// 프리미엄 구독 (3개월) 식별자
export const PREMIUM_QUARTERLY_PRODUCT_ID = 'com.team.today_piece.premium_3month';

// react-native-iap 연동을 위한 플랫폼별 SKU 배열
export const PREMIUM_SKUS = Platform.select({
    ios: [PREMIUM_PRODUCT_ID, PREMIUM_QUARTERLY_PRODUCT_ID],
    android: [PREMIUM_PRODUCT_ID, PREMIUM_QUARTERLY_PRODUCT_ID],
    default: []
});
