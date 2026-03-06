# Implementation Specification (impl_spec.md)

이 파일은 프로젝트의 전반적인 비즈니스 로직, 데이터 흐름, 시스템 명세를 깊이 있게 기록하고 관리하는 문서입니다.

## 1. 프로젝트 및 아키텍처 개요

- **프레임워크**: React Native (Expo 튜닝), SQLite 의존성 사용
- **설계 패턴**: **Modular UI Developer** 패턴 적용. 각 스크린 및 복잡한 컴포넌트는 오직 `.logic.js` (상태, 이벤트 매핑 코어), `.view.js` (순수 렌더링), `.styles.js` (스타일 객체)로 철저히 역할 분리.
- **상태 관리**: 전역 상태는 React Context API(`DataContext`, `LockContext`, `AdContext`)를 활용하며, 지역 상태는 각 스크린의 `.logic.js` 내 커스텀 Hook으로 캡슐화.

---

## 2. 데이터베이스 및 스키마 명세 (db.js)

### 2.1. 테이블 구조

- **diary (일기 정보)**
  - `id` (INTEGER PK AUTOINCREMENT)
  - `date` (TEXT UNIQUE): 'YYYY-MM-DD' 형식의 식별자
  - `content` (TEXT): 텍스트 내용. *(멀티페이지의 경우 파싱 가능한 JSON 문자열 배열)*
  - `mood` (TEXT): 감정 키워드 (e.g. 'happy', 'sad')
  - `stickers` (TEXT): 스티커 정보 JSON 구조. *(단일페이지 1차원 배열, 멀티페이지 2차원 배열 방식 혼용)*
  - `photos` (TEXT): 첨부 사진 정보 JSON 구조. *(페이지별 2차원 배열)*
  - `backgrounds` (TEXT): 배경지 테마 ID 배열. (현재 UI는 숨김 처리)
- **activities (활동 기록)**
  - `id` (INTEGER PK AUTOINCREMENT)
  - `date` (TEXT)
  - `activity` (TEXT): 활동 유형 키 (e.g. 'work', 'study')
  - `title` (TEXT): 활동 세부 제목
  - `note` (TEXT): 한 줄 느낀 점
- **app_settings (설정 및 캐시)**
  - `key` (TEXT UNIQUE PK), `value` (TEXT)
  - 사용: Lock 활성화 여부, Pin 비밀번호, Premium 구독 여부 등 저장.

### 2.2. 안정성 확보 로직 (Mutex Queue & NPE 방지)

- **문제점**: `expo-sqlite`의 병렬 쿼리 시 발생하는 `NullPointerException` 등 고질적 Race Condition 방지.
- **구현**: `dbQueue` Promise 체인을 구현. 모든 쿼리(읽기/쓰기)는 큐 시스템을 거쳐 **순차적으로 대기열을 형성하고 하나씩 실행(Single-thread emulation)** 되도록 강제. 특정 쿼리가 실패해도 `catch` 블록으로 큐 붕괴를 막아 Failsafe 시스템 구축.

---

## 3. 핵심 비즈니스 로직 명세

### 3.1. 작성 및 수정 (WriteScreen Logic)

- **멀티페이지 시스템 (Multi-Page)**:
  - `useWriteLogic`에서 `pages`, `pageStickers`, `pagePhotos`의 2차원 상태 구조로 여러 페이지 관리.
  - 가로 슬라이더(`FlatList` + `pagingEnabled`)에서 화면 끝에 더미 요소 `'__ADD_PAGE__'`를 배치. 사용자가 끝까지 **엣지 스와이프**를 하면 자동으로 콜백을 타며 `addPage()` 호출.
- **드래그, 회전 & 크기 조절 (Draggable Engine)**:
  - 스티커, 사진, 텍스트에 공통 적용되는 `useDraggable` 커스텀 훅(`src/hooks/useDraggable.js`) 구현.
  - `PanResponder`를 통해 위치 이동(`Animated.ValueXY`), 회전(Math.atan2), 크기 조절(거리 비율(scaleRatio) 계산을 통한 `transformScale` 반영), 물리 바운더리 클램핑 등을 통합 관리하며 코드 중복을 최소화함.
  - 더블 탭 삭제(`DOUBLE_TAP_DELAY`) 및 회전/크기 조절 핸들의 3초 자동 선택 해제(`deselectTimer`) 로직이 내장됨.
- **다꾸 가챠 (Magic Decorate / Random Stickers)**:
  - 스티커 서랍 헤더의 요술봉(🪄) 버튼 탭 시 발동.
  - 현재 감정(`selectedMood`)을 기반으로 사전에 매핑된 카테고리 기분 기호 풀에서 스티커 2개를 뽑아 화면 내 랜덤 X/Y (-15° ~ +15° 회전 포함) 좌표에 계산 후 즉시 삽입.
  - 스티커 한도 검사 시 15개 제한 규칙이 선 적용됨.
- **사진 첨부 (Photo Frame)**:
  - 프레임 컬러(화이트, 블랙, 핑크, 블루, 민트)를 먼저 선택하면, `expo-image-picker`를 즉각 로드 (1:1 Aspect ratio, Quality 0.5 압축).
  - 로드 후 `photos` 배열에 드래거블 객체로 삽입됨. Z-Index 관리 로직상(Z:5) 스티커(Z:10) 아래, 텍스트(Z:8) 위에 무조건 덧대어짐.
- **디지털 스크랩북 캔버스 (Tap-to-Write)**:
  - 기존 고정 TextInput을 제거하고, 캔버스 전체를 Scrapbook 영역으로 전환.
  - 빈 캔버스를 터치(`handleCanvasTap`)하면 터치한 좌표에 편집 가능한 `DraggableText` 카드가 생성되며 자동 포커스.
  - `DraggableText`는 인라인 편집 지원: 선택 상태에서 한번 더 탭하면 TextInput 모드 진입, 내용 입력 후 포커스를 잃으면 자동 저장(`handleUpdateText`). 빈 텍스트는 자동 삭제.
  - 텍스트 카드는 멀티라인을 지원하여 내용에 따라 자동으로 높이가 늘어남 (장문 일기 대응).
- **스티커 팩 로딩 및 Sortable Grid 관리**:
  - `CATEGORY_STICKERS`, `STICKER_PACK_DATA` 로컬 데이터 세트 사용.
  - 서랍 관리 시 `react-native-sortable-grid`를 통해 배열 Index를 드래그로 스왑(`reorderCategories`), 비활성화(`enabledCatIds` 필터링) 반영. "랜덤 스티커팩" 등 신규 팩 지원.

### 3.2. 피드 및 뷰어 (DiaryFeed Logic)

- **피드 쿼리**:
  - `useAllDiaries` 훅을 사용해 전체 일기 로드(ASC 정렬로 최신 일기가 바닥으로 향하도록 배치. 진입 시 `scrollToEnd`).
  - `parseMultiPageData` 파서를 통과해 단일 페이지 일기도 멀티 페이지 포맷으로 정규화 처리. 멀티 페이지는 `FlatList`로 가로 스와이프 허용.
- **형광펜 드로잉 엔진**:
  - 피드 위에 SVG 오버레이(`pointerEvents` 조작)를 덮어, `PanResponder`로 드로잉 좌표 배열 수집.
  - `path` 엘리먼트 렌더러에 16px, `스트로크 라운드`, `opacity 0.45`을 갖춘 베지어 곡선(또는 선형 보간) 투사. UNDO/CLEAR 배열 스택 로직 운용. 사용자는 일기를 보면서 특정 부분에 V표나 강조 마킹 가능.

### 3.3. 요약 및 통계 구출 (Summary Logic)

- **차트 처리**: `getYearMonthlyActivities` 쿼리에서 모든 해당 월의 Data를 Reduce 처리.
- 기분 가중치 파악(Count), 활동별 그룹핑 산출. 상위 3가지 항목만을 필터링(`sort().slice()`)해 Bar Chart 게이지의 백분율 State로 주입.
- 빈 데이터 발생 가능성(엣지 케이스)에 대비하여 기본 Null/Zero-state fallback 객체를 반환.

### 3.4. 과금 및 광고사양 (AdContext & Business Policy)

- **제한 정책 (Hard Cap)**: 앱 전체 다이어리 작성 당 스티커는 최대 15장 (성능 및 UX 문제 고려).
- **Free User 로직**: 기본 스티커 부착 한도 3개. 추가 클릭 시 `SoftAlertModal`이 떠서 +2장 확장 보상형 광고(AdMob Reward) 유도 (15개까지 중첩 가능). 활성화 슬롯 서랍 3개.
- **Premium User 로직**: 한도 즉각 15장으로 기본 연장. 모든 광고 차단. 프리미엄 인증은 `SettingsContext`를 타고 DB 캐싱.

### 3.5. 암호화 백업 로직 (Backup/Restore Logic)

- **Export**: DB 순회 → `JSON.stringify` → **AES-256 (Crypto-js ECB/PKCS7)** 로 암호화 → `JSZip` 사용해 암호화된 JSON텍스트 + `expo-file-system`의 Diary_Photos Base64를 함께 Zip으로 묶은 뒤 `expo-sharing` 트리거.
- **Import**: `expo-document-picker`로 Zip 로드 → JSZip 언패킹 → 이미지 FileSystem 복사 이동 → `data.json` 복호화 후 Schema Migrate → DB DROP & Truncate 후 INSERT TRANSACTION.

---

## 4. 확장 인터페이스 및 유지보수

...

### 4.1. 주요 버그 수정 (Major Bug Fixes)

- **곰(SOSO) 캐릭터 렌더링 에러**: `BearCharacter`가 웹용 SVG 태그(`<svg>`, `<path>`)를 사용하여 React Native에서 렌더링되지 않던 문제를 `react-native-svg` 컴포넌트로 교체하고 속성명을 CamelCase로 수정하여 해결함.
