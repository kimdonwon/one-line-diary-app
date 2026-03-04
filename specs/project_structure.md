# 오늘조각 (Diary App) 모듈형 프로젝트 구조 명세서

본 프로젝트는 **Modular UI Developer** 스킬을 기반으로 한 최적화된 소규모/중규모 계층형 구조(디자인-로직 응집형)를 따릅니다. 각 화면 내부에서 역할(View, Logic, Styles)을 철저히 분리하여 유지보수성과 생산성을 극대화합니다.

---

## 📂 전체 디렉토리 구조도

```text
src/
├── components/                            # 공통 UI 및 기능 컴포넌트 (Shared)
│   ├── DraggableSticker/                  # (복합 컴포넌트) 스티커 드래그 앤 드롭
│   │   ├── index.js                       # 컴포넌트 진입점
│   │   ├── DraggableSticker.view.js       # UI 렌더링 및 레이아웃
│   │   ├── DraggableSticker.logic.js      # 드래그 제스처 및 상태 관리 로직
│   │   └── DraggableSticker.styles.js     # 스티커 전용 스타일 지정
│   ├── PinSetupModal/                     # PIN 번호 설정 모달 컴포넌트
│   │   ├── index.js
│   │   └── PinSetupModal.js               
│   ├── ComboShakeWrapper.js               # 연속 작성 시 콤보 쉐이크 애니메이션 래퍼
│   ├── ConfettiEffect.js                  # 축하/이벤트 시 파티클(폭죽) 애니메이션 효과
│   ├── DiaryEntryCard.js                  # 일기 목록의 개별 항목(Card) 공통 렌더링 UI
│   ├── SearchLayer.js                     # 검색 창 및 검색 결과 오버레이 레이어
│   └── index.js                           # 재사용 가능한 원자(Atomic) 단위 UI 내보내기 (Button, Card 등)
│
├── constants/                             # 앱 전역 설정, 테마, 정적 자산 및 목업 데이터
│   ├── theme.js                           # 색상(COLORS), 폰트(FONTS), 그림자(SOFT_SHADOW), 간격 등 토큰
│   ├── icons.js                           # 화면 상단/하단 내비게이션에 쓰이는 SVG/웹/이미지 아이콘 집합
│   ├── mood.js                            # 감정(Mood) 상태 데이터 포맷 및 헬퍼 함수
│   ├── MoodCharacters.js                  # 감정에 따른 캐릭터 에셋 매핑
│   ├── activities.js                      # 활동(Activity) 데이터 목록 상수
│   ├── ActivityIcons.js                   # 특정 활동과 매핑되는 고유 아이콘 
│   ├── stickers.js                        # 모든 스티커 메타데이터 진입점
│   ├── DoodleStickers.js                  # 두들(Doodle) 테마 스티커 목록
│   ├── FaceStickers.js                    # 얼굴/표정 테마 스티커 목록
│   ├── FoodStickers.js                    # 음식 테마 스티커 목록
│   ├── MZLineStickers.js                  # MZ 라인 테마 스티커 목록
│   ├── PastelStickers.js                  # 파스텔 테마 스티커 목록
│   └── ItStickers.js                      # 아이티 테마 스티커 목록
│
├── context/                               # 전역 상태를 파편화 없이 관리하는 React Context
│   ├── LockContext.js                     # 앱 잠금(PIN) 상태 전역 관리
│   └── MoodContext.js                     # 감정 테마 전역 상태 관리
│
├── hooks/                                 # 여러 화면에서 재사용할 수 있는 도메인 비즈니스 로직
│   ├── useDiary.js                        # SQLite 등과 연동하여 일기 DB CRUD 로직 처리
│   └── useSearchLogic.js                  # 검색/필터링 조건 상태 및 결과 처리
│
├── database/                              # 로컬 스토리지 또는 외부 API 연동 계층
│   └── db.js                              # SQLite 로컬 DB 테이블 생성, 버전 관리 및 마이그레이션 적용
│
├── screens/                               # 화면별 캡슐화된 코드 (화면 각각이 하나의 온전한 모듈)
│   ├── ActivityListScreen/                # [활동 목록] 단위 컴포넌트 폴더
│   ├── CalendarScreen/                    # [달력 조회] 달력을 통한 일별 감정 조회
│   ├── DiaryFeedScreen/                   # [일기 피드] 피드 형태의 무한 스크롤 또는 전체 리스트 조회
│   ├── LockScreen/                        # [잠금 화면] PIN 번호 검증을 위한 보호막 화면
│   ├── MainScreen/                        # [메인 홈] 일기 작성 시작 및 당일 기록 요약 대시보드
│   ├── MoodListScreen/                    # [감정별 조회] 특정 감정이 기록된 일기만 모아보기
│   ├── ProfileScreen/                     # [프로필 정보] 사용자 통계 및 개인 공간 세팅
│   ├── SearchScreen/                      # [검색 화면] 키워드 기반 상세 기록 탐색
│   ├── SettingsScreen/                    # [설정 화면] 데이터 백업/복구 및 기능 토글 설정
│   ├── SummaryScreen/                     # [통계 분석] 이번 달, 등 기간별 통계
│   │   ├── components/                    # 요약 화면 전용 UI 컴포넌트
│   │   │   ├── MoodActivityCorrelation.js # 감정과 활동 간의 상관관계 그래프 UI
│   │   │   └── StickerRanking.js          # 사용 빈도수가 가장 높은 스티커 랭킹 UI
│   ├── WriteScreen/                       # [일기 작성] 스티커 다꾸 및 일기 텍스트 작성 에디터
│   │
│   └── *각 화면 내 공통 파일 구성 요건 (예시: MainScreen 기준)*
│       ├── index.js                       # 화면을 외부로 노출하는 라우팅 진입점
│       ├── MainScreen.view.js             # 화면의 시각적인 레이아웃(JSX/UI 컴포넌트 결합)
│       ├── MainScreen.logic.js            # 데이터 패칭, 이벤트 반응, 상태 등 추상화된 비즈니스 훅
│       └── MainScreen.styles.js           # 뷰에서 필요한 StyleSheet 파편화 방지
│
└── utils/                                 # 특정 도메인에 종속되지 않은 순수 헬퍼 함수
    └── backupRestore.js                   # JSON 생성/읽기, 로컬 캐시 등을 통한 백업 및 복원 엔진
```

---

## 🛠 핵심 원칙 (Core Principles)

### 1. **디자인(View)과 로직(Logic)의 완전한 분리**

- 각 화면 모듈은 반드시 `view.js`와 `logic.js`로 분리하여 관리합니다.
- `view.js`는 `logic.js` 훅을 호출하여 반환받은 데이터와 함수(Event Handler)만으로 뷰를 렌더링하며, **안에서 복잡한 상태나 데이터를 조작하지 않습니다.** UI 수정이나 레이아웃 변경 시에는 `view.js`와 `styles.js`만 확인합니다.

### 2. **기능 중심 모듈화 (Encapsulation)**

- 한 화면 내에서만 쓰이는 특징적이고 복잡한 하위 컴포넌트는 글로벌 `src/components/`가 아닌 해당 기능 단위 화면(예: `SummaryScreen/components/`)에 두어 응집도를 높입니다.
- 관련된 코드는 흩어지지 않고 같은 폴더 안에 머물러야 합니다.

### 3. **중앙화된 상수 (Constants First)**

- 아이콘 모양, 스티커 세트, 색상값, 패딩 치수는 하드코딩(_매직 넘버/매직 스트링_)하지 않고 반드시 `src/constants/` 내 모듈을 사용함으로써 앱 전반적인 스킨 변경(예: 다크 모드 등)이나 규칙 개편을 한 곳에서 통제합니다.

### 4. **단일 진입점 전략 (Index Export)**

- 외부 모듈에서 폴더 내의 컴포넌트/화면을 임포트할 땐 `import Screen from './Screen'`처럼 `index.js`를 거치게 만들어, 내부 구조가 어떻게 바뀌든 외부 연결(App.js 등의 Navigators)이 깨지지 않는 깔끔함을 유지합니다.
