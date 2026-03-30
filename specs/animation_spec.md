# 💫 One Line Diary - Animation Specification

본 문서는 앱 내에 적용된 주요 애니메이션 효과와 트랜지션 로직을 정의하고 관리하기 위한 명세서입니다. 모든 애니메이션은 '사용자의 인지와 사용성(Discoverability) 향상' 및 '시각적 만족감(Delight)'을 목표로 설계되었습니다.

---

## 1. 넛지 애니메이션 (Nudge Effect)

사용자가 화면에 진입했을 때, 좌우 스와이프 기능이 있음을 직관적으로 알려주기 위한 자동 스와이프 힌트 효과입니다.

- **위치**: `SummaryScreen.view.js` (가로 스크롤 뷰)
- **트리거**: 요약 화면 최초 진입(마운트) 후 600ms 지연 후 실행
- **동작 방식**:
  1. `x: 60` 픽셀만큼 오른쪽으로 부드럽게(`animated: true`) 이동
  2. 400ms 후 원래 위치(`x: 0`)로 복귀
- **목적**: 버튼이 없는 미니멀한 UI(ㅡ ㅡ 인디케이터) 상황에서 다음 페이지(활동 통계)가 숨겨져 있다는 것을 유저에게 무의식적으로 안내함.

## 2. 통계 바 차트 차오름 애니메이션 (Fill-up Effect) - [v2.0 UI 스레드 최적화]

요약 화면 및 메인 화면의 활동 통계 수치를 시각적으로 채우는 고성능 게이지 애니메이션입니다.

- **위치**: `MainScreen.view.js` (`AnimatedActivityBar`), `SummaryScreen.view.js` (`AnimatedActivityBar`)
- **트리거**: 뷰 렌더링 시 또는 데이터 갱신 시 (`ratio` 변동)
- **동작 방식 (v2.0 Upgrade)**:
  - **엔진 교체**: `width` (레이아웃 속성) 기반 애니메이션을 완전히 폐기하고 **`scaleX` (트랜스폼 속성)** 기반으로 재설계.
  - **네이티브 가속**: `useNativeDriver: true`를 적용하여 애니메이션 연산을 **UI 스레드**로 이관. JS 스레드가 데이터 로딩(DB)으로 점유되어도 프레임 드랍 없이 부드럽게 재생됨.
  - **레이아웃 독립**: `width: '100%'` 고정 상태에서 스케일만 조절하므로 Yoga 레이아웃 엔진의 재계산(Reflow) 부하가 0.
  - **기준점 고정**: `transformOrigin: 'left center'` 스타일을 통해 바가 왼쪽에서 오른쪽으로 자연스럽게 확장되도록 구현.
- **성능 수치**: JS 스레드 점유율과 무관하게 항시 60fps 유지. 메인 화면 스크롤과 동시에 데이터가 로드되더라도 바 애니메이션은 끊기지 않음.

## 3. 폭죽/파티클 엔진 (SkiaConfettiEffect) - [v5.0 고도화]

화면 내 주요 성과를 탭했을 때 발생하는 @shopify/react-native-skia 기반 초고속 파티클 엔진입니다.

- **v5.0 신규 기능 (Rapid-fire & Activity Support)**:
  - **무한 연타 (Circular Queue)**: `POOL_SIZE(60)`와 `BURST_COUNT(12)`를 조합한 순환 큐 설계. 연타 시 기존 파티클을 지우지 않고 새 파티클을 겹쳐서 생성하여 시각적 풍성함 극대화.
  - **활동 아이콘 베이킹 (Activity Baking)**: `activityKey`를 지원하며, `ActivityIconSVGs.js`의 SVG를 마운트 시 GPU 텍스처로 자동 베이킹. '게임', '운동' 등 각 활동에 맞는 커스텀 아이콘 파티클 제공.
  - **SVG 호환성 가이드 (v2)**: Skia SVG 파서 한계를 극복하기 위해 복합 Path 분리, Arc 명령의 Bezier 대체, `fill="transparent"` 표준 준수.
- **기술적 특성**:
  - **Canvas Isolation**: 단일 `<Canvas>` 레이어에서 수십 개의 파티클을 배치 드로우(Batch Draw).
  - **Zero Frame Drop**: `useRSXformBuffer`를 통한 UI 스레드 물리 연산으로 메인 스레드 간섭 차단.

## 4. 탭 전환 스크롤 가드 및 인디케이터 반응 (Scroll Guard & Dash Indicator)

'기분'과 '활동' 탭 사이를 전환할 때 발생하는 색상 깜빡임 및 제어 충돌을 방어하기 위한 로직과 UI 시각화입니다.

- **위치**: `SummaryScreen.logic.js`, `SummaryScreen.styles.js`
- **로직 (Scroll Guard)**:
  - 탭 클릭 시 프로그래밍 방식의 스크롤 모드 플래그(`isProgrammaticScroll`) 활성화.
  - 이 상태에서는 `onScroll` 이벤트의 중간 계산 값을 무시하여 UI 깜빡임을 100% 방지함.
  - 전환이 물리적으로 완료되는 `onMomentumScrollEnd` 시점에만 페이지 상태 확정.
- **시각화 (Dash Indicator)**:
  - 노션(Notion) 스타일의 미니멀 선(ㅡ ㅡ) 사용 (`inactive`: 14px 폭 + 연회색)
  - `active` 상태일 때 폭이 확장(24px)되며, 선택된 탭에 따라 다이내믹 컬러 적용 (기분 색상 또는 활동의 `#5776DB` 테마 컬러).

## 6. 콤보 연타 & 쉐이크 (Combo Tap & Shake)

검색 화면의 빈 상태에서 유저에게 재미를 주고 인터랙션 피드백을 강화하기 위한 '성장형' 연타 애니메이션입니다.

- **위치**: `SearchScreen.view.js` (중앙 개구리 이모지), `MainScreen.view.js` (상단 헤더 주간 기분 이모지)
- **트리거**: `Pressable`의 `onPressIn`(터치 시 즉시), `onPressOut`(터치 해제 시)
- **동작 방식**:
  1. **누적 성장(Combo Scale)**: 연타할 때마다 `scale` 수치를 0.15씩 증가시켜 최대 2.5배까지 확대. `useRef`를 사용하여 렌더링 부하 없이 상태 유지.
  2. **초고속 쉐이크**: 좌우 `±15deg` 각도로 40~80ms의 매우 짧은 주기의 흔들림(Shake)을 적용하여 타격감 극대화.
  3. **콤보 타이머**: 500ms 동안 추가 입력이 없으면 `comboScale`을 1로 초기화.
  4. **완벽한 복귀**: `onPressOut` 시점에 `scale`과 `rotate`를 모두 `Animated.spring`을 통해 정중앙(1, 0)으로 부드럽고 쫀득하게 복구.
- **기술적 강점**:
  - `useNativeDriver: true`를 적용하여 JS 스레드 부하와 상관없이 기기 네이티브 레벨에서 60fps를 유지.
  - `onPressIn` 트리거를 통해 기존 `onPress`보다 체감 레이턴시를 100ms 이상 단축하여 '누르는 즉시 반응'하는 손맛을 구현.
- **목적**: 정적인 화면에서 유저가 이탈하지 않고 앱의 캐릭터와 교감하며 즐거움을 느끼게 함.

---

## 7. 스티커 서랍장 리오더 (Drag & Drop)

스티커 카테고리의 노출 순서를 직관적으로 조정하기 위한 현대적인 인터랙티브 애니메이션입니다.

- **위치**: `WriteScreen.view.js` (서랍장 관리 모달)
- **기술 스택**: `react-native-sortables`, `react-native-reanimated`, `react-native-gesture-handler` (v4/New Architecture 기반)
- **트리거**: 카테고리 아이템을 꾹 누름(Long Press)
- **동작 방식**:
  1. **아이템 부상(Lift)**: 꾹 눌렀을 때 해당 카테고리 카드가 살짝 떠오르며 시각적으로 '들린' 상태를 표현.
  2. **동적 재배치(Reorder)**: 아이템을 드래그하여 다른 위치로 이동시키면, 주변 카드들이 자석처럼 부드럽게(`Spring` 효과) 밀려나며 빈자리를 채움.
  3. **즉각적 데이터 확정**: 드롭(Drop) 하는 순간 `onDragEnd` 이벤트를 통해 상태(`catOrder`)를 즉시 업데이트하고 DB에 저장.
- **가치**: 기존의 번거로운 '선택 -> 이동 위치 탭' 방식에서 '직관적인 직접 조작'으로 전환하여 사용자가 "앱이 살아있다"는 반응성과 프리미엄한 감성 피드백을 느끼게 함.
- **기술 포인트**: 연산량이 많은 그리드 재배치 로직을 네이티브 워클릿(Worklets) 스레드에서 처리하여, 저사양 기기에서도 프레임 드랍 없는 부드러운 전환을 보장함.

## 8. 온보딩 코치마크 (Onboarding Coach Marks)

앱 설치 후 최초로 일기 쓰기 화면에 진입했을 때, 핵심 기능을 4단계에 걸쳐 안내하는 스포트라이트 튜토리얼입니다.

- **위치**: `WriteScreen.view.js` (CopilotStep 래퍼), `components/OnboardingTooltip.js` (커스텀 UI)
- **기술 스택**: `react-native-copilot` (SVG 오버레이), `react-native-svg`
- **트리거**: 앱 최초 실행 → 기분 선택 모달 닫힘 후 600ms 지연 자동 시작 (세션 설정 `onboarding_write_done` 플래그로 1회 제한)
- **단계**:
  1. **Step 1 (캔버스 탭)**: 빈 공간을 길게 눌러 텍스트를 생성하는 방법과 글귀 버튼의 용도 안내
  2. **Step 2 (도구함)**: 스티커/사진 버튼의 위치와 서랍장 기능 안내, 체험용 스티커 생성 유도
  3. **Step 3 (제스처)**: 탭, 롱터치 드래그, 드래그 핸들, 조절 핸들 등 조작법 안내
  4. **Step 4 (멀티페이지)**: 페이지 추가(+) 버튼 및 스와이프 기능 안내
- **동작 방식**: 화면 전체에 반투명 어두운 배경(Dim)이 깔리고, 해당 스텝의 UI 요소만 SVG 마스크 경로로 밝게 뚫림(Spotlight). 각 스텝마다 커스텀 말풍선(OnboardingTooltip)이 표시됨
- **목적**: 다꾸 앱 특유의 풍부한 제스처 조작법(롱탭 생성, 드래그 이동, 핸들 회전/크기 조절)을 신규 유저가 직관적으로 익히도록 유도
