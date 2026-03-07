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
  - 사용: Lock 활성화 여부, Pin 비밀번호, Premium 구독 여부 등 저장.

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
- **멀티페이지 시스템 (Multi-Page)**:
  - `useWriteLogic`에서 `pages`, `pageStickers`, `pagePhotos`의 2차원 상태 구조로 여러 페이지 관리.
  - 가로 슬라이더(`FlatList` + `pagingEnabled`)에서 화면 끝에 더미 요소 `'__ADD_PAGE__'`를 배치. 사용자가 끝까지 **엣지 스와이프**를 하면 자동으로 콜백을 타며 `addPage()` 호출.
- **드래그, 회전 & 크기 조절 (Draggable Engine v2 — 롱프레스 기반)**:
  - 스티커, 사진, 텍스트에 공통 적용되는 `useDraggable` 커스텀 훅(`src/hooks/useDraggable.js`) 구현.
  - **롱프레스(400ms) 후에만 드래그 활성화**. 릴리즈 시 선택 상태(isSelected) 진입 → 회전/크기 조절 핸들 표시.
  - 더블탭 삭제 제거 → 인스타그램 스타일 **쓰레기통 드래그 삭제**로 대체. 드래그 중 화면 하단에 플로팅 쓰레기통 표시, 드래거블을 끌어 넣으면 삭제.
  - `onDragMove(id, pageX, pageY)` / `onDragDrop(id, pageX, pageY)` 콜백으로 쓰레기통 영역 감지를 외부에 위임.
  - 선택 상태 5초 자동 해제(`deselectTimer`).
- **사진 첨부 (Photo Frame)**:
  - 프레임 컬러(화이트, 블랙, 파스텔 핑크, 파스텔 블루, 파스텔 민트)를 먼저 선택하면, `expo-image-picker`를 즉각 로드 (1:1 Aspect ratio, Quality 0.5 압축).
  - 로드 후 `photos` 배열에 드래거블 객체로 삽입됨. Z-Index 관리 로직상(Z:5) 스티커(Z:10) 아래, 텍스트(Z:8) 위에 무조건 덧대어짐.
- **디지털 스크랩북 캔버스 (Tap-to-Write v2)**:
  - 빈 캔버스를 꾹 누르면(`handleCanvasTap`) 해당 좌표에 편집 가능한 `DraggableText` 카드가 생성되며 자동 포커스.
  - 생성 시 텍스트 패널의 **프리셋 설정**(`nextTextFont`, `nextTextColor`, `nextTextBgColor`)이 자동 적용됨.
  - **글자수 제한**: 각 텍스트 박스 당 최대 **200자**까지 입력을 제한함 (성능 및 디자인 보호).
  - **텍스트 프리셋 UI 개선**: 텍스트 추가 패널에서 문자 색상(TEXT_COLORS)과 하이라이트 색상(HIGHLIGHTER_COLORS) 선택 영역을 각각 독립된 `ScrollView`로 분리하여 조작 편의성을 극대화함.
- **다꾸 전용 하단 플로팅 탭바 (Floating Tab Bar)**:
  - 캔버스 내부의 플로팅 툴바를 제거하고, 하단 화면 영역에 위치한 탭바를 `[스티커 | 카메라 | 완료 | 텍스트 | 설정]` 구성으로 전환하여 사용합니다.
  - 해당 탭 버튼을 클릭하면 `stickerBottomSheet` 등의 편집 도구 패널이 호출됩니다.
- **자동 저장**: 각 요소의 변경(위치, 텍스트, 배경 등) 발생 시 즉시 로컬 DB(SQLite)에 동기화.
- **상태 관리**: `useWriteLogic` 훅을 통해 다이어리 내용, 스티커, 사진, 배경, 텍스트 상태를 통합 관리.

### 3.2. Draggable Engine (Digital Scrapbook)
- **제스처**: `PanResponder`를 기반으로 한 드래그, 회전, 스케일링 지원.
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

- **차트 처리**: `getYearMonthlyActivities` 쿼리에서 모든 해당 월의 Data를 Reduce 처리.
- 기분 가중치 파악(Count), 활동별 그룹핑 산출. 상위 3가지 항목만을 필터링(`sort().slice()`)해 Bar Chart 게이지의 백분율 State로 주입.
- 빈 데이터 발생 가능성(엣지 케이스)에 대비하여 기본 Null/Zero-state fallback 객체를 반환.

### 3.4. 과금 및 광고사양 (AdContext & Business Policy)

- **제한 정책 (Hard Cap)**: 앱 전체 다이어리 작성 당 스티커는 최대 15장 (성능 및 UX 문제 고려).
- **Free User 로직**: 기본 스티커 부착 한도 3개. 추가 클릭 시 `SoftAlertModal`이 떠서 +2장 확장 보상형 광고(AdMob Reward) 유도 (15개까지 중첩 가능). 텍스트 폰트는 'basic', 'diary' 폰트 제공.
- **Premium User 로직**: 한도 즉각 15장으로 기본 연장. 모든 광고 차단 및 파스텔 플라로이드 프레임 사용 가능, 다양한 다이어리 커스텀 텍스트 폰트 무제한 혜택 제공. 프리미엄 인증은 `SettingsContext`를 타고 DB 캐싱.

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

## 4. 확장 인터페이스 및 유지보수

...

### 4.1. 주요 버그 수정 (Major Bug Fixes)

- **곰(SOSO) 캐릭터 렌더링 에러**: `BearCharacter`가 웹용 SVG 태그(`<svg>`, `<path>`)를 사용하여 React Native에서 렌더링되지 않던 문제를 `react-native-svg` 컴포넌트로 교체하고 속성명을 CamelCase로 수정하여 해결함.
- **기쁨(HAPPY) 개구리**: 입을 크게 벌리고 웃는 형태로 SVG Path를 수정함. 몸체 색상을 차분한 파스텔톤(#B4DCC6)으로, 얼굴 외곽선은 딥 네이비(#283665) 및 두께 5.0으로 조정함. 눈 모양을 둥근 아치형(∩)으로 변경하고 테마 메인 색상을 개구리 피부색과 통일함.
- **화남(ANGRY) 병아리**: 개구리와의 시각적 일관성을 위해 외곽선 및 라인 아트 색상을 딥 네이비(#283665)로 통일하고, 스케일을 1.05에서 1.2로 확대 조정함.
- **당황(CONFUSED) 토끼 정렬**: 토끼 몸체가 화면 왼쪽으로 쏠려 보이던 현상을 해결하기 위해 X축 방향으로 10유닛 이동(translate)하여 중앙 정렬을 맞춤.
- **기분 선택 UI(Mood Selector) 정렬**: 텍스트 높이 편차로 인해 캐릭터가 삐뚤어 보이던 현상을 해결하기 위해 `includeFontPadding: false` 적용 및 `flex-start` 기반 상단 정렬로 오와열을 맞춤.
- **활동 아이콘(Activity Icons) 전면 재디자인**: `ActivityIcons.js`의 그래픽을 기분 캐릭터들과 동일한 "Doodle Flash" 스타일(딥 네이비 외곽선 #283665, 파스텔 색상, 둥글고 귀여운 쉐입, 굵은 선 두께 4.5)로 전면 재설계함.
- **곰(SOSO) 캐릭터 위치 조정**: 캐릭터가 전체적으로 상단에 치우쳐 보이던 현상을 해결하기 위해 Y축 방향으로 7유닛 이동(translate)하여 수직 중앙 정렬을 개선함.
