# Implementation Specification (impl_spec.md)

이 파일은 프로젝트의 비즈니스 로직과 시스템 명세를 기록하는 곳입니다.

## 현재 프로젝트 개요

- **React Native / Expo 기반 다이어리 앱**

## 시스템 로직 명세

### 1. 전역 상태 및 메인 엔트리 (App.js)

- **목적**: 애플리케이션의 메인 컨테이너, 네비게이션 설정 및 기초 환경(DB) 초기화.
- **주요 로직**:
  - `initDB`를 호출하여 SQLite 데이터베이스를 비동기적으로 초기화합니다.
  - DB 초기화 전에는 귀여운 애니메이션 효과가 들어간 `LoadingScreen` 컴포넌트를 렌더링합니다.
- **네비게이션 (Navigation)**: `@react-navigation/native-stack` 및 `@react-navigation/bottom-tabs` 혼합 사용
  - **MainTabs (BottomTabNavigator)**:
    - `HomeTab` (MainScreen): 메인 달력 및 목록 뷰 (우상단에 검색 버튼 포함)
    - `DiaryTab` (DiaryFeedScreen): 인스타 피드 스타일 일기 열람 + 드로잉
    - `WriteTab` (Action Button): 탭 이동 대신 `WriteScreen` 스택 모달 띄우기
    - `SummaryTab` (SummaryScreen): 캘린더 요약 뷰
    - `SettingsTab` (SettingsScreen): 설정 화면
  - **Stack Screens**:
    - `MainTabs`: 하단 탭 내비게이터 (기본 뷰)
    - `Write`: 일기 작성 창 (스택 푸시 전환)
    - `Summary`: 별도 통계 접근 (보존)
    - `Search`: 검색 화면 (메인 헤더에서 스택 진입)
    - `ActivityList`, `MoodList`: 리스트 상세 뷰
- **기본 색상**: 기분 데이터가 없을 때 기본으로 HAPPY(초록색, 개구리) 사용 (탭 바, 헤더, 효과 등 전체 통일)

### 3.3. 활동(Activity) 선택 알고리즘

- **목적**: `WriteScreen`에서 27가지 활동 리스트 중 사용자가 특정 활동들을 선택/해제하는 로직.
- **데이터 흐름**:
  1. `useWriteLogic` 호출 시 DB에서 기존 등록 활동 가져오기 (`getActivities`).
  2. 로컬 상태 `activityList` 배열 생성 (기본 `constants/activities.js` 배열 + `selected: boolean`).
  3. `toggleActivity(key)` 실행 시 해당 아이템의 `selected` 상태만 반전.

---

## 4. 다이어리 피드 및 댓글 기능 (Diary Feed & Comments)

- **목적**: 인스타그램 피드처럼 모든 일기를 한 눈에 모아보고, '과거의 나'에게 남기는 P.S.(댓글) 기능을 통해 앱의 사용성을 강화.
- **상세 설명**:
  - `DiaryFeedScreen`은 `useAllDiaries` 훅을 통해 DB에 저장된 모든 일기를 가져와 최신순/과거순으로 렌더링.
  - 리스트 내 개별 다이어리 카드 하단에 '댓글 추가/보기' 버튼을 노출.
  - 버튼을 누르면 하단에서 `BottomSheet` 모달이 올라오며, 해당 날짜의 댓글 타래(Thread)를 렌더링.
  - 노면(Notion) 스타일의 미니멀리즘 디자인 시스템(모노크롬 베이스, 1px 보더 등)을 엄격히 준수하여 디자인 톤앤매너 통일.
- **데이터 흐름**:
  1. `db.js` 내 `comments` 테이블 사용 (`diary_date`를 외래 키처럼 사용하여 일기와 매핑).
  2. `DiaryFeedScreen` 최초 진입 시 `useAllCommentCounts` 훅을 통해 각 일기별 댓글 개수를 미리 가져옴 (`getAllCommentCounts()`).
  3. 모달에서 댓글을 남기면 `saveComment()` 호출 후 `DeviceEventEmitter`로 갱신 이벤트 발송, 앱 전체에서 즉각 모달 내 리스트 및 피드의 댓글 수 업데이트.
- **주요 로직 함수 (hooks/useDiary.js)**:
  - `useCommentsForDiary(diary_date)`: 특정 날짜의 댓글 타래 스내핑.
  - `useAllCommentCounts()`: 모든 다이어리의 댓글 수 스냅샷 로드.
  - `saveComment(diary_date, content)`: 새 댓글 DB 저장 로직.

### 2. 데이터베이스 스키마 및 트랜잭션 (src/database/db.js)

- **목적**: `expo-sqlite`를 활용한 로컬 데이터 영구 저장 및 동시성 에러 관리.
- **테이블 스키마**:
  - `diary`: `id` (PK), `date` (UNIQUE), `content`, `mood`, `stickers` (JSON 텍스트)
  - `activities`: `id` (PK), `date`, `activity`, `title` (기본값 ''), `note` (기본값 '')
  - `app_settings`: `key` (PK), `value` — 설정값 저장 (isLockEnabled, password, isPremium)
- **특이 사항 & 동시성 제어 (Mutex Queue)**:
  - 병렬 DB 접근 시 널포인터 예외 방지를 위해 `dbQueue` (Promise 체인)를 통해 순차 실행
  - `diary` 테이블의 `stickers` 컬럼은 객체 배열(`[{id, type, isGraphic, x, y, rotation}]`)을 `JSON.stringify` 포맷으로 직렬화/역직렬화하여 관리합니다. (`rotation`은 도(degree) 단위 회전값, 미지정 시 `0`)
  - Fast Refresh 시 `ensureDB`로 모듈 변수 초기화 문제 우회

### 3. 데이터베이스 안정성 및 예외 처리 (Concurrency & NPE)

- **문제 배경**: `expo-sqlite`의 `NativeDatabase.prepareAsync`는 병렬 쿼리 실행 시 내부적으로 `NullPointerException`을 발생시키는 고질적인 문제가 있습니다.
- **해결책 (Mutex Queue)**:
  - `db.js` 내부에 `dbQueue` (Promise chain)를 구축하여 모든 쿼리를 **순차적(싱글 스레드처럼)으로 실행**합니다.
  - `enqueueDBTask` 함수가 이전 쿼리의 종료를 기다린 후 다음 쿼리를 실행함으로써 커넥션 충돌을 방지합니다.
- **장애 대응 (Failsafe)**:
  - 특정 쿼리가 실패하더라도 `dbQueue` 전체가 멈추지 않도록 `catch` 블록에서 대기열을 유지합니다.
  - 핵심 쿼리(`getYearMonthlyActivities` 등)에는 개별 `try-catch`를 추가하여 에러 발생 시 앱이 멈추지 않고 빈 배열(`[]`)을 반환하도록 설계되었습니다.

### 4. 검색 기능 명세 (`useSearchLogic`, `SearchScreen`)

- **목적**: 메인 화면 상단 우측 검색 버튼을 통해 작성된 일기를 통합 검색 (Stack Navigator 전환)
- **주요 로직**: 연간 일기 + 활동 내역 통합 검색 → 매칭 결과 최신순 렌더링

### 5. 다이어리 피드 (`DiaryFeedScreen`)

- **목적**: 인스타그램 피드처럼 모든 일기를 위아래로 스크롤하며 열람
- **디렉토리**: `src/screens/DiaryFeedScreen/` (view, logic, styles, index)
- **주요 로직 (`useDiaryFeedLogic`)**:
  - `useAllDiaries` 훅으로 전체 일기 로딩 (날짜 ASC 정렬)
  - 최신 일기가 아래에 위치 → FlatList `scrollToEnd` 자동 호출
  - 드로잉 모드 ON/OFF 상태 관리
  - 펜 스트로크 (points, color, width) 배열 관리
  - undo/clear 기능
- **드로잉 시스템**:
  - `PanResponder`로 터치 입력 캡처
  - SVG 오버레이에 quadratic bezier (smooth) path 렌더링
  - 형광펜 효과: `opacity={0.45}`, `strokeWidth={16}`, `strokeLinecap="round"`
- **드로잉 영역**: 하단 탭바를 제외한 전체 화면
- **데이터 흐름**:
  1. 화면 진입 → `useAllDiaries()` 전체 일기 로드
  2. FlatList 렌더링 → `onContentSizeChange` 콜백으로 최하단 스크롤
  3. 플로팅 펜 버튼 탭 → 드로잉 모드 토글 (ON/OFF)
  4. 드로잉 모드 ON 상태:
     - 메인 버튼 아이콘이 `Highlighter`에서 빨간색 `Close(X)`로 변경됨
     - 메인 버튼 위에 `PenMenu` 버튼이 별도로 나타남
     - `PenMenu`를 통해 '되돌리기', '전체 지우기', '펜 모드 종료' 가능
  5. 터치 드래그 → SVG path 실시간 렌더링
- **일기 카드 구조**:
  - WriteScreen의 inputCard와 동일한 minHeight(280px) 및 스타일
  - 스티커 오버레이 (`StaticSticker` 컴포넌트 활용, 회전값 반영)
  - 하단 메타: 날짜 (`M월 D일`) + 활동 아이콘 + 기분 캐릭터 (`MoodCharacter`)

### 5.0.1. 스티커 회전 기능 (Sticker Rotation)

- **목적**: 스티커를 회전시켜 다꾸의 자유도를 높이고 더욱 개성 있는 일기 꾸미기를 지원
- **방식 1 — 핀치 제스처 (Pinch-to-Rotate)**: `PanResponder`의 이동값을 기반으로 각도를 계산하여 실시간 회전 적용
- **방식 2 — 회전 핸들 (Single-Handle Rotation)**: 스티커 터치(선택) 시 우하단에 `↻` 아이콘의 작은 원형 핸들이 나타남. 이 핸들을 드래그하여 정밀하게 각도 조절 가능
- **선택 상태**: 스티커를 터치하면 점선 테두리가 나타나 활성화 상태를 시각적으로 표현. **3초** 동안 조작이 없으면 자동으로 선택 해제
- **데이터 저장**: 스티커 객체에 `rotation` 필드(도 단위)를 추가. `handleDragEnd(id, x, y, rotation)`을 통해 DB에 영구 저장
- **피드 반영**: `StaticSticker` 컴포넌트에서 `transform: [{ rotate }]`를 적용하여 저장된 회전값이 피드에서도 동일하게 보임
- **구조 (Modular UI Developer 준수)**:
  - `DraggableSticker.logic.js`: 회전 상태(`rotation`, `currentRotation`), 선택 상태(`isSelected`), `handleRotation()`, `handleRotationEnd()` 관리
  - `DraggableSticker.view.js`: `RotationHandle` 컴포넌트, `Animated.View`에 `rotate` transform 적용
  - `DraggableSticker.styles.js`: `selected` (점선 테두리), `rotationHandle` (핸들 원형 도트) 스타일

### 5.1. 멀티페이지 일기 시스템 (Multi-Page Diary)

- **목적**: 하루에 하나의 일기만 쓸 수 있는 제한을 넘어, 한 날짜에 최대 5페이지까지 작성 가능하게 확장. 피드에서는 인스타그램처럼 가로 스와이프로 페이지를 넘겨볼 수 있음.
- **데이터 구조 (레거시 호환)**:
  - `diary.content`: 단일 페이지면 기존과 동일한 **일반 문자열**, 멀티페이지면 **JSON 배열 문자열** (`["페이지1", "페이지2"]`)
  - `diary.stickers`: 단일 페이지면 기존 **1차원 배열** (`[{id,type,x,y}]`), 멀티페이지면 **2차원 배열** (`[[stickers1], [stickers2]]`)
  - DB 스키마 변경 없이 기존 데이터와 완벽한 하위 호환성 유지
- **작성 화면 (`WriteScreen`) 변경사항**:
  - `pages` 배열과 `pageStickers` 2차원 배열로 멀티페이지 상태 관리 (`useWriteLogic`)
  - `currentPageIndex`로 현재 편집 중인 페이지 추적
  - `addPage()`: 새 빈 페이지 추가 (최대 5페이지 제한, 초과 시 알림 모달)
  - `deletePage(index)`: 페이지 삭제 (최소 1페이지 유지)
  - `goToPage(index)`: 도트 인디케이터 탭으로 페이지 이동
  - 저장 시 빈 후행 페이지 자동 정리, 단일 페이지면 레거시 형식으로 저장
- **일기 카드 (`DiaryEntryCard`) 변경사항**:
  - `parseMultiPageData()` 유틸 함수로 content/stickers를 멀티페이지 형태로 파싱
  - 멀티페이지인 경우 `FlatList` (horizontal, pagingEnabled)로 가로 스와이프 구현
  - 하단에 인스타그램 스타일 도트 인디케이터 표시 (활성 페이지는 넓은 바, 비활성은 원형 점)
  - `onMomentumScrollEnd`로 현재 페이지 인덱스 추적
  - 단일 페이지 일기는 기존과 동일하게 렌더링 (성능 보존)
- **검색 대응 (`useSearchLogic`)**:
  - `d.content`가 JSON 배열인 경우 모든 페이지를 합쳐서 검색 대상으로 활용 (`parsed.join(' ')`)
- **페이지 네비게이션 UI (Floating Glass Pill)**:
  - 입력 카드 하단에 하나의 '알약(Pill)' 조형물 형태로 묶여 공중에 띄워진 UI
  - 배경은 반투명 글래스(`rgba(255, 255, 255, 0.9)`)와 소프트 쉐도우 적용
  - 구성: `[ ✕ | • • • | + ]` (아이콘/텍스트 기호 기반 미니멀리즘)
  - **삭제 확인**: `✕` 버튼 클릭 시 `SoftAlertModal`을 통해 "페이지 삭제" 확인 절차를 거침 (실수 방지)

### 6. 요약 및 통계 분석 (Summary & Analysis)

- **목적**: 연간/월간 일기 데이터를 시각화하여 사용자의 기분 변화와 활동 패턴을 분석.
- **상세 내역**: 상세 디자인 및 데이터 로직은 [chart_spec.md](./chart_spec.md) 문서 참조.
- **주요 기능**:
  - 기분 비율 (Mood Pie/Bar) 및 월별 추이 (Line Chart)
  - 활동 빈도 (Activity Bar) 및 월별 추이 (Line Chart)
  - **기분 x 활동 상관관계**: 어떤 활동을 할 때 가장 행복한지 분석 (상위 5개)
  - **자주 쓴 스티커**: 가장 많이 사용한 스티커 TOP 3 랭킹

### 7. 생체인증 + PIN 잠금 시스템 (`LockContext`, `LockScreen`)

- **목적**: 앱 진입 시 사용자 인증을 통한 프라이버시 보호
- **주요 컴포넌트**:
  - `LockContext.js`: 잠금 상태 전역 관리 Provider
  - `LockScreen.view.js`: PIN 입력 + 생체인증 화면
  - `PinSetupModal`: PIN 설정/변경 2단계 모달
- **데이터 흐름**:
  1. 앱 시작 → `LockProvider`가 `app_settings`에서 `isLockEnabled`/`password` 로드
  2. 잠금 활성화 & 비밀번호 존재 시 → `isLocked = true`
  3. `LockScreen` 마운트 → 생체인증(`expo-local-authentication`) 자동 시도
  4. 생체인증 성공 → `isLocked = false` (앱 진입)
  5. 생체인증 실패/취소 → PIN 입력 화면 표시 (`showPinFallback = true`)
  6. PIN 4자리 입력 → `unlock(input)` 검증 → 일치 시 잠금 해제
- **예외 처리**:
  - 생체인증 하드웨어 미지원 시 → PIN 화면 직행
  - PIN 오류 시 → 진동 + 흔들림(shake) 애니메이션 + 자동 초기화

---

## 7. 비즈니스 모델 및 유료화 정책 (Business Model)

상세한 비즈니스 스펙은 별도 문서 [business_spec.md](./business_spec.md)에서 관리합니다.

### 7.1. 주요 정책 요약

- **무료 사용자**: 스티커 서랍 활성화(3개), 스티커 부착(기본 3개, 광고 시청 시 최대 15개) 제한.
- **프리미엄 사용자**: 모든 활성화 제한 해제, 스티커 부착 한도 즉시 15개 상향, 광고 제거.
- **광고 보상형 모델**: 광고 1회 시청 시 해당 일기에 한해 스티커 한도 +2개 확장 (최대 15개).
- **데이터 보안**: 모든 백업 데이터는 AES-256으로 로컬 암호화되어 안전하게 공유됨.

---

## 6. 데이터 백업 및 복구 시스템 (Backup & Restore)

### 6.1. 백업 (Export)

- **목적**: 서버 없이 사용자의 소중한 일기 데이터를 안전하게 외부로 내보내기.
- **상세 설명**:
  - `db.js`의 `getAllData()`가 모든 테이블의 로우를 긁어모아 하나의 JSON 객체로 만듭니다.
  - `expo-file-system`을 이용해 로컬 임시 폴더에 `.json` 파일을 생성합니다.
  - `expo-mail-composer`를 사용해 해당 파일을 메일 앱의 첨부파일로 실어 보냅니다. 메일 앱이 없는 경우 `expo-sharing`을 통해 클라우드나 메신저로 공유합니다.

### 6.2. 복구 (Import)

- **목적**: 기기 변경이나 앱 재설치 시 백업된 파일로 데이터를 이전 상태로 되돌리기.
- **상세 설명**:
  - `expo-document-picker`를 통해 사용자가 백업 파일을 직접 선택하게 합니다.
  - `restoreFromData(data)` 함수 내에서 SQLite 트랜잭션(`BEGIN/COMMIT/ROLLBACK`)을 사용하여 기존 데이터를 모두 삭제하고 백업본을 일괄 삽입합니다.
  - 데이터 무결성을 위해 테이블 구조와 버전이 일치하는지 최소한의 검증을 거칩니다.

### 6.3. 구매 내역 복원 (Purchase Restore)

- **목적**: 앱 삭제 후 재설치 시에도 사용자가 과거에 구매한 유료 혜택(프리미엄, 스티커)을 그대로 유지.
- **상세 설명**:
  - 인앱 결제의 '비소모성(Non-consumable) 상품' 원칙을 활용합니다.
  - 설정 화면의 '구매 내역 복원' 버튼 클릭 시 스토어 계정 정보를 조회하여 구매 기록을 DB 및 로컬 상태에 재반영합니다.
  - 현재는 오프라인 환경을 고려하여 2초 후 성공하는 시뮬레이션 로직으로 구현되어 있습니다.
