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
  - `diary` 테이블의 `stickers` 컬럼은 객체 배열(`[{id, type, x, y}]`)을 `JSON.stringify` 포맷으로 직렬화/역직렬화하여 관리합니다.
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
  - 드로잉 모드에서 FlatList `scrollEnabled={false}` 처리
  - 드로잉 영역: 하단 탭바를 제외한 전체 화면
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
  - 스티커 오버레이 (`StaticSticker` 컴포넌트 활용)
  - 하단 메타: 날짜 (`YYYY년 M월 D일 X요일`) + 기분 이모지 (MoodCharacter)

### 5. 생체인증 + PIN 잠금 시스템 (`LockContext`, `LockScreen`)

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

### 5. 프리미엄 상태 관리

- **목적**: 유료 기능(스티커 제한 해제) 임시 구현
- **데이터 흐름**:
  - `app_settings` 테이블의 `isPremium` 키로 관리
  - `SettingsScreen`에서 토글 버튼으로 활성화/비활성화
  - `WriteScreen.logic.js`에서 `isPremium` 로드 → 스티커 최대 개수 조절 (free: 5개, premium: 99개)
