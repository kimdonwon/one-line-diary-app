# 오늘조각 (Diary App) 모듈형 프로젝트 구조

본 프로젝트는 **Modular UI Developer** 스킬을 기반으로 한 최적화된 소규모/중규모 레이어 구조(디자인-로직 응집형)를 따르고 있습니다.
각 화면 내부에서 역할(View, Logic, Styles)을 분리하여 유지보수성과 생산성을 극대화합니다.

## 디렉토리 구조도

```text
src/
├── components/          # 공통 UI 컴포넌트 (Shared UI)
│   ├── DraggableSticker/
│   │   ├── index.js
│   │   ├── DraggableSticker.view.js
│   │   ├── DraggableSticker.logic.js
│   │   └── DraggableSticker.styles.js
│   ├── index.js         # (기존 components.js - Card 등 원자 단위)
│   └── SearchLayer.js
│
├── constants/           # 디자인 시스템 및 불변 데이터 (Theme, Mock, Icons)
│   ├── theme.js         # 색상, 공통 스타일 속성 (COLORS, SOFT_SHADOW 등)
│   ├── icons.js         # 앱 상단/하단 메뉴에서 쓰이는 아이콘 컴포넌트
│   ├── stickers.js
│   ├── DoodleStickers.js
│   ├── mood.js          # 무드 데이터 및 유틸 함수
│   ├── MoodCharacters.js
│   ├── activities.js
│   └── ActivityIcons.js
│
├── hooks/               # 전역/공통 커스텀 훅 (Domain Logic)
│   ├── useDiary.js      # 사용자 일기 전역 상태 관리
│   └── useSearchLogic.js
│
├── database/            # 데이터베이스 쿼리/관리 레이어
│   └── db.js            # SQLite 로컬 DB 초기화 및 CRUD
│
└── screens/             # 화면별 독립적인 캡슐화 레이어
    ├── MainScreen/      # 하나의 기능이나 페이지가 모듈처럼 동작합니다.
    │   ├── index.js             # 화면의 진입점 (View와 Logic을 결합하여 내보냄)
    │   ├── MainScreen.view.js   # 순수 UI 렌더링 영역
    │   ├── MainScreen.logic.js  # 상태 관리, 로직 파이프라인
    │   └── MainScreen.styles.js # 디자인 명세, 간격 조정 등
    ├── WriteScreen/
    ├── CalendarScreen/
    ├── MoodListScreen/
    ├── ActivityListScreen/
    ├── SummaryScreen/
    ├── SearchScreen/
    └── SettingsScreen/
```

## 핵심 원칙

1. **디자인과 로직의 완벽한 분리**
   - 각 `Screen`마다 `view.js`, `logic.js`, `styles.js` 3개의 파일이 한 세트로 묶여 관리됩니다. UI가 바뀌면 `view`와 `styles`만, 버튼 데이터나 로직이 바뀌면 `logic`만 봅니다.
2. **Context Switching 최소화**
   - 기존의 `design/...` 폴더와 `logic/...` 폴더를 분리하여 오가던 방식에서, **관려된 화면의 로직과 디자인 코드를 같은 폴더(`screens/화면이름/`)에 배치**하도록 리팩토링되었습니다.
3. **공통 스토어 (Constants & Hooks)**
   - 재사용이 잦은 색상 팔레트와 디자인 수치는 `constants/` 하위에 배치합니다.
   - 글로벌한 일기 데이터 등 도메인 로직은 `hooks/` 디렉터리에 추출하여 화면끼리의 의존성을 낮춥니다.
