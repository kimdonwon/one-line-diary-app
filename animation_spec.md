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

## 2. 통계 바 차트 차오름 애니메이션 (Fill-up Effect)
요약 화면의 통계 수치를 시각적으로 채우는 동적인 게이지 애니메이션입니다.

- **위치**: `components/index.js` (`MoodBar`), `SummaryScreen.view.js` (`AnimatedActivityBar`)
- **트리거**: 뷰어 렌더링 시 또는 탭을 오갈 때 (focus 시 `animKey` 변동)
- **동작 방식**: 
  - `Animated.timing`을 사용하여 `width`를 0%에서 시작해 계산된 비율(ratio * 100%)까지 도달시킴.
  - **MoodBar**: 700ms 지속 시간
  - **ActivityBar**: 600ms 지속 시간, 100ms 지연 (delay)
- **목적**: 화면에 진입하는 순간 수치가 동적으로 시각화되며 데이터를 읽는 재미와 완성도를 제공.
- **성능 최적화(Tip)**: SVG 등 복잡한 아이콘 리렌더링을 방지하기 위해 `React.memo`로 컴포넌트를 분리하고 `width` 속성만 애니메이션 처리함.

## 3. 폭죽/파티클 애니메이션 (Confetti Effect)
화면 내 주요 성과(올해 최고의 기분/활동)를 탭했을 때 발생하는 인터랙티브 리액션 애니메이션입니다.

- **위치**: `components/ConfettiEffect.js`, `SummaryScreen`의 Hero Banner (상단 큰 카드)
- **트리거**: 사용자가 Hero Banner를 터치할 때 (`handleMoodHeroPress`, `handleActivityHeroPress`)
- **동작 방식**:
  - 터치한 좌표(`locationX`, `locationY`)를 중심으로 방사형으로 아이콘(기분 캐릭터 또는 활동 아이콘) 파티클이 터져나감.
  - 크기 축소 애니메이션, 투명도 페이드아웃, 무작위 X/Y 궤적 포물선 적용.
- **목적**: 유저의 기록 성취감을 축하하고 재미있는 이스터에그 요소를 제공.

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

- **위치**: `SearchScreen.view.js` (중앙 개구리 이모지)
- **트리거**: `Pressable`의 `onPressIn`(터치 시 즉시), `onPressOut`(터치 해제 시)
- **동작 방식**: 
  1. **누적 성장(Combo Scale)**: 연타할 때마다 `scale` 수치를 0.15씩 증가시켜 최대 2.5배까지 확대. `useRef`를 사용하여 렌더링 부하 없이 상태 유지.
  2. **초고속 쉐이크**: 좌우 `±15deg` 각도로 40~80ms의 매우 짧은 주기의 흔들림(Shake)을 적용하여 타격감 극대화.
  3. **콤보 타이머**: 500ms 동안 추가 입력이 없으면 `comboScale`을 1로 초기화.
  4. **완벽한 복귀**: `onPressOut` 시점에 `scale`과 `rotate`를 모두 `Animated.spring`을 통해 정중앙(1, 0)으로 부드럽고 쫀득하게 복구.
- **기술적 강점**: 
  - `useNativeDriver: true`를 적용하여 JS 스레드 부하와 상관없이 기기 네이티브 레벨에서 60fps를 유지.
  - `onPressIn` 트리거를 통해 기존 `onPress`보다 체감 레이턴시를 100ms 이상 단축하여 '누르는 즉시 반응'하는 손맛을 구현.
- **목적**: 검색 결과가 없는 정적인 화면에서 유저가 이탈하지 않고 앱의 캐릭터와 교감하며 즐거움을 느끼게 함.
