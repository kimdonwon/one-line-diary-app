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
| :--- | :--- | :--- |
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

- **성능 최적화 전략 (Performance Critical)**:
  - **위치 렌더링**: `left/top`(레이아웃 속성) 대신 `translateX/translateY`(트랜스폼 속성) 사용. 드래그 시 Yoga 레이아웃 엔진 재계산을 완전히 제거.
  - **조작 핸들 렌더링**: 회전 핸들, 드래그 막대, 편집 버튼의 `bottom/right/left` 애니메이션 오프셋도 `translateY/translateX`로 전환. 크기/회전 조절 시 매 프레임 발생하던 조작 버튼의 레이아웃 재계산을 제거.
  - **콜백 안정화**: `handleDragMove`의 `isDraggingAny` State 의존성을 `useRef`로 전환하여, 드래그 시작/종료 시 `useCallback`이 재생성되지 않도록 함. 이를 통해 모든 Draggable 컴포넌트의 `React.memo`가 유효하게 유지.
  - **setMySize 동일값 스킵**: `onLayout`에서 이전과 동일한 크기가 보고되면 `setState`를 스킵하여 불필요한 리렌더링 차단.

- **DraggableText 최적화**:
  - `TextInput`을 Uncontrolled 모드로 운용하여 한글 IME 조합 중 리렌더링 제거.
  - 텍스트 값은 `useRef`로 추적, 편집 종료 시에만 state 동기화.
  - 편집 중 `minWidth: dynamicMaxWidth`를 강제 적용하여 Yoga 레이아웃 재계산으로 인한 커서 점프 차단.

### 3.2 캔버스 요소 아키텍처 (Source of Truth 단일화)

모든 캔버스 요소는 **"뷰의 Source of Truth는 하나로 합치고, 통제/이벤트 로직만 이원화한다"** 원칙을 따릅니다.

| 요소 | Base (순수 시각) | Draggable (편집 캔버스) | Static (피드 뷰) |
|:---|:---|:---|:---|
| **스티커** | `canvasElements/BaseSticker.js` | `DraggableSticker.view.js` → `<BaseSticker>` | `StaticSticker` → `<BaseSticker>` |
| **사진** | `canvasElements/BasePhoto.js` | `DraggablePhoto.view.js` → `<BasePhoto>` | `StaticPhoto` → `<BasePhoto>` |
| **텍스트** | `canvasElements/BaseText.js` | `DraggableText.view.js` → `<BaseText>` | `StaticText` → `<BaseText>` |

- **Base 컴포넌트**: `pointerEvents="none"` 수준의 순수 시각 렌더러. 로직/이벤트 없음.
- **Draggable 컴포넌트**: Base를 감싸고 `useDraggable` 훅으로 드래그/회전/스케일 로직을 주입.
- **Static 컴포넌트**: Base를 감싸고 고정 좌표/회전/스케일만 적용. 로직 없음.
- **`getTextStyle(fontId, color)`**: 텍스트 전용 폰트 스타일 헬퍼. `BaseText.js`에서 export하여 `DraggableText`와 `StaticText` 모두에서 동일한 폰트 렌더링 보장.

### 3.3 스티커 카테고리 상태 유지 (Context Preservation)

스티커 서랍을 닫고 다시 열었을 때 사용자의 작업 흐름을 유지하기 위해 마지막으로 선택된 카테고리를 보존합니다.

- **상태 관리**: `activeCategoryId`를 서랍 폐쇄 시에도 유지 (초기화 로직 제거)
- **무결성 검증**: 서랍 재오픈 혹은 **탭 전환(Sticker/Photo/Text) 시**, 기억된 ID가 `visibleCategories`에 포함되어 있는지 확인 후 폴백 처리
- **시각적 동기화**:
  - `prevShowStickers` Ref를 활용하여 스티커 탭 진입 시점을 정밀 감지
  - 서랍 오픈 및 탭 전환 즉시 애니메이션 없이(`animated: false`) 해당 팩 목록으로 스크롤 동기화 수행
  - 상단 카테고리 탭바 아이콘이 화면 중앙 근처에 오도록 레이아웃 좌표 기반 자동 스크롤 연동

---

## 4. UI/UX 시스템 섹션

### 4.1 하단 탭바 & 툴 패널

- **Bottom Bar (Main Navigation)**: 메인 탭 네비게이션용으로 사용 (`nav` 모드).
- **Write Screen Layout Strategy**: 하단바 제거로 확보된 공간을 활용하여 `ScrollView`의 **상단 정렬(`flex-start`)** 레이아웃을 채택. 캔버스 수직 세부 요소들의 패딩을 최소화(Meta: 6px, Indicator: 4px)하는 **'Padding Diet' 전략**을 통해 전체 높이를 압축. 이를 통해 큰 화면 기기에서는 스크롤 없이 고정된(Premium Fixed) 느낌을 주며, 공간이 부족한 작은 기기에서만 자동으로 스크롤이 활성화되도록 함. (캔버스 상단 마진: `2.5%`, 쓰레기통 위치: `bottom: '7%'`)
- **Header Layout Strategy**: '오늘의 기록'(Main Title) + 'YYYY.MM.DD'(Sub Date)의 2단 구조로 개편. 특히 날짜 스타일을 **메인 화면(16px, Semi-bold, #9E8E82)과 완벽히 일치**시켜 앱 전체의 시각적 일관성 확보. (저장 및 이탈은 시스템 백버튼의 `beforeRemove` 자동 저장 로직에 의존)
- **Keyboard Auto-Scroll**: 캔버스 하단 `DraggableText` 입력 시 키보드가 텍스트를 가리는 문제를 `Keyboard.addListener`로 해결. 키보드 등장 시 `scrollRef.scrollTo(keyboardHeight * 0.5)`로 캔버스를 위로 밀어올리고, 키보드 사라질 때 `scrollTo(0)`으로 원위치. DraggableText 수정 없이 WriteScreen.logic.js에서만 처리.
- **Tool Panel (Floating Glass Island)**:
  - 반투명 블러 효과(`BlurView`) 가로 스와이프 도크.
  - **레이어링**: 키보드 간섭 방지 및 zIndex 이슈 해결을 위해 루트 레이어에 배치.

### 4.2 멀티페이지 캔버스

- **데이터 구조**: `pages` 기반 2차원 데이터 상태 (`stickers[page][index]` 방식).
- **자동 확장**: 마지막 페이지 엣지 스와이프 시 `__ADD_PAGE__` 트리거를 통한 무한 페이지 생성 지원.
- **실시간 컬러 매칭**: 현재 페이지의 배경색과 앱 전체 테마(상단 바, 탭바) 배경색을 동기화하여 몰입감 증대.

### 4.3 폴라로이드 사진 프레임 시스템

- **프레임 종류 확장**: 기본 색상 및 파스텔톤에 이어 빈티지한 감성의 프리미엄 프레임 6종(모카 무스, 라벤더 팝, 라임 크림, 빈티지 크림, 소다 블루, 버터 옐로우) 추가 지원.
- **디자인/로직 분리 (Modular UI Developer 적용)**:
  - 색상 데이터는 `constants/theme.js`에서 전역 상수로 관리.
  - 프레임 UI 속성은 `DraggablePhoto.styles.js` 및 `WriteScreen.styles.js`에서 각 상태 파생 스타일로만 캡슐화되어 렌더링. 비즈니스 로직 수정 없이 프레임 확장 처리 가능.

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

- **보안 (v1.0.1 강화)**:
  - PIN 비밀번호는 `expo-secure-store`를 통해 OS 보안 영역(Keychain/Keystore)에 저장. SQLite 평문 저장 폐기.
  - 기존 유저 자동 마이그레이션: DB에 남아있는 레거시 PIN을 SecureStore로 이전 후 DB에서 삭제.
  - 락스크린 핀코드 인증 및 생체 인식(LocalAuthentication) 지원.
- **백업 (v2.0.0)**:
  - `JSZip`을 이용한 데이터 + 사진 통합 패키징.
  - 복구 시 `word_stats`를 실시간 재계산하여 통계 일관성 유지.
  - **일기 삭제 시 통계 동기화**: `deleteAllDiaryData` 및 `deleteDiaryByDate` 트랜잭션 내에서 `word_stats` 데이터를 함께 삭제하여 고아 레코드(Orphan Record) 발생을 방지.
  - **암호화 V2**: AES-CBC 모드 + 무작위 IV 적용. V1(ECB) 백업 파일과 하위 호환성 유지.
  - 암호문 포맷: `TPv2:<IV hex>:<ciphertext>` (V1은 프리픽스 없음으로 자동 감지).

### 5.3 앱 출시 관련 (Release)

- **개발자 도구 자동 숨김**: `__DEV__` 글로벌 변수를 사용하여 개발(Debug) 환경에서만 테스트 메뉴(데이터 초기화, 프리미엄 토글 등)가 노출되도록 구성. 릴리즈 빌드(Production)에서는 해당 UI 코드가 자동으로 렌더링에서 제외되어 사용자 노출 차단.
- **인앱 결제(IAP) 시스템 연동 (`react-native-iap`)**:
  - `src/constants/iap.js` 상수 파일을 생성하여 `Product Manager` 스킬의 명명 규칙에 부합하는 결제 상품 식별자(`premium_yearly`, `premium_3month`)를 전역 상수(`PREMIUM_SKUS`)로 분리 관리함으로써 확장성을 확보함.
  - `SettingsScreen.logic.js`에서 앱 실행 시점(`useEffect`)에 `RNIap.initConnection()` 및 영수증 리스너를 마운트함.
  - 결제 요청 시 선택된 상품의 `skuId`를 `handlePremiumPress`의 파라미터로 전달하여 동적으로 대응함.
  - 프리미엄 구독 로직은 구글 플레이 및 앱스토어의 `requestPurchase` 트랜잭션으로, 복원 로직은 `getAvailablePurchases` 영수증 검증으로 완전하게 처리됨.

### 5.4 요약 화면 및 메인 화면 성능 고도화 (Summary/Main Performance)

- **데이터 로딩 통합 (useSummaryLogic v2.0)**:
  - **Before**: `useYearMoodStats`, `useYearActivityStats` 등 6개의 개별 DB 훅 병렬 사용 → 각 훅의 데이터가 로드될 때마다 `setState` 발생으로 **6번의 리렌더링 연쇄** 발생.
  - **After**: `Promise.all`과 단일 `rawData` 상태를 사용하는 통합 로직으로 리팩토링. 6개의 비동기 쿼리가 완료된 후 **단 1회의 setState**만 수행하여 렌더링 부하를 80% 이상 경감.
- **화면 전환 병목 해소 (Interactions)**:
  - `useFocusEffect` 내의 통합 `reload` 함수를 `InteractionManager.runAfterInteractions()`로 래핑.
  - 네비게이션 전환 애니메이션 도중에 JS 스레드가 DB 쿼리를 요청하지 않게 차단하여, 화면 이탈 및 진입 시나리오에서 60fps 보장.
- **연산 메모이제이션 (`useMemo`)**:
  - 기분 통계(`maxCount`, `topMoodData`, `allMoodStats`): `[stats]` 의존성으로 메모이제이션.
  - 월별 통계(`monthlyEntryCounts`, `moodLineData`, `maxLineValue` 등): `[year, monthlyStats]` 의존성으로 메모이제이션.
  - 활동 통계(`maxActivityCount`): `[activityStats]` 의존성으로 메모이제이션.
  - 활동 꺾은선 데이터(`activityLineData`, `maxActivityLineValue`): `[year, activityStats, monthlyActivityStats]` 의존성으로 메모이제이션.
- **기존 최적화 유지**: `moodActivityCorrelation`은 기존 `useMemo`를 유지. `useBentoBoard`의 시그니처 캐싱도 기존 그대로. `stickerStats`는 멀티페이지(2차원 배열)와 과거 데이터(1차원 배열)를 모두 합산(`Flatten`)하도록 방어 로직이 보완됨.
- **화면 이탈 시 네비게이션 지연 (`requestAnimationFrame`)**:
  - `handleMoodPress`, `handleActivityPress`의 `navigation.navigate` 호출을 `requestAnimationFrame`으로 감싸서, 터치 피드백(TouchableOpacity의 opacity 복귀)이 현재 프레임에서 완료된 후 다음 프레임에서 네비게이션을 시작.
  - SummaryScreen의 무거운 렌더 트리가 전환 애니메이션 준비와 동일 프레임에서 경쟁하는 것을 방지.
- **SVG 컴포넌트 격리 (`Memoized Chart`) & 전역 동결 (`enableFreeze`)**:
  - `SummaryScreenView` 내부에 존재하여 미세한 상태 변경이나 블러(Blur) 이벤트 시 다시 렌더링되던 무거운 SVG 차트 함수(`renderMoodLineChart`, `renderActivityLineChart`)를 컴포넌트 외부로 분리.
  - `React.memo`로 감싸 네비게이션 전환 시 불필요한 JS 스레드의 **Diffing 연산을 완벽히 차단(Isolation)**함.
  - `App.js` 단에서 `react-native-screens`의 `enableFreeze(true)`를 활성화하여, Stack 전환 시 백그라운드로 밀려나는 Tab 화면(예: SummaryScreen)의 JS 연산을 OS 레벨에서 완전히 **동결(Freeze)**.
- **도착 화면 지연 렌더링 및 페이드인 (Transition Staggering)**:
  - `Wait for Transition` 방식의 단점(2단계 로딩 체감)을 없애고, **진입 즉시 빈 캔버스와 레이아웃을 투명도 100%로 마운트**시킴. (사용자는 화면이 바뀜과 동시에 완전한 형태의 일기장을 보게 됨)
  - 데이터 페칭 로딩(`!loading`)이 끝나는 즉시 일기장 내부의 **알맹이 에셋들(텍스트 -> 사진 -> 스티커)**을 각각 담당하는 3개의 `Animated.Value`에 `Animated.stagger`를 가동하여 **0.08초 간격으로 순차적 팝업(Spring Physics)**을 연출함.
  - 이를 통해 모놀리식 렌더링(통짜로 어둡게 팝업되는 방식)이 주던 무거운 체감을 탈피하고, 애플(Apple) 스타일의 병렬적이고 스무스한 최고급 UX를 완성함.
- **모달 플리커링 및 프리미엄(High-end) 애니메이션 렌더링 부하 제거**:
  - **Android 모달 플리커링 근절 (RNModal 완전 폐기)**: `react-native-modal`(RNModal)은 내부적으로 React Native의 네이티브 `Modal` 컴포넌트를 사용하며, 안드로이드에서 이 네이티브 Modal이 마운트되는 시점에 컨텐츠를 1프레임 동안 최종 위치에 그린 후 애니메이션을 시작하는 구조적 문제가 있음. `hideModalContentWhileAnimating` 옵션으로 우회하면 반대로 빈 껍데기가 먼저 올라왔다가 팝인되는 현상 발생. 이를 근본적으로 해결하기 위해 **RNModal 자체를 완전히 폐기**하고, 순수 `Animated.View` + `translateY` 스프링 애니메이션 기반의 `MoodBottomSheet` 커스텀 컴포넌트로 대체함. 네이티브 Modal 레이어를 전혀 거치지 않으므로 플리커링이 물리적으로 발생 불가능.
  - 단순 투명도 대신 `expo-blur`와 `Animated.View`를 합성한 **`AnimatedAuraBackdrop`** 컴포넌트를 자체 제작. 기쁨, 슬픔 등 유저가 선택한 기분(Mood)의 색상값이 즉시 배경 블러에 스며들며 은은하게 빛나는 **반응형 감정 오라(Responsive Aura)** UX 적용.
  - 모달 내부의 기분 아이콘 목록에 `react-native`의 `Animated.spring`을 활용해 인덱스 번호(`index * 60ms`)에 따른 **순차적 팝업(Staggered Pop-up)** 기능을 추가. 바텀시트가 열릴 때 캐릭터들이 도미노처럼 젤리 푸딩 같은 텐션으로 하나씩 통통 튀어 오르는 마이크로 모션 구현. 또한, 모달이 열린 이후 다른 이모지를 터치할 때 불필요하게 스케일이 0으로 초기화되며 깜빡이는 현상(Flickering)을 `useRef` 상태 분기를 통해 제거.
- **플로팅 글래스 아일랜드(바텀시트 도크) 마운트 최적화 (Progressive Lazy Windowing)**:
  - `WriteScreen.view.js`의 좌하단 툴바(스티커, 프레임, 텍스트) 버튼 클릭 시 바텀시트가 열리며 발생하는 **0.5초 극심한 렌더링 렉(Jank)**을 해결.
  - 렉의 주원인이었던 "수백 개의 SVG 스티커를 `LayoutAnimation` 프레임에 동시에 마운트"하던 구조를 뜯어고침.
  - `InteractionManager`를 결합하여 **바텀시트가 열리는 애니메이션(300ms) 도중에는 현재 활성화된 탭 딱 한 개(1 Window)만 집중해서 렌더링**하고, 슬라이딩이 완료된 시점(`isDockReady`)에 양옆 스와이프에 필요한 여분 탭을 백그라운드에서 지연 마운팅(Multi-stage Render)하도록 구조화함. 결과적으로 체감 오픈 딜레이를 0ms 수준으로 즉각화.
- **스티커 팩 라이프사이클 관리**:
  - 스티커 상점에서 새로운 팩을 구매/다운로드했을 때, 기존에 **자동으로 활성화(enabledStickerCats에 강제 주입)**되던 로직을 제거함.
  - 이제 구매 시 전체 스티커 목록(`catOrder`)에만 추가되며, 사용자가 직접 '서랍장 관리(Drawer Manager)'에서 원하는 팩만 켜서 사용할 수 있도록 UX를 제어함. 불필요하게 서랍 인터페이스가 복잡해지는 현상을 방어함.
- **Staggered Canvas Reveal (일기 화면 진입 시 고급 페이드인 연출)**:
  - 기존에 일기 쓰기 화면으로 진입할 때 DB에서 데이터를 로딩하는 동안 빈 캔버스가 먼저 보이고, 로딩이 끝나면 모든 에셋(텍스트, 스티커, 사진)이 한꺼번에 '팍!' 하고 나타나는 B급 UX를 근절함.
  - `navigation.addListener('transitionEnd')`로 화면 전환 애니메이션 완료 시점을 감지하고, `useDiaryForDate` 훅의 `loading` 상태와 AND 조건으로 결합하여, **둘 다 완료되었을 때만** 캔버스 영역 전체를 `Animated.timing`으로 페이드인(0→1, 350ms) + 살짝 슬라이드업(12px→0) 시켜 부드럽게 등장시킴.
  - 이 패턴으로 인해 빈 화면이 보이는 시점 자체가 사라지며, 유저에게는 화면이 실크처럼 자연스럽게 나타나는 프리미엄 경험을 전달함.

### 5.5 AdMob Integration (광고 연동)

- **모듈**: `react-native-google-mobile-ads`
- **Configuration (환경 변수)**:
  - **App ID**: `.env` 파일에서 `dotenv`를 통해 `app.config.js`로 주입. 소스 코드에 하드코딩하지 않음.
  - **Ad Units**: `src/constants/ads.js`에서 `Constants.expoConfig.extra`를 통해 `.env`로부터 주입된 값을 사용. 개발 환경(`__DEV__`)에서는 계정 보호를 위해 강제로 `TestIds.REWARDED`를 사용.
- **Usage (`WriteScreen.logic.js`)**:
  - 스티커 및 텍스트 박스 한도 초과 시, `rewardTypeRef`('sticker' | 'text')에 따라 동적으로 광고 보상(Reward)을 지급.
  - 이벤트를 리스닝하여 `EARNED_REWARD`가 트리거되었을 때 스마트하게 한도(+2)를 증설함.
  - 프리미엄 구독자는 해당 광고 로딩 로직 전체가 무시되어 최적화된 퍼포먼스를 제공함.

### 5.5 환경 변수 관리

- **`.env`**: 민감한 AdMob ID 등을 소스 코드와 분리 저장. `.gitignore`에 등록하여 깃 업로드 차단.
- **`.env.example`**: 팀원/미래 참조용 템플릿 (실제 값 없음, 깃 업로드 허용).
- **`dotenv`**: `app.config.js`에서 `.env` 파일을 읽어 빌드 타임에 환경 변수 주입.

### 5.6 범용 애니메이션 엔진 최적화 (Global Animation Engine)

- **Skia Single Canvas Architecture (v4.1 — `SkiaConfettiEffect`)**:
  - **개요**: 기존 `ConfettiEffect`(Reanimated View Pooling, v3.1)의 성능 한계를 극복하기 위해 `@shopify/react-native-skia`의 `Atlas` 컴포넌트 기반으로 전면 교체. 리액트 트리에 개별 View를 생성하지 않고, 단 하나의 `<Canvas>` GPU 레이어에서 모든 파티클을 Batch Draw로 렌더링.
  - **Character Pre-Baking (v4.1 Upgrade)**: `character` prop으로 전달된 MoodCharacter(개구리, 고양이 등)의 SVG 원본을 `Skia.SVG.MakeFromString()`으로 파싱하고, `useTexture` + `ImageSVG`로 마운트 시 1회 GPU 텍스처로 사전 굽기(Pre-Baking). 이후 `Atlas`에서 동일 텍스처를 15개 파티클로 Batch Draw하므로 GPU 부하가 컬러 도형과 동일(Zero Difference).
  - **SVG 데이터 소스**: `src/constants/MoodCharacterSVGs.js`에 5개 캐릭터(frog, cat, chick, bear, rabbit)의 표준 SVG XML 문자열을 정적 상수로 보관. `MoodCharacters.js`의 react-native-svg JSX를 kebab-case 속성으로 변환한 미러 파일.
  - **Graceful Fallback**: `character` prop이 없거나 파싱 실패 시, 15색 파스텔 컬러 도형(원형/사각형)으로 자동 폴백하여 앱 크래시를 방지.
  - **useRSXformBuffer (UI Thread 물리 연산)**: `useRSXformBuffer` Worklet 내에서 매 프레임 각 파티클의 위치(포물선 궤적 + 중력), 회전, 스케일을 직접 계산. JS Thread를 전혀 경유하지 않으므로 스크롤 등 다른 인터랙션과 완벽히 병렬 동작.
  - **useFrameCallback (시간 동기화)**: Reanimated의 `useFrameCallback`으로 고정밀 시간 추적. 각 파티클의 `startTime` 대비 경과 시간을 기반으로 물리 시뮬레이션 수행.
  - **Zero React Tree Overhead**: 리액트 트리에 파티클 View가 존재하지 않으므로 Yoga 레이아웃 재계산, 리액트 Diffing, Bridge 통신 부하가 모두 0. 애니메이션 종료 후 스크롤 미세 버벅임 현상까지 완전 해소.
  - **이전 엔진 (v3.1 `ConfettiEffect`)**: `src/components/ConfettiEffect.js`에 보존. 레거시 참조용으로 유지하되 어떤 화면에서도 사용하지 않음.

### 6. 정기 관리 및 메인터넌스

- **버전 관리**: `package.json`의 버전을 단일 진실 공급원으로 사용.
- **의존성 업데이트**: 보안 패치 및 최신 SDK 대응을 위해 정기적인 `npm audit` 권장.

---
*Last Updated: 2026-03-28*
