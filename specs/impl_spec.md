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

- **보안**: 락스크린 핀코드 인증 및 생체 인식 확장성 확보.
- **백업 (v2.0.0)**:
  - `JSZip`을 이용한 데이터 + 사진 통합 패키징.
  - 복구 시 `word_stats`를 실시간 재계산하여 통계 일관성 유지.

### 5.3 앱 출시 관련 (Release)

- **개발자 도구 자동 숨김**: `__DEV__` 글로벌 변수를 사용하여 개발(Debug) 환경에서만 테스트 메뉴(데이터 초기화, 프리미엄 토글 등)가 노출되도록 구성. 릴리즈 빌드(Production)에서는 해당 UI 코드가 자동으로 렌더링에서 제외되어 사용자 노출 차단.
- **인앱 결제(IAP) 시스템 연동 (`react-native-iap`)**:
  - `src/constants/iap.js` 상수 파일을 생성하여 `Product Manager` 스킬의 명명 규칙에 부합하는 결제 상품 식별자(`com.team.today_piece.premium_yearly`)를 전역 상수(`PREMIUM_SKUS`)로 분리 관리함으로써 확장성을 확보함.
  - `SettingsScreen.logic.js`에서 앱 실행 시점(`useEffect`)에 `RNIap.initConnection()` 및 영수증 리스너를 마운트함.
  - 프리미엄 구독 로직은 구글 플레이 및 앱스토어의 `requestSubscription` 트랜잭션으로, 복원 로직은 `getAvailablePurchases` 영수증 검증으로 완전하게 처리됨.

### 5.4 AdMob Integration (광고 연동)
- **모듈**: `react-native-google-mobile-ads`
- **Configuration (환경 변수)**:
  - **App ID**: `app.json`을 통해 네이티브(Android/iOS) 전역 환경으로 주입 (`ca-app-pub-1781835804890106~9205277146`).
  - **Ad Units**: `src/constants/ads.js`에서 보상형 광고(Rewarded Ad) 단위 ID 중앙 관리 (`ca-app-pub-1781835804890106/5632162943`). 개발 환경(`__DEV__`)에서는 계정 보호를 위해 강제로 `TestIds.REWARDED`를 사용.
- **Usage (`WriteScreen.logic.js`)**:
  - 스티커 및 텍스트 박스 한도 초과 시, `rewardTypeRef`('sticker' | 'text')에 따라 동적으로 광고 보상(Reward)을 지급.
  - 이벤트를 리스닝하여 `EARNED_REWARD`가 트리거되었을 때 스마트하게 한도(+2)를 증설함.
  - 프리미엄 구독자는 해당 광고 로딩 로직 전체가 무시되어 최적화된 퍼포먼스를 제공함.

---
*Last Updated: 2026-03-23*
