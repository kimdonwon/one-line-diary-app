---
name: Product Manager
description: 인앱 결제 상품(Product ID)의 명명 규칙과 관리 프로세스를 정의하는 스킬입니다.
---

# Product Manager

이 스킬은 '오늘조각' 앱의 유료 상품 및 인앱 결제(IAP) 관련 Product ID를 관리하고 시스템에 반영하는 규칙을 정의합니다. 새로운 판매 항목(스티커 팩, 기능 해제 등)이 추가될 때 반드시 이 스킬을 준수해야 합니다.

## 🆔 1. Product ID 명명 규칙
모든 인앱 상품 ID는 스토어(Google Play, App Store) 호환성과 관리 편의성을 위해 다음 형식을 따릅니다.

- **기본 형식**: `com.team.today_piece.[category].[item_name]`
- **규칙**:
    - 반드시 소문자만 사용합니다.
    - 단어 구분은 언더바(`_`)를 사용합니다.
    - `category`: 상품의 분류 (예: `premium`, `sticker`, `theme` 등)
    - `item_name`: 상품의 고유 이름 (예: `lifetime`, `pastel`, `people` 등)

## 📄 2. 스펙 문서 관리 (`specs/product.md`)
새로운 유료 상품이 추가되거나 기존 상품의 정보가 변경될 때, 반드시 `specs/product.md` 파일을 업데이트해야 합니다.

- **필수 기입 정보**:
    - 상품명 (한글)
    - Product ID (위 명명 규칙 준수)
    - 내부 식별자 (예: `catId`)
    - 가격 (현지화 전 가격)
    - 상품 유형 (영구 소장, 소모성 등)
- **업데이트 타이밍**: 코드(Constants)를 수정하기 전이나 동시에 업데이트하여 데이터의 일관성을 유지합니다.

## 🛠️ 3. 코드 내 데이터 연동 (`src/constants/`)
코드 상에서 상품 정보를 정의할 때는 스펙 문서와 1:1로 매칭되어야 합니다.

- `src/constants/stickers.js` 등의 파일에서 `STICKER_PACK_DATA` 배열 내에 `productId` 필드를 포함시켜 관리합니다.
- 실제 스토어 연동 로직(SDK) 호출 시 이 `productId`를 식별자로 사용합니다.

## 💰 4. 결제 및 상태 관리 규칙
- **프리미엄 체크**: 특정 기능이 프리미엄 전용일 경우, `isPremium` 상태를 확인하여 잠금 UI를 노출합니다.
- **구매 여부 확인**: 스티커 팩의 경우 `purchasedPacks` 배열에 해당 `catId` 또는 `productId`가 포함되어 있는지 확인합니다.
- **체험판/무료 증정**: 특정 상품(예: 파스텔 팩)이 프리미엄 구매 시 무료로 제공되는 로직이 있다면, 이를 명시적으로 코드와 스펙에 기록합니다.

## 🔄 5. 데이터 복원 (Restore) 및 초기화
- 사용자가 기기를 변경하거나 앱을 재설치했을 때, 등록된 Product ID 리스트를 기반으로 스토어에 구매 내역 조회를 요청해야 합니다.
- 개발 및 테스트 시에는 `SettingsScreen.logic.js`에 정의된 초기화 도구를 사용하여 결제 상태를 손쉽게 리셋할 수 있도록 유지합니다.
