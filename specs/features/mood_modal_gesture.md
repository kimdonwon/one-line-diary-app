# Feature: 기분 선택 모달 제스처 (Pull-down to Dismiss)

## 1. 개요
일기 작성 화면의 `MoodBottomSheet`에 `react-native-reanimated`와 `react-native-gesture-handler`를 도입하여, 네이티브 급 성능(60fps)의 "당겨서 닫기" 제스처를 구현함.

## 2. 해결된 문제 및 구현 디테일

### [고성능 제스처 엔진 도입]
- **API 교체**: 기존의 `Animated` API 대신 `Reanimated v3`를 도입.
- **충돌 방지**: 기존 코드에 `Animated`를 사용하는 부분이 많아, Reanimated를 **`ReAnimated`**라는 별칭으로 임포트하여 의존성 충돌 없이 병행 사용 가능하게 설계함.
- **Zero-Flicker**: 네이티브 모달 레이어를 쓰지 않고 일반 View 트리 내에서 `translateY` 애니메이션만 사용하므로 안드로이드 특유의 모달 깜빡임 현상이 원천 차단됨.

### [스크롤뷰 간섭 해결 (Simultaneous Gesture)]
- **문제**: 내부 `ScrollView`의 스크롤 제스처와 시트를 내리는 `Pan` 제스처가 경합함.
- **해결**: 
    - `Gesture.Native()`와 `Gesture.Pan()`을 `Gesture.Simultaneous`로 묶어 동시에 인식하게 함.
    - `scrollY` Shared Value를 통해 스크롤 위치를 실시간 트래킹.
    - **조건부 드래그**: `scrollY <= 0` 이고 `event.translationY > 0`(아래 방향)일 때만 시트가 내려가도록 로직 구성.

### [심미적 디테일]
- **Overshoot Clamping**: 모달이 올라올 때 위로 튀어 올랐다 내려오는 현상을 방지하기 위해 `overshootClamping: true` 옵션 적용.
- **Dismiss 임계치**: 시트 높이의 20% 이상 내려가거나, 아래로 던지는 속도(`velocityY`)가 1000을 넘을 경우 즉시 닫힘.

## 3. 기술 스택
- `react-native-reanimated` v3
- `react-native-gesture-handler` v2
- `GestureDetector` / `Gesture.Simultaneous`

## 4. 변경 파일
- `src/screens/WriteScreen/WriteScreen.view.js`: 제스처 로직 및 `MoodBottomSheet` 컴포넌트 재구현.
- `app.json` / `babel.config.js`: Reanimated 플러그인 확인 및 설정 유지.
