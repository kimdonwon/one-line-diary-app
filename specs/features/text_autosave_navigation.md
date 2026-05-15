# Feature: Text Autosave on Navigation

## 1. 개요
사용자가 `DraggableText` 편집 모드(커서가 깜빡이는 상태)에서 저장 버튼을 누르지 않고 시스템 뒤로 가기 또는 내비게이션 뒤로 가기를 수행할 때, 현재까지 입력된 텍스트가 유실되지 않고 자동으로 저장되도록 함.

## 2. 현상 및 원인 분석
- **현상**: 텍스트 입력 중 뒤로 가기 시, 마지막 입력값이 반영되지 않고 이전 상태로 복구됨.
- **원인**: 
    - `DraggableText`는 성능을 위해 입력 중에는 `Ref`에만 값을 보관함.
    - 실제 부모 상태로의 동기화(`onTextChange`)는 `onBlur` 시점에 발생함.
    - `handleFinishEditing` 함수 내에 100ms의 `setTimeout`이 존재하여, 컴포넌트 언마운트 시 동기화 로직이 실행되지 못하고 폐기됨.
- **1차 시도 실패 원인 (Keyboard.dismiss + 200ms 대기)**:
    - `Keyboard.dismiss()`는 키보드만 숨기고, TextInput의 `onBlur`/`onEndEditing`을 트리거하지 **않음** (React Native Android 동작).
    - 따라서 아무리 기다려도 `handleFinishEditing` → `onTextChange` → `setPageTexts` → `latestData` 체인이 작동하지 않음.

## 3. 요구 사항
- 사용자가 명시적으로 '저장'을 누르지 않아도, 화면을 벗어나는 시점에 편집 중인 텍스트가 있다면 부모 상태에 반영되어야 함.
- 빈 텍스트인 경우 기존 로직과 동일하게 삭제 처리되어야 함.

## 4. 해결 방안 (최종 구현) — 실시간 Ref 동기화

### [핵심 전략: Pending Text Edits Ref]

타이밍 해킹(setTimeout, Keyboard.dismiss 등) 대신, **DraggableText가 매 키 입력마다 부모의 Ref에 현재 텍스트를 기록**하는 방식.

**데이터 흐름:**
1. `WriteScreen.logic.js`에 `pendingTextEditsRef = useRef({})` 생성.
2. `handlePendingTextUpdate(id, text)` 콜백을 DraggableText에 전달 (Ref만 갱신, setState 아님 → 리렌더링 0회).
3. DraggableText의 `handleChangeText`에서 `localTextRef` 갱신과 동시에 `onPendingTextUpdate(id, val)` 호출.
4. `beforeRemove` 발동 시:
    - `e.preventDefault()`로 내비게이션 일시 중단.
    - `pendingTextEditsRef.current`의 미커밋 텍스트를 `latestData.current.pageTexts`에 머지.
    - 머지된 데이터로 `saveDiary` 실행.
    - `navigation.dispatch(e.data.action)`으로 내비게이션 재개.
    - `isSavingRef` 가드로 재진입 무한루프 차단.

**장점:**
- 성능 영향 제로 (Ref 업데이트만, 리렌더링 없음)
- 타이밍 이슈 자체가 불가능 (데이터가 항상 즉시 사용 가능)
- `Keyboard.dismiss()`, `blur()` 이벤트에 의존하지 않음

**보조 방어: Emergency Commit (Component Level)**
- `DraggableText`의 `useEffect` cleanup에서 `committedTextRef`와 `localTextRef` 비교.
- 미커밋 텍스트가 있으면 즉시 `onTextChange` 호출 (언마운트 시 최후의 보루).

## 5. 변경 파일
- `src/components/DraggableText/DraggableText.view.js`: 
    - `onPendingTextUpdate` prop 추가, `handleChangeText`에서 호출.
    - `committedTextRef` + Emergency Commit useEffect cleanup.
- `src/screens/WriteScreen/WriteScreen.logic.js`: 
    - `pendingTextEditsRef` + `handlePendingTextUpdate` 콜백 생성.
    - `beforeRemove` 핸들러에서 pending edits 머지 후 저장.
    - `isSavingRef` 재진입 가드.
- `src/screens/WriteScreen/WriteScreen.view.js`: 
    - `handlePendingTextUpdate` destructuring 및 DraggableText prop 전달.
