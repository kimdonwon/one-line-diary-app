# Product Specification (In-App Purchase)

이 문서는 '오늘조각' 앱에서 판매되는 인앱 결제 상품들의 고유 ID(Product ID)와 관리 체계를 정의합니다. 구글 플레이 콘솔 및 애플 앱스토어 등록 시 이 ID를 사용합니다.

## 1. Product ID 명명 규칙
*   **형식:** `com.team.today_piece.[category].[item_name]`
*   모든 ID는 소문자와 언더바(`_`)만 사용합니다.

## 2. 상품 목록

### 2.1. 프리미엄 요금제 (Subscriptions/Non-Consumables)
프리미엄은 앱의 모든 제한을 해제하고 영구적으로 기능을 제공하는 핵심 상품입니다.

| 상품명 | Product ID | 가격 (현지화 전) | 유형 |
| :--- | :--- | :--- | :--- |
| **오늘조각 프리미엄** | `com.team.today_piece.premium_lifetime` | ₩5,000 | 영구 소장 (Non-Consumable) |

### 2.2. 스티커 팩 (Sticker Packs)
추가 디자인의 스티커를 구매하여 서랍에 추가할 수 있는 상품입니다.

| 상품명 | 내부 catId | Product ID | 가격 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **몽글몽글 파스텔 팩** | `pastel` | `com.team.today_piece.sticker_pastel` | ₩1,100 | 프리미엄 구매 시 무료 증정 |
| **냠냠 먹방 팩** | `food` | `com.team.today_piece.sticker_food` | ₩1,100 | |
| **삐뚤빼뚤 라인 팩** | `mzline` | `com.team.today_piece.sticker_mzline` | ₩1,100 | |
| **오밀조밀 동네 친구들** | `people` | `com.team.today_piece.sticker_people` | ₩1,100 | |
| **아이티 스티커팩** | `random` | `com.team.today_piece.sticker_it_random` | ₩1,100 | IT 소품 및 기기 위주 |

## 3. 무료 및 기본 제공 품목
아래 품목은 별도의 스토어 ID 등록 없이 앱 내에서 기본 제공되거나 특정 조건 충족 시 활성화됩니다.

*   `emoji`: 기본 다꾸 이모지 팩 (무료)
*   `legacy`: 기본 캐릭터 팩 (무료)
*   `roundface`: 동글뱅이 얼굴 팩 (무료)

## 4. 관리 및 연동 가이드
1.  **스토어 등록:** 구글 플레이 콘솔의 '인앱 상품' 메뉴에 위 ID를 동일하게 등록합니다.
2.  **코드 연동:** `src/constants/stickers.js`의 `STICKER_PACK_DATA`에 위 `Product ID` 필드를 추가하여 관리합니다.
3.  **복원(Restore):** 사용자가 기기를 변경해도 위 ID를 기준으로 구매 내역을 스캔하여 복원합니다.

## 5. 핵심 UX/UI 업데이트 (Refining Tool Panel UX)
*   **Floating Glass Island & Seamless Morphing Dock:** 하단 도구 패널(텍스트, 사진, 스티커)은 반투명 블러 효과(BlurView)가 적용된 단일 컨테이너로 통합되었으며, 탭 전환 시 창이 닫히지 않고 내부에서 매끄럽게 교체(LayoutAnimation)되어 MZ세대 트렌드에 맞는 세련된 인터페이스를 제공합니다.
*   **Interactive Year Selection (Summary View):** 요약 화면 상단의 연도를 터치하여 다른 연도의 통계를 즉시 확인할 수 있는 연도 선택 시스템이 추가되었습니다. Notion 스타일의 깔끔한 모달 디자인을 적용하여 시각적 일관성을 유지합니다.
