# 버그 1: 📄 텍스트 입력 튐 현상 (Layout Flickering)

이 문서는 다이어리 작성 화면의 `DraggableText` 컴포넌트에서 발생하는 텍스트 튐 현상(Bug 2)을 해결하기 위해 지금까지 시도된 기술적 접근법들과 그 결과를 기록합니다.

---

## 🔍 문제 정의

- **현상**: 한글 입력 시, 특히 첫 글자나 짧은 문장을 입력할 때 텍스트가 순간적으로 앞으로 튀었다가 제자리로 돌아오는 시각적 글리치 발생.
- **원인 추정**:
    1. **조합형 문자 특성**: 한글 자/모음이 합쳐지는 과정에서 레이아웃 엔진이 임시 너비를 0 혹은 부정확하게 계산함.
    2. **애니메이션 vs 레이아웃 충돌**: `Animated.divide` 등으로 계산되는 동적인 `maxWidth` 값이 네이티브 레이아웃 렌더링 시점과 프레임 불일치를 일으킴.

---

## 🛠 시도된 해결 방법들

### 1. 컴포넌트 및 스타일 일원화 (Unified Structure)

- **접근**: `Text`와 `TextInput`을 조건부 렌더링하던 방식에서, 단일 `TextInput`의 `editable` 속성을 토글하는 방식으로 변경.
- **목적**: 두 컴포넌트 간의 미세한 폰트 렌더링 및 패딩 차이로 인한 도약 현상 제거.
- **결과**: 상태 전환 시의 튐은 잡혔으나, **타이핑 중** 발생하는 실시간 레이아웃 흔들림은 해결되지 않음.

### 2. 패딩 전이 및 좌표 일치 (Padding & Coordinate Alignment)

- **접근**: 부모 `View`의 패딩을 제거하고 텍스트 컴포넌트 자체에 패딩을 부여.
- **목적**: `absoluteFill`로 배치되는 입력창의 시작 좌표를 1px의 오차도 없이 일치시킴.
- **결과**: 구조는 깔끔해졌으나 튐 현상의 근본 원인은 아니었음.

### 3. maxWidth 레이아웃 격리 (Layout Isolation)

- **접근**: `Animated.View`(껍데기)에 걸려 있던 `maxWidth` 제약을 삭제하고, 내부 `TextInput` 스타일에만 적용.
- **목적**: 글자 길이에 따라 전체 컨테이너의 중심점(Center)이 흔들리는 것을 방지.
- **결과**: 전체 상자의 좌동은 줄어들었으나, 내부 글자가 텍스트 박스 안에서 튀는 현상은 지속됨.

### 4. AnimatedTextInput 및 엔진 최적화

- **접근**: `Animated.createAnimatedComponent(TextInput)`를 도입하고 스타일 객체 변이(Read-only) 에러 수정.
- **목적**: 애니메이션 값(`dynamicMaxWidth`)을 네이티브 드라이버 수준에서 더 효율적으로 처리하도록 유도.
- **결과**: 연산 안정성은 높아졌으나 한글 조합 중 발생하는 물리적 레이아웃 점프를 완전히 억제하지 못함.

### 5. 성능 병목 - 과도한 리렌더링 (Excessive Re-renders)

- **현상**: `onChangeText`에서 `useState`(`localText`)를 직접 업데이트함에 따라 매 타이핑마다 컴포넌트 전체가 리렌더링됨.
- **분석**: 리렌더링 시마다 `dynamicMaxWidth` 연산과 복잡한 `transform` 스타일이 재평가되며, 특히 한글 조합(Composition) 프레임과 충돌하여 레이아웃 튐을 가속화함.

# 버그 2: 🚨 추가 발견된 버그 (Gesture Conflict)

- **현상**: 드래거블 요소(텍스트, 사진 등)를 좌우로 빠르게 스와이프하면 요소가 드래그되는 대신, 전체 캔버스 화면이 살짝 옆으로 밀리면서 중간에 멈춤.
- **분석**: 드래거블의 `PanResponder`가 제스처를 가로채기 전에 부모 컨테이너(PagerView 또는 ScrollView)가 가로 스와이프 제스처를 먼저 인식하여 페이지 전환을 시도함. 이 과정에서 제스처가 꼬여 캔버스 화면이 중간에 끼이는 현상 발생.

---
*Last Updated: 2026-03-17*

## ✅ 해결 완료 (2026-03-17)

### 버그 1 해결: Uncontrolled TextInput 전환

- `value` prop → `defaultValue` prop으로 전환하여 한글 IME 조합 중 React 리렌더링을 완전히 제거.
- 텍스트 값을 `useRef`로 관리하여 타이핑 성능 최적화.
- 표시용 상태는 편집 종료 시에만 동기화.

### 버그 2 해결: 제스처 캡처 범위 제한 + FlatList 스크롤 차단

- `onMoveShouldSetPanResponderCapture`에서 선택 상태에서만 캡처하도록 수정.
- 중복 `onPanResponderTerminationRequest` 정의 제거 및 통합.
- FlatList의 `scrollEnabled`/`pagingEnabled`를 선택 아이템 존재 시 `false`로 변경.
