# 📔 Implementation Specification (impl_spec.md)

이 문서는 프로젝트의 핵심 비즈니스 로직, 데이터 구조 및 시스템 설계 명세를 관리하는 "기술 실무 지침서"입니다.

---

## 1. 아키텍처 개요

- **프레임워크**: React Native (Expo) + SQLite
- **디자인 패턴 (Modular UI Developer)**:
  - `.logic.js`: 상태 관리 및 이벤트 처리 (캡슐화된 커스텀 훅)
  - `.view.js`: 순수 UI 렌더링 (Stateless)
  - `.styles.js`: 스타일 객체 분리
- **설계 원칙**: 디자인과 로직의 엄격한 분리, 기능의 모듈화 및 재사용성 확보.

---

## 2. 데이터베이스 시스템 (SQLite)

### 2.1 테이블 명세

| 테이블명 | 주요 컬럼 | 설명 |
|:--- |:--- |:--- |
| **diary** | `id`, `date`, `content`, `mood`, `stickers`, `photos`, `texts`, `updated_at` | 일기 본문 및 모든 드래거블 요소(JSON), 수정 시간 저장 |
| **activities** | `id`, `date`, `activity`, `title`, `note` | 사용자 일일 활동 기록 (Unique: date + activity) |
| **comments** | `id`, `diary_date`, `content`, `created_at`, `character` | 곰돌이/캐릭터의 피드백 댓글 저장 |
| **app_settings** | `key`, `value` | 잠금 설정, 프리미엄 상태, 벤토 키워드 캐시 등 |
| **word_stats** | `id`, `date`, `word`, `count` | 키워드 분석 데이터 (증분 동기화 방식) |

### 2.2 엔진 최적화 및 안정성

- **성능 최적화 (WAL Mode)**: `PRAGMA journal_mode = WAL;`을 적용하여 동시 읽기/쓰기 성능을 극대화하고 데이터 손상을 방지함.
- **데이터 무결성 (Atomic Transactions)**: 일기 저장 시 `BEGIN TRANSACTION`, `COMMIT`, `ROLLBACK`을 사용하여 일기, 활동, 댓글 데이터의 원자적 저장을 보장함.
- **DB 안정성 가드 (Mutex Queue)**:
  - `expo-sqlite`의 Race Condition 차단을 위해 `dbQueue` Promise 체인 수립.
  - 모든 쿼리는 단일 큐를 통해 순차적으로 실행되어 NPE(NullPointerException)를 원천 봉쇄함.
- **마이그레이션 전략**: `initDB` 시점에 `ALTER TABLE` 문을 순차적으로 실행하여 기존 데이터 유지하며 스키마 확장.

---

## 3. 핵심 엔진: 드래그 & 인터랙션 (v3.0)

### 3.1 통합 드래그 훅 (`useDraggable`)

모든 드래거블 요소(Text, Photo, Sticker)는 단일 엔진을 공유하며 시각적 피드백과 정교한 보정 로직을 내장합니다.

- **시각적 피드백 (Visual Feedback)**:
  - **생성 애니메이션**: 아이템 추가 시 바텀시트에서 캔버스로 날아오는 `spring` 효과 적용.
  - **씰룩 효과 (Wiggle)**: 선택 시 좌우로 흔들리는 애니메이션(`Animated.sequence`)으로 활성 상태 명시.
  - **자동 해제**: 5초간 상호작용이 없으면 자동으로 선택 상태 해제(타이머 로직).

- **정교한 보정 시스템 (Inverse Logic)**:
  - **역보정 스케일 (Inverse Scale)**: 부모 요소(아이템)가 확대/축소되어도 조작 핸들(회전, 수정 버튼)의 크기는 일정하게 유지(`interpolate` 활용).
  - **역보정 오프셋 (Inverse Offset)**: 스케일에 상관없이 테두리 이격 거리(-24px)와 드래그 막대 위치(-36px)를 고정.
  - **플립 오프셋 (Flip Offset)**: 아이템이 캔버스 벽에 가까워지면 조작 핸들이 가려지지 않도록 위치를 자동으로 반전시킴.

- **제스처 제어 (Advanced Gesture)**:
  - **스마트 롱프레스**: 비선택 상태에서만 400ms 대기 적용. 이미 선택된 아이템은 즉시 드래그 가능.
  - **캡처 우선순위**: 선택 상태에서만 제스처를 선점하여 부모(FlatList)의 페이징 스크롤을 차단.
  - **쓰레기통 인터랙션**: 드래그 중 실시간 위치(`onDragMove`)를 보고하여 하단 삭제 영역 활성화 연동.

- **DraggableText 최적화**:
  - `TextInput`을 Uncontrolled 모드로 운용하여 한글 IME 조합 중 리렌더링 제거.
  - 텍스트 값은 `useRef`로 추적, 편집 종료 시에만 state 동기화.

---

## 4. UI/UX 시스템 섹션

### 4.1 하단 탭바 & 툴 패널

- **Bottom Bar (Dual Mode)**:
  - `nav`: 메인 탭 네비게이션용.
  - `action`: 작성 화면 전용 (중앙 완료 버튼 + 기분 색상 동기화).
- **Tool Panel (Floating Glass Island)**:
  - 반투명 블러 효과(`BlurView`) 가로 스와이프 도크.
  - **레이어링**: 키보드 간섭 방지 및 zIndex 이슈 해결을 위해 루트 레이어에 배치.

### 4.2 멀티페이지 캔버스

- **데이터 구조**: `pages` 기반 2차원 데이터 상태 (`stickers[page][index]` 방식).
- **자동 확장**: 마지막 페이지 엣지 스와이프 시 `__ADD_PAGE__` 트리거를 통한 무한 페이지 생성 지원.
- **실시간 컬러 매칭**: 현재 페이지의 배경색과 앱 전체 테마(상단 바, 탭바) 배경색을 동기화하여 몰입감 증대.

---

## 5. 분석 및 시스템 유틸리티

### 5.1 키워드 분석 엔진

- **분석 로직 (WordAnalyzer)**:
  - **Hermes 호환성**: 유니코드 속성 대신 명시적 문자 범위(`\uAC00-\uD7AF`) 정규식 사용.
  - **멀티 소스 수집**: 일기 본문(`content`)뿐만 아니라 캔버스 내 텍스트(`DraggableText`)까지 통합 수집.
  - **불용어 필터링**: 한국어 조사, 대명사, 접속사 등 50여 개 단어 필터링.
- **벤토 보드 (Bento Board)**:
  - 연간 데이터를 타입 중심의 타일 레이아웃으로 시각화.
  - 메인/상태/활동/기분 타일로 구분하여 직관적인 데이터 통계 제공.

### 5.2 백업 및 보안

- **보안**: 락스크린 핀코드 인증 및 생체 인식 확장성 확보.
- **백업 (v2.0.0)**:
  - `JSZip`을 이용한 데이터 + 사진 통합 패키징.
  - 복구 시 `word_stats`를 실시간 재계산하여 통계 일관성 유지.

---
*Last Updated: 2026-03-18*
