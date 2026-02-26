# 앱 화면 및 디자인 사양서 (Design & Routing Specification)

이 문서는 앱 내 주요 화면(Screen)들이 어떤 컴포넌트(js 파일)로 연결되어 있으며, 각각 어떤 역할을 수행하고 있는지 정리한 명세서입니다. Modular UI Developer 규칙에 따라 로직(Screen)과 형태(Design) 요소가 어떻게 분리되어 있는지 확인할 수 있습니다.

## 1. 최상단 네비게이션 및 라우터 (`App.js`)

- **경로**: `/App.js`
- **역할**: SQLite 데이터베이스 초기화(앱 구동 시 로딩 화면 렌더링)가 끝나면 `react-navigation`의 라우팅 구조(Bottom Tabs + Stack)를 사용해 화면들을 연결합니다.
  - **하단 탭 바 (`MainTabs`)**: Home, Stats, +(Write), Search, Settings 등 주요 기능 요소들이 배치된 커스텀 네비게이션 뷰.
  - **스택 라우팅 (`Stack.Navigator`)**: `MainTabs`, `Write`, `Summary`, `ActivityList`, `MoodList` 등.

## 2. 메인 스크린 (캘린더 및 일기 목록)

- **파일명**: `MainScreen.js`
- **경로**: `/src/logic/screens/MainScreen.js`
- **역할**: 앱 탭 바의 'Home' 탭에 해당하며 가장 중요한 캘린더 화면입니다. 기분 캐릭터와 달력 레이아웃을 제공하고 한 주, 한 달의 데일리 기록을 렌더링합니다.
- **주요 UI 컴포넌트**: `MoodCharacter`, `DiaryListItem`, `MoodBar`
- **특징**: 상단 헤더 영역이 스크롤(`ScrollView`) 내부에 있어 컨텐츠와 혼연일체로 부드럽게 감겨 올라갑니다.

## 3. 요약 스크린 (데이터 시각화 차트)

- **파일명**: `SummaryScreen.js`
- **경로**: `/src/logic/screens/SummaryScreen.js`
- **역할**: 지난 1년 동안의 기분과 활동 통계를 가로 스크롤 가능한 페이저 형태로 보여줍니다 (1페이지: 기분, 2페이지: 활동). 꺾은선 그래프와 같은 시각화가 포함되어 있습니다.
- **주요 이벤트**: `MoodBar`나 활동 비율을 터치하면 해당하는 상세 리스트 화면으로 넘어갑니다.

## 4. 글쓰기/수정 스크린

- **파일명**: `WriteScreen.js`
- **경로**: `/src/logic/screens/WriteScreen.js`
- **역할**: 캘린더에 기분과 기록을 작성하거나 수정할 때 사용되는 화면입니다.
- **주요 UI 컴포넌트**: 활동 선택용 Chip 버튼, 기분 선택용 카드 그리드.

## 5. 활동별 리스트 스크린

- **파일명**: `ActivityListScreen.js`
- **경로**: `/src/logic/screens/ActivityListScreen.js`
- **역할**: `SummaryScreen`에서 특정 '활동 요약 바'를 눌렀을 때 진입하는 화면입니다. 해당 활동을 했던 날들의 **일기 기록(DiaryListItem)** 들을 모아서 리스트 형태로 렌더링합니다.

## 6. 기분별 리스트 스크린

- **파일명**: `MoodListScreen.js`
- **경로**: `/src/logic/screens/MoodListScreen.js`
- **역할**: `SummaryScreen`에서 특정 '감정 비율 바(`MoodBar`)'를 눌렀을 때 진입하며, 1년간 해당 기분(Mood)으로 작성된 일기 기록들을 정렬해서 보여줍니다.

## 7. 검색 모듈 (SearchScreen)

- **파일명**: `SearchScreen.js`, `SearchLayer.js`
- **경로**: `/src/logic/screens/SearchScreen.js`, `/src/design/SearchLayer.js`
- **역할**: 하단 탭 바의 'Search' 탭에 해당하며 `SearchLayer` 기반의 검색창(`SearchBar`)을 렌더링합니다.
- **최신 디자인 변경**: MainScreen으로부터 완전히 독립된 뷰(Route)를 갖도록 분리되었으며, 렌더링 모듈 분리를 위해 `useSearchLogic`과 통합되었습니다.

## 8. 공통 UI 컴포넌트 및 에셋 모음

- **파일명**: `components.js`, `theme.js`, `stickers.js`, `DoodleStickers.js`, `DraggableSticker.js`
- **경로**: `/src/design/` 하위
- **역할**:
  - `components.js`: 공통 버튼, 카드 등 UI 컴포넌트.
  - `theme.js`: 색상, 여백, 그림자 등 테마 정보.
  - `stickers.js`: '다꾸' 기능을 위한 텍스트(Emoji/Kaomoji) 및 커스텀 그래픽(SVG) 스티커 리스트.
  - `DoodleStickers.js`: 'Doodle Flash' 스타일(No Outlines)이 적용된 SVG 기반 브랜드 스티커 컴포넌트 모음.
  - `DraggableSticker.js`: `PanResponder`를 활용하여 자유롭게 드래그하고 위치를 조정할 수 있는 스티커 컴포넌트 (일기 작성 화면 내부 등에서 사용).
