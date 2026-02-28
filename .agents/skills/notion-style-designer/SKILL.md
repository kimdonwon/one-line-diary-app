---
name: Notion Style Designer
description: 노션(Notion)의 깨끗하고 미니멀한 전문 문서 도구 스타일로 UI를 디자인하는 전문 스킬입니다.
---

# Notion Style Designer

이 스킬은 노션(Notion) 특유의 단정하고 지적인 미니멀리즘 디자인 시스템을 앱에 적용하는 방법을 정의합니다.

## 🎨 핵심 디자인 원칙 (The Core Principles)

1. **Monochrome Base**: 화려한 원색보다는 'White', 'Light Gray', 'Dark Charcoal'의 무채색 조합을 기본으로 합니다.
2. **Precision Borders**: 굵은 선 대신 아주 얇고 섬세한 **1px 실선**을 사용하여 구역을 나눕니다.
3. **Typography Hierarchy**: 텍스트의 색상과 크기만으로 명확한 위계를 만듭니다. (본문은 짙게, 보조 설명은 연하게)
4. **Moderate Rounding**: 너무 둥글지도, 너무 날카롭지도 않은 **12px** 또는 **4px**의 정갈한 라운딩을 사용합니다.

## 🛠 스타일 가이드라인 (Implementation Specs)

### 1. 컨테이너 및 카드 (Containers & Cards)
- **Background**: `#FFFFFF` (White)
- **Border**: `1px` solid `#E9E9E7` (Light Gray)
- **Border Radius**: `12px` (Main Card), `4px` (Small items/tabs)
- **Shadow**: 매우 미세한 그림자 (Soft elevation)

### 2. 텍스트 시스템 (Typography)
- **Main Text**: `#37352F` (Dark Charcoal) - 완전히 검은색이 아닌 부드러운 차콜색입니다.
- **Secondary/Labels**: `#666666` (Medium Gray) - 보조 정보나 헤더 라벨에 사용합니다.
- **Headers**: 대문자(Uppercase)와 약간의 자간(`letterSpacing: 0.5`)을 사용하여 지적인 느낌을 줍니다.

### 3. 인터랙션 및 상태 (Interactions & States)
- **Active/Hover State**: `#F1F1F0` (Very Light Gray) 배경색을 사용하여 '눌림' 또는 '선택됨'을 표현합니다.
- **Selection**: 텍스트의 굵기(Font Weight)를 `500`에서 `600`으로 높여 강조합니다.

### 4. 구분선 (Dividers)
- **Style**: `1px` solid `#F1F1F0`
- 헤더와 본문을 나눌 때나 리스트 아이템 사이에 은은하게 사용합니다.

## 📝 적용 예시 (Example)

```javascript
// Notion Style Card
card: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E9E9E7',
  padding: 16,
},

// Notion Style Tab (Active)
tabActive: {
  backgroundColor: '#F1F1F0',
  borderRadius: 4,
}
```

이 스타일은 **중성적이고 전문적인 느낌**을 주며, 사용자가 '기록' 그 자체에 집중할 수 있는 환경을 제공합니다.
