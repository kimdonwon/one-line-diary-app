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
  - `texts` (TEXT): 드래거블 텍스트 정보 JSON 구조. *(페이지별 2차원 배열, 각 노드: `{ id, text, fontId, color, bgColor, x, y, rotation, scale }`)*
- **activities (활동 기록)**
  - `id` (INTEGER PK AUTOINCREMENT)
  - `date` (TEXT)
  - `activity` (TEXT): 활동 유형 키 (e.g. 'work', 'study')
  - `title` (TEXT): 활동 세부 제목
  - `note` (TEXT): 한 줄 느낀 점
- **app_settings (설정 및 캐시)**
  - `key` (TEXT UNIQUE PK), `value` (TEXT)
  - 사용: Lock 활성화 여부, Pin 비밀번호, Premium 구독 여부, **벤토 보드 키워드 캐시(`bento_word_cache_{year}`)** 등 저장.
- **word_stats (단어 빈도 통계)** *(v2.1 추가)*
  - `id` (INTEGER PK AUTOINCREMENT)
  - `date` (TEXT): 'YYYY-MM-DD' — 해당 일기의 날짜
  - `word` (TEXT): 추출된 단어
  - `count` (INTEGER): 해당 날짜에서의 출현 횟수
  - UNIQUE(date, word) — 일자별 단어 중복 방지
  - **증분 동기화**: 일기 저장 시점(`saveDiary`)에 `InteractionManager.runAfterInteractions`로 백그라운드에서 해당 날짜의 단어 빈도를 즉시 반영.

### 2.2. 안정성 확보 로직 (Mutex Queue & NPE 방지)

- **문제점**: `expo-sqlite`의 병렬 쿼리 시 발생하는 `NullPointerException` 등 고질적 Race Condition 방지.
- **구현**: `dbQueue` Promise 체인을 구현. 모든 쿼리(읽기/쓰기)는 큐 시스템을 거쳐 **순차적으로 대기열을 형성하고 하나씩 실행(Single-thread emulation)** 되도록 강제. 특정 쿼리가 실패해도 `catch` 블록으로 큐 붕괴를 막아 Failsafe 시스템 구축.

---

## 3. 핵심 비즈니스 로직 명세

- **작성 진입 시나리오 (Mood/Activity Modal Entry Flow)**:
  - 새 일기 작성 시 (`!diary`) 화면 진입과 동시에 **기분 및 활동 선택 모달**이 자동으로 팝업됨 (`RNModal` 활용).
  - 사용자는 일기를 쓰기 전 오늘의 핵심 상태를 먼저 기록하며, 이는 작성 과정 중에도 하단 메타 영역을 탭하여 언제든 수정 가능.
- **통합 다이어리 카드 (Integrated Diary Card)**:
  - 다이어리 캔버스(입력 영역)와 기분/활동 정보(메타 영역)를 하나의 `integratedDiaryCard` 스타일로 묶어 피드와 시각적 일관성을 확보.
  - 메타 영역(`integratedDiaryMeta`)은 탭이 가능하며, 탭 시 다시 선택 모달이 열리는 상호작용 제공.
  - **인디케이터 색상 동기화**: `integratedDiaryCard`와 `cardIndicatorWrap`의 배경색을 현재 `currentPageIndex`에 해당하는 캔버스 배경색(`dynamicCanvasColor`)과 실시간으로 동기화하여 시각적 일체감을 부여함. *(v2.3 추가)*
- **멀티페이지 시스템 (Multi-Page)**:
  - `useWriteLogic`에서 `pages`, `pageStickers`, `pagePhotos`의 2차원 상태 구조로 여러 페이지 관리.
  - 가로 슬라이더(`FlatList` + `pagingEnabled`)에서 화면 끝에 더미 요소 `'__ADD_PAGE__'`를 배치. 사용자가 끝까지 **엣지 스와이프**를 하면 자동으로 콜백을 타며 `addPage()` 호출.
  - **인디케이터 위치 개선**: 다이어리 피드와의 시각적 일관성을 위해 페이지 인디케이터(Dots)를 캔버스(카드) 내부에서 상단 영역으로 외부 분리하여 배치. 이를 통해 드래거블 요소가 인디케이터에 가려지는 문제를 해결함. *(v2.2 추가)*
- **드래그, 회전 & 크기 조절 (Draggable Engine v2 — 롱프레스 기반)**:
  - 스티커, 사진, 텍스트에 공통 적용되는 `useDraggable` 커스텀 훅(`src/hooks/useDraggable.js`) 구현.
  - **롱프레스(400ms) 후에만 드래그 활성화**. 릴리즈 시 선택 상태(isSelected) 진입 → 회전/크기 조절 핸들 표시.
  - **드래그-스크롤 충돌 방지 시스템**:
    - `onMoveShouldSetPanResponderCapture`를 통해 부모(FlatList)보다 먼저 제스처를 선점하여 네이티브 스크롤 간섭을 차단.
    - 터치 시작(`onPanResponderGrant`) 시점에 즉시 부모 스크롤을 비활성화(`isDraggingAny: true`)하여 "페이지 이동 후 멈춤" 버그 해결.
    - 드래그 중 `pagingEnabled={false}` 연동을 통해 네이티브 페이징 엔진의 강제 개입을 원천 봉쇄.
  - 더블탭 삭제 제거 → 인스타그램 스타일 **쓰레기통 드래그 삭제**로 대체. 드래그 중 화면 하단에 플로팅 쓰레기통 표시, 드래거블을 끌어 넣으면 삭제.
  - `onDragMove(id, pageX, pageY)` / `onDragDrop(id, pageX, pageY)` 콜백으로 쓰레기통 영역 감지를 외부에 위임.
  - 선택 상태 5초 자동 해제(`deselectTimer`).
- **사진 첨부 (Photo Frame)**:
  - 프레임 컬러(화이트, 블랙, 파스텔 핑크, 파스텔 블루, 파스텔 민트)를 먼저 선택하면, `expo-image-picker`를 즉각 로드 (1:1 Aspect ratio, Quality 0.5 압축).
  - 로드 후 `photos` 배열에 드래거블 객체로 삽입됨. Z-Index 관리 로직상(Z:5) 스티커(Z:10) 아래, 텍스트(Z:8) 위에 무조건 덧대어짐.
- **디지털 스크랩북 캔버스 (Tap-to-Write)**: 기존 고정 TextInput 영역을 제거하고 전체 카드를 빈 캔버스로 전환. 종이 질감(`#FBF8F4`) 배경과 따뜻한 크라프트지 테두리(`#E2DED0`)로 실제 스크랩북 느낌 구현. 빈 캔버스에 `✏️ 화면을 터치해서 일기를 써보세요` 안내 문구 표시(opacity 0.4). 터치하면 해당 위치에 인라인 편집 가능한 텍스트 카드가 생성됨.
  - **인디케이터 색상 동기화**: 상단 페이지 인디케이터 영역의 배경색을 현재 선택된 캔버스 배경 테마와 일치시켜, 카드 전체가 하나의 유기적인 테마로 보이도록 개선. *(v2.3 추가)*
  - 생성 시 텍스트 패널의 **프리셋 설정**(`nextTextFont`, `nextTextColor`, `nextTextBgColor`)이 자동 적용됨.
  - **글자수 제한**: 각 텍스트 박스 당 최대 **200자**까지 입력을 제한함 (성능 및 디자인 보호).
  - **텍스트 프리셋 UI 개선**: 텍스트 추가 패널에서 문자 색상(TEXT_COLORS)과 하이라이트 색상(HIGHLIGHTER_COLORS) 선택 영역을 각각 독립된 `ScrollView`로 분리하여 조작 편의성을 극대화함.
- **다꾸 전용 하단 플로팅 탭바 (Floating Tab Bar)**:
  - 하단 화면 영역에 `[홈 | 일기 | 완료 | 요약 | 설정]` 구성의 탭바를 배치하여 저장 및 네비게이션 편의성을 높였습니다.
  - `KeyboardAvoidingView` 외부에 위치시켜 키보드가 활성화되어도 화면 하단에 고정된 상태를 유지하도록 설계되었습니다.
  - 상단 헤더에 있던 중복된 확인(저장) 버튼을 제거하여 UI를 간소화하고 중앙의 '완료' 버튼으로 저장 로직을 일원화했습니다.
  - **Reactive Color Feedback**: 중앙 완료 버튼의 배경색(`backgroundColor`)은 오늘 선택한 기분(`activeMood.color`)에 반응하여 즉시 실시간으로 변경됩니다. 선택된 기분이 없는 경우 글로벌 주간 기분 색상 혹은 기본값을 유지합니다.
  - 해당 탭 버튼 클릭 시 저장 로직(`handleSave`)이 실행되거나 각 탭으로 이동하며, 스티커/사진/텍스트 툴은 `integratedDiaryMeta` 영역에서 별도로 호출됩니다.
  - 해당 탭 버튼을 클릭하면 `stickerBottomSheet` 등의 편집 도구 패널이 호출되며, 패널 내부에서는 **수평 ScrollView(pagingEnabled)**를 통해 각 도구 간의 빠른 전환이 가능합니다. `onMomentumScrollEnd`를 통해 활성 탭 아이콘 상태가 자동으로 동기화됩니다.
  - **Auto-dismiss**: 편집 도구 패널 외부 영역을 탭하거나, 상단의 닫기(✕) 버튼을 누르면 모든 편집 패널이 즉시 종료됩니다.
  - **Drag-safety**: 스티커나 사진을 드래그하여 배치하는 중에는 하단 패널의 투명도가 0으로 조절되어 시야를 확보하고 조작 간섭을 차단합니다.
- **자동 저장**: 각 요소의 변경(위치, 텍스트, 배경 등) 발생 시 즉시 로컬 DB(SQLite)에 동기화.
- **상태 관리**: `useWriteLogic` 훅을 통해 다이어리 내용, 스티커, 사진, 배경, 텍스트 상태를 통합 관리.

### 3.2. Draggable Engine (Digital Scrapbook)

- **제스처**: `PanResponder`를 기반으로 한 드래그, 회전, 스케일링 지원.
- **폴라로이드 프레임 & 즉시 첨부**:
  - 사진(Camera) 탭에서 프레임을 선택하면 빈 프레임이 생성되는 대신, **즉시 갤러리가 열려** 사진을 선택할 수 있습니다.
  - 사진 선택 완료 시 해당 프레임이 적용된 상태로 일기장에 부착됩니다.
- **롱프레스 시스템**: 400ms 롱프레스 후 드래그 활성화, 드래그 종료 시 선택 상태 진입.
- **인스타그램 스타일 삭제**: 드래그 중 플로팅 쓰레기통 표시, 드롭 시 영역 판정을 통한 삭제.
- **장치 불변 UI (Inverse Scale)**: 물체의 크기에 상관없이 인터랙션 버튼(회전, 수정)은 항상 화면상 일정한 크기(43px)를 유지하도록 역스케일 보정 적용.
- **레이아웃 안정성**: 투명 테두리 미리 확보를 통해 선택 시 레이아웃 점프 방지.

### 3.3. 피드 및 뷰어 (DiaryFeed Logic)

- **피드 쿼리**:
  - `useAllDiaries` 훅을 사용해 전체 일기 로드(ASC 정렬로 최신 일기가 바닥으로 향하도록 배치. 진입 시 `scrollToEnd`).
  - `parseMultiPageData` 파서를 통과해 단일 페이지 일기도 멀티 페이지 포맷으로 정규화 처리. 멀티 페이지는 `FlatList`로 가로 스와이프 허용.
- **형광펜 드로잉 엔진**:
  - 피드 위에 SVG 오버레이(`pointerEvents` 조작)를 덮어, `PanResponder`로 드로잉 좌표 배열 수집.
  - `path` 엘리먼트 렌더러에 16px, `스트로크 라운드`, `opacity 0.45`을 갖춘 베지어 곡선(또는 선형 보간) 투사. UNDO/CLEAR 배열 스택 로직 운용. 사용자는 일기를 보면서 특정 부분에 V표나 강조 마킹 가능.

### 3.4. 요약 및 통계 구출 (Summary Logic)

- **연도 전환 시스템 (Dynamic Year Loading)**:
  - `useSummaryLogic`은 `useState`로 현재 선택된 연도(`year`)를 관리합니다.
  - 헤더의 연도 선택 시 `setYear`를 호출하면, 하위의 모든 데이터 페칭 훅(`useDiariesForYear`, `useYearMoodStats` 등)이 리액트 종속성 배열에 의해 자동으로 리로드(reload)됩니다.
  - 전역 스코프 변수(`SummaryScreenNudged`)를 활용해 세션당 1회만 스크롤 넛지 애니메이션을 실행하여 학습 곡선을 낮춥니다.
- **차트 처리**: `getYearMonthlyActivities` 쿼리에서 모든 해당 월의 Data를 Reduce 처리.
- 기분 가중치 파악(Count), 활동별 그룹핑 산출. 상위 3가지 항목만을 필터링(`sort().slice()`)해 Bar Chart 게이지의 백분율 State로 주입.
- 빈 데이터 발생 가능성(엣지 케이스)에 대비하여 기본 Null/Zero-state fallback 객체를 반환.

### 3.4. 과금 및 광고사양 (AdContext & Business Policy)

- **프리미엄 구독 모델**: ₩5,900 / 1년 연간 구독. 결제일로부터 1년간 모든 프리미엄 혜택 제공.
- **스티커 팩 로직 한정 운영**: 현재 제공되는 모든 스티커 팩(이모지, 파스텔, 푸드 등)은 정책에 따라 무료(isFree: true)로 제공됩니다. 단, **추후 유료 팩 스티커 추가 가능성**에 대비하여 상점 내 가격 표시 UI, 프리미엄 혜택 증정 판정 조건, 그리고 더미 결제 다이얼로그 호출 로직 등은 제거하지 않고 유지합니다.
- **제한 정책 (Hard Cap)**: 앱 내 다이어리 페이지당 스티커 및 텍스트 박스는 최대 각 15개로 제한합니다 (성능 및 UX 보호).
- **Free User 로직**: 기본 스티커 및 텍스트 박스 부착 한도는 페이지당 3개입니다. 한도 도달 시 `SoftAlertModal`이 노출되어 보상형 광고(Reward Ad) 시청을 통해 한도를 +2개씩 확장할 수 있습니다 (최대 15개까지). 텍스트 폰트는 기본 폰트만 제공됩니다.
- **Premium User 로직**: 한도가 즉시 15개로 상향됩니다. 모든 광고가 제거되며, 파스텔 사진 프레임 및 다양한 커스텀 폰트를 무제한으로 사용할 수 있습니다. 프리미엄 인증 상태는 `SettingsContext`와 로컬 DB를 통해 캐싱됩니다.

### 3.5. 암호화 백업 로직 (Backup/Restore Logic)

- **버전**: 2.0.0 (DraggableText, 사진 회전/크기, 배경 등 전체 데코레이션 데이터 포함)
- **Export**: DB 순회 → `JSON.stringify` → **AES-256 (Crypto-js ECB/PKCS7)** 로 암호화 → `JSZip` 사용해 암호화된 JSON텍스트 + `expo-file-system`의 Diary_Photos Base64를 함께 Zip으로 묶은 뒤 `expo-sharing` 트리거.
- **Import**: `expo-document-picker`로 Zip 로드 → JSZip 언패킹 → 이미지 FileSystem 복사 이동 → `data.json` 복호화 후 Schema Migrate → DB DROP & Truncate 후 INSERT TRANSACTION.
- **호환성**: v1.0.0 레거시 백업 파일(JSON) 및 v2.0.0 ZIP 파일 모두 복원 가능.

### 3.6. 검색 로직 (Search Logic)

- **검색 대상**:
  1. `diary.content` — 입력박스 본문 (멀티페이지 JSON 배열 파싱 지원)
  2. `diary.texts` — DraggableText 노드의 `text` 필드 (2차원 배열 순회)
  3. `activities` — 활동 라벨, 제목, 메모
- **구현**: `useSearchLogic` 훅에서 `useMemo`를 사용한 클라이언트 사이드 필터링. DB 스키마 변경 없이 기존 `texts` 컬럼의 JSON을 파싱하여 검색 수행.

---

## 4. 벤토 보드 & 키워드 분석 (Bento Board & Word Frequency Analysis)

### 4.1. 연간 모먼트 벤토 보드 (Annual Bento Board)

- **목적**: 1년간의 파편화된 데이터를 세련된 매거진 스타일의 타일 레이아웃(Bento Grid)으로 통합 시각화.
- **구성 요소**:
  - **Main Tile**: 올해 가장 많이 언급한 단어 (타이포그래피 강조) + 서브 키워드 칩
  - **Status Tile**: 연간 총 작성일 수 및 연속 기록 배지 (🔥 스트릭)
  - **Golden Hour Tile**: 일기를 가장 많이 기록한 시간대 (🌙밤, ☀️오전 등) — `diary.updated_at` 컬럼 활용
- **데이터 소스**: `useBentoBoard` 훅에서 통합 관리.
- **위치**: SummaryScreen 기분 분석 페이지 "월별 기분 흐름" 카드와 "자주 쓴 스티커" 카드 사이.

### 4.2. 올해의 키워드 분석 (Word Frequency Analysis)

- **분석 대상**:
  1. `diary.content` — 입력박스 본문 (멀티페이지 JSON 배열 파싱 지원)
  2. `diary.texts` — DraggableText 노드의 `text` 필드 (2차원 배열 순회)
- **분석 로직** (`src/utils/wordAnalyzer.js`):
  - 이모지 제거 → 특수문자/숫자 제거 → 공백 분리
  - 한국어 불용어(조사, 접속사, 대명사, 흔한 동사 어미) 2글자 미만 제외
  - 빈도수 내림차순 정렬 후 상위 10개 추출
- **성능 최적화 전략**:
  - **증분 동기화(Incremental Sync)**: `saveDiary()` 호출 시 `InteractionManager.runAfterInteractions`로 백그라운드에서 해당 날짜의 단어 빈도를 `word_stats` 테이블에 즉시 반영. 이를 통해 `word_stats` 테이블이 항상 최신 상태를 유지.
  - **직접 쿼리(Direct Query)**: 요약 화면 진입 시 전체 일기를 재분석하지 않고, `word_stats` 테이블에서 `SELECT word, SUM(count) ... GROUP BY word ORDER BY total DESC`로 바로 조회하여 빠르게 결과 표시.
  - **최초 마이그레이션 분석**: `word_stats`가 비어있을 때(최초 1회)만 전체 일기를 순회하며 단어 빈도를 계산하고 저장. 10개 단위로 `setTimeout`을 사용해 UI 스레드 양보.
  - **복구 시 동시 분석**: `restoreFromData()` 함수에서 일기 INSERT 직후 `analyzeWordsFromDiary()`를 호출하여 `word_stats`도 동일 트랜잭션 내에서 함께 생성. 대량 복구 후 요약 화면에서 전수 분석이 불필요.
- **연속 기록 일수(Max Streak)**: `getYearMaxStreak(year)` 함수로 해당 연도 일기 날짜를 ASC 정렬 후 연속 일수 최대값 계산.

---
