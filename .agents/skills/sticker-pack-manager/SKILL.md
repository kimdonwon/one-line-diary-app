---
name: Sticker Pack Manager
description: 스티커 팩 관리 시 준수해야 하는 공통 규칙과 화면 렌더링 패턴을 정의하는 스킬입니다.
---

# Sticker Pack Manager

이 스킬은 스티커 카테고리(팩) 데이터를 렌더링하고 사용자에게 보여주는 UI/로직 규칙을 정의합니다. 앱에서 스티커 팩 정보를 표현할 때는 항상 이 스킬을 따릅니다.

## ✨ 1. 대표 아이콘 설정 원칙 (핵심)
- **대표 아이콘 = 각 카테고리의 "첫 번째" 스티커 입니다.**
- 절대 임의의 이모지나 하드코딩된 아이콘(예: 😀, 🎨, ⭐)을 스티커 팩의 대표 이미지로 사용하지 않습니다. 
- 항상 `CATEGORIZED_STICKERS[categoryId][0]` (데이터 배열의 가장 첫 항목)을 동적으로 읽어와 썸네일(대표 스티커)로 렌더링해야 합니다.

### 📝 적용 패턴 (React Native 예시)
```javascript
import { CATEGORIZED_STICKERS } from '../../constants/stickers';

const categoryId = 'legacy'; // 예: 특정 스티커 팩
const firstSticker = CATEGORIZED_STICKERS[categoryId]?.[0];

let StickerPreview = null;
if (firstSticker) {
    if (typeof firstSticker === 'string') {
        // 데이터가 문자열(이모지)일 경우
        StickerPreview = <Text style={styles.icon}>{firstSticker}</Text>;
    } else if (firstSticker.Component) {
        // 데이터가 SVG 컴포넌트 객체일 경우
        const IconComponent = firstSticker.Component;
        StickerPreview = (
            <View style={styles.iconWrap}>
                <IconComponent size={30} />
            </View>
        );
    }
}
```

## 📐 2. 관리 창(Manager Modal) 레이아웃 (Card Grid)
- **3열 그리드 배치**: 공간 효율을 위해 화면에 카드를 가로로 3개씩(`width: 31.3%`) 배치합니다.
- **카드 내부 구조 (Top-Down)**:
    1.  **이름 태그 (Top-Left)**: 좌측 상단에 연회색 박스 형태의 태그를 배치하고 내부에 팩 이름을 넣습니다.
    2.  **구분선 (Divider)**: 태그 바로 아래에 아주 얇은 실선(`1px`)을 그어 상/하 영역을 분리합니다.
    3.  **미리보기 (3-Sticker Preview)**: 카드 최하단에 해당 팩의 대표 스티커 **앞 3개**를 수평으로 나란히 배치합니다.
- **색상 및 스타일**: 노션 스타일의 무채색 딤 처리와 하얀색 카드 배경을 사용하며, 실선은 `#F1F1F0` 등 아주 연한 색상을 권장합니다.

## 🖱️ 3. 사용자 상호작용 규칙
- **ON/OFF 토글**: 별도의 스위치 버튼 없이 **카드를 살짝 터치(Tap)**하면 해당 팩의 활성화 상태가 전환됩니다. 비활성화 시에는 투명도(`opacity: 0.6`)를 조절하여 시각적으로 구분합니다.
- **순서 변경 (Reorder)**: **카드를 꾹 누르면(Long Press)** 정렬 모드가 활성화됩니다. 이동하고 싶은 대상 카드를 터치하면 즉시 두 카드의 순서가 교체(Swap)됩니다.
- **시각적 피드백**: '이동 모드'나 '호버' 상태에서는 카드 테두리 색상을 강조하거나 약간의 확대(`scale`) 효과를 주어 사용자에게 현재 상태를 알립니다.

## 🛒 4. 스티커 팩 상점 (구매/다운로드)
- 사용자는 설정 화면의 스티커 상점에서 새로운 스티커 팩을 조회할 수 있습니다.
- 앱에 기본 제공되는 팩(예: `isDefault: true`) 외에는 사용자가 직접 **구매(다운로드)**해야 서랍에 추가됩니다.
- 미보유 상태의 팩을 열면 미리보기 모달의 하단 버튼이 "해당 팩 담기 (무료)" 또는 "결제하기"로 상황에 맞게 변경됩니다.
- 다운로드가 완료되면 해당 팩의 `catId`가 설정 내역(예: `purchasedPacks`)에 저장되고, 작성 화면의 서랍 및 관리 창에서도 자동으로 조회 및 렌더링 됩니다.
