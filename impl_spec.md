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
    - `HomeTab` (MainScreen): 메인 달력 및 목록 뷰
    - `StatsTab` (SummaryScreen): 캘린더 요약 뷰
    - `WriteTab` (Action Button): 탭 이동 대신 `WriteScreen` 스택 모달 띄우기
    - `SearchTab` (SearchScreen): 통합 검색 화면
    - `SettingsTab` (SettingsScreen): 설정 화면
  - **Stack Screens**:
    - `MainTabs`: 하단 탭 내비게이터 (기본 뷰)
    - `Write`: 일기 작성 창 (스택 푸시 전환)
    - `Summary`: 별도 통계 접근 (보존)
    - `ActivityList`, `MoodList`: 리스트 상세 뷰

### 2. 데이터베이스 스키마 및 트랜잭션 (src/database/db.js)

- **목적**: `expo-sqlite`를 활용한 로컬 데이터 영구 저장 및 동시성 에러 관리.
- **테이블 스키마**:
  - `diary`: `id` (PK), `date` (UNIQUE), `content`, `mood`, `stickers` (새로 추가됨: 컴포넌트 내부 스티커 배치를 위한 JSON 텍스트)
  - `activities`: `id` (PK), `date`, `activity`, `title` (기본값 ''), `note` (기본값 '')
- **특이 사항 & 동시성 제어 (Mutex Queue)**:
  - 병렬로 여러 번의 DB 접근 시 `NativeDatabase.prepareAsync`에서 발생할 수 있는 널포인터 예외를 방지하기 위해, 모든 DB 작업을 `dbQueue` (Promise 체인)를 통해 **순차적으로 실행(`enqueueDBTask`)** 하도록 구현되어 있습니다.
  - Fast Refresh 시 모듈 변수 초기화 문제를 우회하기 위해 `ensureDB`로 체크합니다.
  - `diary` 테이블의 `stickers` 컬럼은 객체 배열(`[{id, type, x, y}]`)을 `JSON.stringify` 포맷으로 직렬화/역직렬화하여 관리합니다.

### 3. 검색 기능 명세 (`useSearchLogic`, `SearchScreen`)

- **목적**: 앱 하단의 전용 `SearchTab`을 통해 작성된 일기를 통합 검색
- **주요 컴포넌트**:
  - `SearchScreen.js` (전용 화면 컴포넌트):
    - 상단 `SearchBar` 에서 텍스트 입력 및 초기화 지원.
    - 검색된 다이어리 목록(`DiaryListItem`) 렌더링.
  - `SearchLayer.js`:
    - `SearchBar`: 검색 바 UI 전용 컨테이너 컴포넌트.
- **주요 로직** (`useSearchLogic.js`):
  - 탭 진입 시 연간 일기(`getYearDiaries`)와 활동 내역(`getYearAllActivities`) 데이터를 전체 조회.
  - 검색 시 일기의 내용(content) 및 활동의 타이틀, 노트 파편들을 통합 검색하여 매칭 탐색.
  - 매칭된 활동이 발생한 날짜에 해당하는 기분 일기를 병합하고, 중복을 제거한 후 최신순 내림차순 리스트(`filteredResults`)로 렌더링.
