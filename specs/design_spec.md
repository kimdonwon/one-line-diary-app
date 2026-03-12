# 애플리케이션 디자인 및 라우팅 사양서 (Design & Routing Specification)

이 문서는 프로젝트의 UI/UX 화면 구성 요소와 시각적 구현 원칙, 각 기능 컴포넌트(`*.view.js`, `*.styles.js`)가 어떻게 설계되었고 연결되어 있는지 정리한 명세서입니다.

## 1. 디자인 시스템 철학 (Design Philosophy)

* **Modular UI Developer**: 로직(Business Logic)과 형태(Design)를 철저히 분리하여, 뷰 컴포넌트는 무상태(stateless)에 가깝게 순수 UI 렌더링에만 집중합니다.
* **Notion Style 미니멀리즘**: 쨍하지 않은 `#F1F1F0`, `#E9E9E7` 배경 컬러와 진회색 `#37352F` 텍스트를 주로 사용하여, 여백이 많고 플랫하며 정갈한 문서 작성 도구의 느낌을 부여.
* **Doodle Flash (MZ 감성 선화)**: 아기자기한 색연필/마커 펜 질감 느낌이 나는 선형 이모지(Line Art), 파스텔 도형을 메인 아이콘/스티커 메타포로 조화시킴. 투박하지만 귀엽고 시선을 끄는 "완벽하지 않아서 예쁜" MZ 감성을 추구.

---

## 2. 화면 단위 명세서

### 2.1 메인 스크린 (Calendar & Dashboard)

* **로케이션**: `src/screens/MainScreen/`

* **시각적 특징**:
  * **캘린더 스프링 효과**: 캘린더 날짜(`DayCell`)를 누르면 `Animated.spring`이 발동해 0.85로 쪼그라들었다가 원상태(1.0)로 탄성 있게 돌아옵니다 (촉각 피드백 디자인 극대화).
  * **기분 컬러 연동**: 해당 주(Week)에 기록된 일기 중 가장 빈번한 기분 이모지의 고유 Color를 뽑아 주간 행 배경에 Alpha(투명도) 텐트를 적용해 직관성을 높입니다.
  * **게이지 & 파티클 (Micro-interactions)**:
    * 활동량 및 기분 Bar는 렌더링 시 너비가 0%에서 목표 퍼센티지까지 600ms 속도로 애니메이션되며 차오르는 트랜지션을 적용 (스포티하고 다이내믹한 렌더).
    * 중앙 배너(주인공 칭호 등) 터치 시 React-Native-Confetti 라이브러리 기반 커스텀 파티클(`ConfettiEffect`)이 화면 중앙에서 사방으로 팡 터지는 이벤트 부여.

### 2.2 피드 열람 스크린 (DiaryFeedScreen)

* **로케이션**: `src/screens/DiaryFeedScreen/`

* **시각적 특징**:
  * **Card View 비율 고정**: 기종 파편화를 방지하기 위해 스마트폰 화면 종횡비에 입각하여 `DIARY_CARD_HEIGHT`를 Viewport의 넓은 백분율에 고정하고 카드 너비를 할당. `WriteScreen`의 작성 창 비율과 열람 피드 카드의 시각적 오차 범위를 일치시킵니다.
  * **페이징 도트 (Pagination Indicator)**: 인스타그램 멀티 이미지 업로드 형식과 동일한 UI 차용. 활성 탭은 `16x6` 캡슐 형태의 Bar, 비활성 탭은 `6x6` 도크 형태 처리 (`Soft shadow` 탑재).
  * **드로잉 모드 (SVG Overlay)**: 플로팅되어 있는 형광펜(Highlighter) 버튼을 활성화시켜 일기 피드 전면 위에 16px의 라운드 캡, opacity 45%를 적용한 매끄러운 포인트 선을 자유롭게 그릴 수 있습니다. 이 과정에서 피드 컴포넌트는 오접력을 막기 위해 스크롤을 `false` 처리.

### 2.3 작성 및 꾸미기 스크린 (WriteScreen)

* **로케이션**: `src/screens/WriteScreen/`

* **시각적 특징**:
  * **멀티페이지 (Edge Pull Trigger)**: 카드(`FlatList horizontal`)를 스와이프하면 가장 우측에 `__ADD_PAGE__` 역할을 하는 + 더미 박스 렌더링. 대시 선(`borderStyle: 'dashed'`)과 반투명도를 결합해 아직 생기지 않은 "미래 페이지"를 은유함.
  * **다꾸 전용 하단 탭바**: 작성 화면 하단에 `[홈 | 일기 | 완료 | 요약 | 설정]` 구성의 네비게이션 바가 배치됩니다. 상단 헤더의 중복된 확인 버튼을 제거하고, 중앙의 '완료' 버튼으로 저장 동선을 통합했습니다. 특히 이 버튼은 사용자가 기분을 선택할 때마다 해당 기분의 고유 컬러로 즉시 변경되어 시각적인 피드백을 제공합니다.
  * **스티커 서랍장 & 카테고리 (Sortable Tray)**: Notion 탭 UI. 활성 카테고리명 탭(배경색 #F1F1F0, 텍스트 볼드 700 차콜). 1차원 수평 배열 레이블(emoji, legacy, random 등) 스크롤 리스트.
  * **폴라로이드 프레임 렌더 (DraggablePhoto)**: 흰색, 검은색(반투명 필름 오버레이 추가), 파스텔 핑크, 파스텔 블루, 파스텔 민트 색상의 폴라로이드 사진 종이 모양 구현. 하단 여백이 두껍고 (126x144 크기), Inner 룩은 정방형(`border 1px border-inner`). 자연스러운 10도 회전이나 Drop shadow 투사로 현실 다이어리 종이에 사진 질감 구현.
  * **반투명 프레임 (Transparent Frame)**: 흰색(`rgba(255,255,255,0.88)`)과 회색(`rgba(200,200,198,0.82)`)의 반투명 프레임. 기존 폴라로이드와 똑같은 형태 및 크기(126x144, 하단 여백 포함)를 유지하되, 약간의 투명도를 통해 은은한 느낌을 줌. 안드로이드 그림자 옵셋(elevation: 0)을 최소화하여 텍스트 레이어(zIndex: 2) 뒤(zIndex: 1)에 자연스럽게 배치됨. 사진 프레임 바텀시트에서 '폴라로이드 색상' / '반투명 프레임' 탭으로 분리 제공.
  * **디지털 스크랩북 캔버스 (Tap-to-Write)**: 기존 고정 TextInput 영역을 제거하고 전체 카드를 빈 캔버스로 전환. 종이 질감(`#FBF8F4`) 배경과 따뜻한 크라프트지 테두리(`#E2DED0`)로 실제 스크랩북 느낌 구현. 빈 캔버스에 `✏️ 화면을 터치해서 일기를 써보세요` 안내 문구 표시(opacity 0.4). 터치하면 해당 위치에 인라인 편집 가능한 텍스트 카드가 생성됨.
  * **인디케이터 색상 동기화**: 페이지 인디케이터(Dots)가 위치한 상단 영역의 배경색을 현재 캔버스의 배경색과 100% 일치시켜, 카드 전체가 파편화되지 않고 하나의 완성된 테마처럼 느껴지도록 시각적 완성도를 높임. *(v2.3 추가)*
  * **텍스트 설정 패널 (Independent Color Scroll)**: 텍스트의 문자 색상과 하이라이트 색상을 독립적으로 선택할 수 있도록 두 줄의 스크롤바를 각각 분리하여 사용자 편의성을 높임.
  * **스티커 팩 로테이션 제어기 (Single-Handle Rotation Slider)**: 터치(포커스)된 스티커 우측 하단에만 흰 배경+파스텔 외곽선의 얇은 `↻` 회전 아이콘 마운트. 다중 제스처의 피로도를 낮추고 소형 오브젝트 조작 향상.
  * **Floating Glass Island & Seamless Morphing Dock**: 하단 도구 패널(텍스트, 사진, 스티커)은 반투명 블러 효과(`expo-blur`의 BlurView)가 적용된 단일 바텀시트 컨테이너로 통합되었습니다. 기존 `integratedDiaryCard` 내부의 클리핑 문제를 해결하기 위해 최상위 루트 뷰(`KeyboardAvoidingView` 외부)로 위치를 이동하였으며, 높이를 `280 + insets.bottom`으로 확장하여 모든 기기에서 콘텐츠가 짤림 없이 노출되도록 설계되었습니다. **가로 스와이프(Horizontal Paging)** 기능을 탑재하여 스티커, 사진, 텍스트 스타일 패널 사이를 직관적으로 오갈 수 있으며, 외부 영역 터치 시 자동으로 닫히는 UX가 적용되었습니다. 드래그 중에는 도구 패널이 투명해지며 조작을 방해하지 않도록 설계되었습니다.
### 2.4 요약 스크린 (SummaryScreen)

* **로케이션**: `src/screens/SummaryScreen/`

* **시각적 특징**:
  * 차분하고 진지한 데이터 통계 리뷰이므로 불필요한 스티커 요소를 걷어내고, 여백 기준 Padding(수직 공간 간격)을 늘림.
  * **연도 선택 시스템 (Interactive Year Picker)**: 상단 헤더의 연도 타이틀을 터치하면 Notion 스타일의 미니멀한 연도 선택 모달이 나타납니다. 2020년부터 현재까지의 연도를 선택하여 해당 기간의 데이터를 즉시 리로드하여 비교해볼 수 있습니다.
  * 연간, 월별 차트 렌더링. 모듈화된 `<MoodStatRow />`, `<ActivityStatRow />`로 색채 및 도식 통일화 규격 준수.
  * **🍱 연간 모먼트 벤토 보드 (Bento Board)**:
    * 기분 분석 페이지 최상단에 배치되는 Bento Grid 레이아웃의 통합 대시보드.
    * **Main Tile** (풀 너비): 다크 배경(`#37352F`) + 화이트 타이포그래피로 올해의 키워드를 대형 폰트(34pt, 800 weight)로 강조. 서브 키워드는 반투명 칩으로 하단 배치.
    * **Status Tile** (반 너비): 화이트 배경 + 얇은 실선 보더로 총 작성일수를 대형 폰트(36pt)로 표시. 연속 기록 배지(🔥)는 따뜻한 옐로우 배경의 소형 뱃지.
    * **Activity Tile** (반 너비): 해당 활동의 고유 파스텔 컬러 배경. 우하단에 대형 활동 아이콘(50px, opacity 0.3)을 장식적으로 배치.
    * **Mood Tile** (풀 너비): 지배적 감정의 고유 컬러 배경 + MoodCharacter SVG 캐릭터(60px). 가로 레이아웃으로 텍스트와 캐릭터를 양쪽에 배치.
    * 모든 타일: `borderRadius: 20`, `FadeIn` 진입 애니메이션(500ms).

### 2.5 잠금 및 보안 모달 (LockScreen & Setup Modal)

* **로케이션**: `src/screens/LockScreen/`

* **시각적 특징**:
  * **Doodle Flash 키패드**: 전통적인 원형 외곽선 테두리(BorderWidth)를 없애고 파스텔 면(Face)만으로 키패드를 띄움.
  * 별, 반짝이(Sparkle) 등 장식 SVG(absolute position)가 화면을 꾸며 지루한 비밀번호 창을 친근하게 유도.
  * 인증 에러 발생 시 4개의 상태 도미노(Dots)가 좌우로 흔들리는 ShakeAnimation(20ms interval), 디바이스 진동(Haptics) 연동.

### 2.6 기분 캐릭터 (Mood Characters - Doodle Flash)

* **로케이션**: `src/constants/MoodCharacters.js`
* **시각적 특징**:
  * **일관된 스타일**: Damian Orellana의 'Doodle Flash' 아트워크 스타일을 차용하여, 따뜻한 브라운 라인(`#5C4033`)과 파스텔톤 컬러링을 적용.
  * **캐릭터 구성**:
    * **🐸 개구리 (기쁨/HAPPY)**: 파스텔 그린, 활짝 웃는 입.
    * **🐱 고양이 (슬픔/SAD)**: 파스텔 블루, 아머 스타일의 로봇 고양이.
    * **🐥 병아리 (화남/ANGRY)**: 동그란 얼굴, 삐죽한 눈썹, 다이아몬드 부리.
    * **🐻 곰 (쏘쏘/SOSO)**: 파스텔 그레이, 살짝 미소 짓는 표정.
    * **🐰 토끼 (당황/CONFUSED)**: 파스텔 핑크, 긴 귀와 물음표 장식.
  * **기술적 사양**: `react-native-svg` 기반의 벡터 그래픽으로 구현되어 모든 해상도에서 선명도를 유지하며, `size` prop을 통해 유연한 크기 조절 가능.

---

## 3. 공통 라우팅 규칙 및 컬러 토큰 (Theme Palette)

* **Navigator Stack (App.js)**:
  * 기본 레이아웃은 하단 `BottomTabNavigator` (`Home`, `Diary`, `+`, `Summary`, `Settings`) 구성.
  * 글쓰기 버튼(`+`)은 탭이 아니라 인터셉트 형식으로 동작해 `WriteScreen`을 메인 스택으로 Push (팝업 같은 뎁스). `Search`, `Modal` 역시 Stack으로 계층화.
* **Palette & Shadow (theme.js)**:
  * `bgLight`: '#FAFAFA' / `white`: '#FFFFFF'
  * `text`: '#4A3728' (따뜻한 브라운) / `textSecondary`: '#9E8E82' (보조)
  * `happy`: '#7CD4A0' (그린), `sad`: '#8BBFEF' (블루), `chick/angry`: '#FEE97D' (옐로우)
  * Box Shadow는 Android `elevation: 4`, iOS `shadowOpacity: 0.15`, `shadowOffset: { width:0, height:4 }`의 부드러운 분산 규칙 통일 적용.
