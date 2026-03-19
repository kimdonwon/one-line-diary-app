# Bug Fix Log (bug.md)

이 파일은 앱 개발 중 발생한 주요 버그와 그 해결 과정을 기록합니다.

---

## 1. 활동(Activity) 저장 누락 해결 (2026-03-09)

- **증상**: 활동을 선택하고 일기 쓰기를 저장한 후 나갔다 오면 선택한 활동이 사라지거나 제목/메모가 저장되지 않음.
- **원인**:
    1. `db.js`의 `saveActivities` 함수가 `title`과 `note` 필드를 빈 문자열(`''`)로 고정하여 삽입하고 있었음.
    2. `WriteScreen.logic.js`에서 `activityStates` 상태가 자동 저장을 관장하는 `latestData` (useRef) 선언보다 늦게 정의되어, 자동 저장 시 초기화되지 않은 상태를 참조하여 데이터가 누락될 가능성이 있었음.
- **해결**:
    1. `db.js`: `saveActivities`에 트랜잭션을 적용하고, 넘겨받은 활동의 `title`, `note`를 올바르게 저장하도록 수정.
    2. `WriteScreen.logic.js`: `activityStates` 상태 선언부를 `latestData` 선언 이전(상단)으로 이동하여 데이터 무결성 확보. 중복 선언된 상태들 정리.
- **참고 스킬**: `Logic Documenter`, `Modular UI Developer`

## 2. 주요 버그 수정 (Major Bug Fixes)

- **곰(SOSO) 캐릭터 렌더링 에러**: `BearCharacter`가 웹용 SVG 태그(`<svg>`, `<path>`)를 사용하여 React Native에서 렌더링되지 않던 문제를 `react-native-svg` 컴포넌트로 교체하고 속성명을 CamelCase로 수정하여 해결함.
- **기쁨(HAPPY) 개구리**: 입을 크게 벌리고 웃는 형태로 SVG Path를 수정함. 몸체 색상을 차분한 파스텔톤(#B4DCC6)으로, 얼굴 외곽선은 딥 네이비(#283665) 및 두께 5.0으로 조정함. 눈 모양을 둥근 아치형(∩)으로 변경하고 테마 메인 색상을 개구리 피부색과 통일함.
- **화남(ANGRY) 병아리**: 개구리와의 시각적 일관성을 위해 외곽선 및 라인 아트 색상을 딥 네이비(#283665)로 통일하고, 스케일을 1.05에서 1.2로 확대 조정함.
- **당황(CONFUSED) 토끼 정렬**: 토끼 몸체가 화면 왼쪽으로 쏠려 보이던 현상을 해결하기 위해 X축 방향으로 10유닛 이동(translate)하여 중앙 정렬을 맞춤.
- **기분 선택 UI(Mood Selector) 정렬**: 텍스트 높이 편차로 인해 캐릭터가 삐뚤어 보이던 현상을 해결하기 위해 `includeFontPadding: false` 적용 및 `flex-start` 기반 상단 정렬로 오와열을 맞춤.
- **활동 아이콘(Activity Icons) 전면 재디자인**: `ActivityIcons.js`의 그래픽을 기분 캐릭터들과 동일한 "Doodle Flash" 스타일(딥 네이비 외곽선 #283665, 파스텔 색상, 둥글고 귀여운 쉐입, 굵은 선 두께 4.5)로 전면 재설계함.
- **곰(SOSO) 캐릭터 위치 조정**: 캐릭터가 전체적으로 상단에 치우쳐 보이던 현상을 해결하기 위해 Y축 방향으로 7유닛 이동(translate)하여 수직 중앙 정렬을 개선함.
- **도구 패널(Bottom Sheet) 클리핑 이슈 해결**: 하단 도구 패널이 일기 카드(`integratedDiaryCard`) 내부에 위치하여 콘텐츠가 짤리던 문제를 해결하기 위해 컨테이너를 루트 뷰 수준으로 이동하고, `Keyboard.dismiss()` 연동 및 높이 조정을 통해 모든 화면 비율에서 정상 노출되도록 개선함.
- **Bebas 폰트 크기 조정**: 텍스트 상자에서 Bebas 폰트를 선택했을 때 글자 크기가 지나치게 커 보이던 문제를 해결하기 위해 기존 `18`에서 `15`로 기본 사이즈를 하향 조정함.
- **뒤로 가기 자동 저장 (Auto-save)**: 일기 쓰기 화면에서 명시적인 저장 버튼을 누르지 않더라도, 뒤로 가기(백 버튼 또는 제스처) 시 현재까지의 데이터가 자동으로 DB에 저장되도록 개선함.
- **기분 선택 모달 이탈 시 화면 종료**: 기분 선택 모달에서 외부 터치, 스와이프 또는 뒤로 가기 버튼을 누를 경우, 일기 쓰기를 취소하는 것으로 간주하여 이전 화면으로 돌아가도록 개선함. (데이터 무결성 확보)
- **기분 선택 모달 렌더링 잔상(Flashing) 해결**: 쓰기 화면 진입과 동시에 모달이 떠오르면서 화면 전환 애니메이션과 출동하여 깜빡이는 현상을 해결하기 위해, `setTimeout`(150ms)을 적용해 화면 트랜지션이 완료된 직후 부드럽게 모달이 마운트되도록 수정함.
- **단일 페이지 삭제 대응 (리셋 로직)**: 일기 페이지가 1개일 때도 인디케이터와 페이지 삭제 버튼이 노출되도록 UI 조건을 변경하고, 1페이지에서 삭제 시 모달 창(알림) 확인 후 스티커, 사진, 텍스트 등 모든 컨텐츠가 초기화(새 페이지 생성 느낌) 되도록 UX를 개선함.
- **활동(Activity) 저장 누락 해결**: `specs/bug.md`에서 상세 내용을 확인하세요.
- **메인 캘린더 롱프레스 터치 및 다중 데이터 삭제**: 메인 화면 캘린더의 일기가 있는 특정 날짜를 꾹 누르면(Long Press) 해당 날짜의 일기, 관련 활동, 댓글까지 한꺼번에 완전히 삭제할 수 있는 기능을 추가 구현함. (앱 공통 SoftAlertModal 적용)
35:
36: ## 3. 선택 상태 드래그 시 페이지 이동 간섭 해결 (2026-03-13)
37:
38: - **증상**: 아이템이 선택된 상태에서 빠르게 드래그를 시작할 때, 좌우 페이지 슬라이드(FlatList 스와이프)가 함께 발생하여 드래그가 끊기거나 페이지가 넘어가는 현상 발생.
39: - **원인**: `onMoveShouldSetPanResponderCapture`에서 제스처를 가로채기 전 1픽셀의 최소 이동 거리(`moveDist > 1`) 조건을 두었는데, 빠른 제스처 시 이 짧은 찰나에 페이징 스크롤 엔진이 먼저 발동됨.
40: - **해결**: `useDraggable.js`의 캡처 단계에서 이미 선택된 아이템(`effectiveSelected`)인 경우 거리 체크 없이 즉시 `true`를 반환하도록 수정하여 부모 스크롤이 발동될 틈을 주지 않고 제스처를 선점함.
41: - **참고 스킬**: `Modular UI Developer`
42: - **파일**: `src/hooks/useDraggable.js`

## 4. Draggable Text 수정 버튼 터치 오류 해결 (2026-03-13)

- **증상**: Draggable Text가 선택된 상태에서 좌측 하단의 수정(연필) 버튼을 눌러도 반응이 없거나, 버튼을 누르려 할 때 미세한 움직임이 드래그로 오인되어 수정 모드 진입이 불가능한 현상.
- **원인**:
    1. **터치 우선순위 경합**: 부모 컴포넌트의 드래그 로직(`PanResponder`)이 선택 상태에서 더 높은 우선순위를 가져 터치를 가로챔.
    2. **Closure Trap**: `useRef`로 생성된 핸들러가 구식 상태값(`false`)을 참조하여 조건문에서 걸림.
- **해결**:
    1. **강력한 터치 가로채기**: 수정 버튼 영역에 `onPanResponderTerminationRequest: () => false`가 적용된 전용 `editResponder`를 구축하여 부모의 간섭을 원천 차단(회전 핸들과 동일한 설계).
    2. **클로저 트랩 제거**: 핸들러 내부의 구식 상태값 체크 조건문을 제거하고, 터치 경로를 `editResponder`로 일원화하여 로직 무결성 확보.
- **참고 스킬**: `Logic Documenter`, `Modular UI Developer`
- **파일**: `src/components/DraggableText/DraggableText.view.js`

## 5. Draggable Text 캔버스 이탈 방지 및 자동 줄바꿈 구현 (2026-03-13)

- **증상**: 텍스트를 캔버스 우측 경계 근처에 두고 긴 텍스트를 입력할 경우, 선택 박스가 캔버스를 뚫고 화면 밖으로 나가는 현상.
- **원인**: 드래그 시에만 경계 체크 로직이 작동하고, 정지 상태에서 텍스트 입력으로 인한 너비 확장은 실시간으로 제한하지 못함.
- **해결**:
    1. **Dynamic MaxWidth 설계**: `Animated.interpolate`를 사용하여 현재 X 위치(`pan.x`)에 따라 가질 수 있는 잔여 공간을 실시간으로 계산.
    2. **스케일 보정**: 확대/축소(`scale`) 상태에서도 시각적 경계가 유지되도록 `Animated.divide`를 통해 레이아웃상의 `maxWidth`를 동적으로 조정.
    3. **UX 개선**: 캔버스 우측 벽에 닿으면 텍스트가 뚫고 나가는 대신 자동으로 아래로 줄바꿈(Wrap)되도록 개선하여 데이터 가독성 확보.
- **참고 스킬**: `Modular UI Developer`
- **파일**: `src/components/DraggableText/DraggableText.view.js`

## 6. 화면 가장자리 아이템 드래그 시 페이지 밀림 현상 해결 (2026-03-14)

- **증상**: 캔버스 우측 끝에 붙은 요소를 왼쪽으로 드래그할 때, 요소는 가만히 있고 배경 페이지가 먼저 이동하다가 멈추는 현상.
- **원인**: `FlatList`의 `pagingEnabled`가 켜져 있어 가장자리 가로 드래그 시 네이티브 스크롤러가 JS 로직보다 우선적으로 반응함.
- **해결**: `useDraggable.js`의 `onMoveShouldSetPanResponderCapture` 단계에서 선택 여부와 관계없이 미세한 움직임(`moveDist > 0.1`)이 감지되면 즉시 `true`를 반환하여 부모의 스크롤을 차단함.
- **참고 스킬**: `Modular UI Developer`
- **파일**: `src/hooks/useDraggable.js`

## 7. 한글 텍스트 입력 튐 현상 (Layout Flickering) 해결 (2026-03-17)

- **증상**: 한글 입력 시, 특히 첫 글자나 짧은 문장을 입력할 때 텍스트가 순간적으로 앞으로 튀었다가 제자리로 돌아오는 시각적 글리치 발생.
- **원인**: `TextInput`을 Controlled 모드(`value` prop)로 사용하여 `onChangeText`마다 `useState`를 통한 리렌더링이 발생. 한글 IME 조합 중 매 프레임마다 컴포넌트 전체가 리렌더링되면서 `dynamicMaxWidth`(Animated.divide) 연산과 `transform` 스타일이 재평가되어 레이아웃 프레임과 충돌.
- **해결**:
    1. `TextInput`을 **Uncontrolled 모드**(value → defaultValue)로 전환하여 IME 조합 중 리렌더링 원인을 제거.
    2. 텍스트 값을 `useRef`(`localTextRef`)로 관리하여 타이핑 중 React 리렌더링 사이클을 완전히 우회.
    3. 표시용 상태(`displayText`)는 편집 종료 시에만 동기화하여 비편집 모드에서의 표시에 사용.
    4. `inputKey` state를 통해 `defaultValue` 갱신이 필요할 때 key를 변경하여 강제 리마운트.
- **참고 스킬**: `Modular UI Developer`, `Logic Documenter`
- **파일**: `src/components/DraggableText/DraggableText.view.js`

## 8. 드래거블 요소 선택 상태에서 좌우 스와이프 시 캔버스 밀림 현상 해결 (2026-03-17)

- **증상**: 드래거블 요소(텍스트, 사진 등)를 선택한 상태에서 빠르게 좌우로 스와이프하면, 요소가 드래그되는 대신 전체 캔버스 화면이 살짝 옆으로 밀리면서 중간에 멈춤.
- **원인**:
    1. **무차별 캡처**: `useDraggable.js`의 `onMoveShouldSetPanResponderCapture`에서 `moveDist > 0.1` 조건으로 선택 안 된 상태에서도 모든 움직임을 캡처하려 해, FlatList의 네이티브 스크롤러와 동시에 제스처를 점유하여 교착 상태 발생.
    2. **중복 정의**: `onPanResponderTerminationRequest`가 두 번 정의되어 나중 것(항상 `false`)이 덮어씌워지면서 모든 상황에서 제스처를 독점.
    3. **FlatList 비차단**: 선택된 아이템이 있어도 FlatList의 `scrollEnabled`/`pagingEnabled`가 `true`로 유지되어 네이티브 스크롤이 JS PanResponder보다 먼저 발동.
- **해결**:
    1. `onMoveShouldSetPanResponderCapture`에서 선택 상태에서만 캡처하도록 수정 (비선택 상태의 `moveDist > 0.1` 조건 제거).
    2. 중복 `onPanResponderTerminationRequest`를 제거하고, 선택/드래그 상태 기반의 조건부 반환으로 통합.
    3. `WriteScreen.view.js`에서 FlatList의 `scrollEnabled`와 `pagingEnabled`를 `!isDraggingAny && !selectedItemId` 조건으로 변경하여 아이템 선택 시 페이지 스크롤을 원천 차단.
- **참고 스킬**: `Modular UI Developer`, `Logic Documenter`
- **파일**: `src/hooks/useDraggable.js`, `src/screens/WriteScreen/WriteScreen.view.js`
