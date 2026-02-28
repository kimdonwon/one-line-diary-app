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
- **기본 색상**: 기분 데이터가 없을 때 기본으로 HAPPY(초록색, 개구리) 사용 (탭 바, 헤더, 효과 등 전체 통일)

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

- **목적**: 앱 하단의 전용 `SearchTab`을 통해 작성된 일기를 통합 검색
- **주요 로직**: 연간 일기 + 활동 내역 통합 검색 → 매칭 결과 최신순 렌더링

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
