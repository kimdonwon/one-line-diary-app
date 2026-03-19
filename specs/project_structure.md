# 📔 오늘조각 (Diary App) 모듈형 프로젝트 구조 명세서

본 프로젝트는 **Modular UI Developer** 스킬을 기반으로 한 최적화된 계층형 구조(디자인-로직 응집형)를 따릅니다. 각 화면과 핵심 컴포넌트 내부에서 역할(View, Logic, Styles)을 철저히 분리하여 유지보수성과 생산성을 극대화합니다.

---

## 📂 전체 디렉토리 구조도

```text
src/
├── components/                            # 🧩 공통 및 복합 UI 컴포넌트 (Shared)
│   ├── BottomBar/                         # 작성 화면 하단 툴바 (이모지, 사진, 텍스트 도구)
│   ├── DraggablePhoto/                    # 📸 사진 드래그/회전/크기 조절 컴포넌트
│   ├── DraggableSticker/                  # ✨ 스티커 드래그/회전/크기 조절 컴포넌트
│   ├── DraggableText/                     # ✍️ 텍스트 입력 및 드래그 컴포넌트
│   ├── RotationHandle/                    # 🔄 드래그 요소의 회전/스케일 제어 핸들
│   ├── NotionTabBar/                      # 노션 스타일의 하단 탭 내비게이션
│   ├── PinSetupModal/                     # PIN 번호 설정 모달
│   ├── ComboShakeWrapper.js               # 연속 기록 시 콤보 쉐이크 애니메이션
│   ├── ConfettiEffect.js                  # 축하/이벤트 시 파티클 애니메이션
│   ├── DiaryEntryCard.js                  # 일기 목록 아이템 공통 카드 UI
│   ├── SearchLayer.js                     # 검색 오버레이 레이어
│   └── index.js                           # 재사용 가능한 UI 원자 단위 내보내기
│
├── constants/                             # ⚙️ 전역 설정, 테마 및 정적 데이터
│   ├── theme.js                           # 색상(COLORS), 폰트, 그림자 등 디자인 토큰
│   ├── mood.js                            # 감정(Mood) 상태 데이터 및 헬퍼
│   ├── MoodCharacters.js                  # 감정별 캐릭터 에셋 매핑
│   ├── activities.js / ActivityIcons.js   # 활동(Activity) 데이터 및 아이콘 매핑
│   ├── stickers.js                        # 모든 스티커 메타데이터 진입점
│   └── *Stickers.js                       # 카테고리별 스티커 (Doodle, Face, Food, It, MZ, Pastel 등)
│
├── context/                               # 🌐 전역 상태 관리 (React Context)
│   ├── LockContext.js                     # 앱 잠금(PIN) 상태 전역 관리
│   └── MoodContext.js                     # 감정 테마 및 전역 색상 관리
│
├── hooks/                                 # ⚓️ 도메인 비즈니스 로직 (Custom Hooks)
│   ├── useDraggable.js                    # 🛠 드래그 엔진 핵심 (회전, 스케일, 보정 로직)
│   ├── useDiary.js                        # SQLite 연동 일기 CRUD 로직
│   ├── useBentoBoard.js                   # 🍱 벤토 보드 통계 및 데이터 처리
│   ├── useSearchLogic.js                  # 검색/필터링 조건 및 결과 처리
│   └── usePremium.js                      # 인앱 결제 및 프리미엄 상태 관리
│
├── database/                              # 🗄 로컬 데이터 계층
│   └── db.js                              # SQLite 초기화, WAL 모드 설정, 트랜잭션 관리
│
├── screens/                               # 📱 화면별 독립 모듈 (Encapsulated Modules)
│   ├── ActivityListScreen/                # 활동 기록 목록 및 추가
│   ├── CalendarScreen/                    # 달력 기반 감정/기록 조회
│   ├── DiaryFeedScreen/                   # 전체 일기 피드 리스트
│   ├── LockScreen / LoginScreen/          # 보안 및 인증 화면
│   ├── MainScreen/                        # 메인 홈 대시보드
│   ├── MoodListScreen/                    # 특정 감정별 일기 모아보기
│   ├── ProfileScreen/                     # 사용자 설정 및 통계 요약
│   ├── SearchScreen/                      # 키워드 기반 기록 탐색
│   ├── SettingsScreen/                    # 백업/복구 및 앱 환경 설정
│   ├── SummaryScreen/                     # 상세 통계 및 🍱 벤토 보드
│   └── WriteScreen/                       # 🎨 일기 작성 및 다꾸 에디터
│
└── utils/                                 # 🛠 순수 헬퍼 및 유틸리티
    ├── backupRestore.js                   # 데이터 + 사진 패키징 백업/복원 엔진
    └── wordAnalyzer.js                    # 📝 Hermes 호환 단어 빈도 분석 유틸
```

---

## 🏗 화면/컴포넌트 내부 구조 (Modular UI)

각 화면과 복합 컴포넌트는 반드시 아래 4개 파일로 구성되어 역할이 분리됩니다.

| 파일명 | 역할 | 설명 |
|:--- |:--- |:--- |
| **index.js** | 진입점 (Entry) | 외부 노출을 위한 최상위 파일 (주로 Navigator에서 참조) |
| **.logic.js** | 로직 (Logic) | `useState`, `useEffect`, 이벤트 핸들러 등 모든 상태 로직 캡슐화 |
| **.view.js** | 뷰 (View) | 순수 UI 렌더링. Logic 훅에서 받은 데이터와 함수만 사용하여 레이아웃 구성 |
| **.styles.js** | 스타일 (Styles) | 디자인 요소(StyleSheet)를 분리하여 View 가독성 확보 |

---

## ⚙️ 프로젝트 주요 설정 파일

- **app.json**: Expo 앱 메타데이터 (이름, 아이콘, 스플래시, 플랫폼별 설정).
- **eas.json**: Expo Application Services 빌드 및 배포 설정.
- **metro.config.js**: React Native용 번들러(Metro) 커스텀 설정.
- **package.json**: 의존성 라이브러리 및 스크립트 관리.
- **tsconfig.json**: TypeScript 설정 (JS 파일이더라도 타입 체크/힌트용으로 존재).

---

## 🎨 자산 관리 (Assets)

- **assets/characters/**: 감정 상태를 표현하는 캐릭터 이미지 에셋.
- **assets/app-screenshots/**: 앱 스토어 등록을 위한 마케팅 스크린샷.
- **assets/icon.png / splash.png**: 앱 아이콘 및 실행 시 스플래시 이미지.

---

## 🛠 핵심 설계 원칙

1. **Strict Separation**: View는 로직을 모르고, Logic은 UI 구조를 모릅니다. 오직 인터페이스(Props/Returns)로만 대화합니다.
2. **Atomic to Composite**: `src/components/index.js`에서 작은 단위(Atomic)를 제공하고, 각 화면은 이를 조합하여 복합(Composite) 기능을 구성합니다.
3. **Single Source of Truth**: 모든 상수(색상, 치수, 텍스트)는 `src/constants/`를 통해서만 관리되어 일관성을 유지합니다.

---
*Last Updated: 2026-03-18*
