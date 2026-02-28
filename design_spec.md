# 앱 화면 및 디자인 사양서 (Design & Routing Specification)

이 문서는 앱 내 주요 화면(Screen)들이 어떤 컴포넌트(js 파일)로 연결되어 있으며, 각각 어떤 역할을 수행하고 있는지 정리한 명세서입니다. Modular UI Developer 규칙에 따라 로직(Screen)과 형태(Design) 요소가 어떻게 분리되어 있는지 확인할 수 있습니다.

## 1. 최상단 네비게이션 및 라우터 (`App.js`)

- **경로**: `/App.js`
- **역할**: SQLite 데이터베이스 초기화 후 네비게이션 구조(Bottom Tabs + Stack) 연결.
  - **하단 탭 바 (`MainTabs`)**: Home, Stats, +(Write), Search, Settings
  - **스택 라우팅 (`Stack.Navigator`)**: `MainTabs`, `Write`, `Summary`, `ActivityList`, `MoodList`
- **기본 색상 규칙**: 기분 데이터 없을 때 HAPPY(초록, #7CD4A0)를 기본값으로 사용

## 2. 메인 스크린 (캘린더 및 일기 목록)

- **파일명**: `MainScreen.view.js`, `MainScreen.logic.js`, `MainScreen.styles.js`
- **경로**: `/src/screens/MainScreen/`
- **역할**: 캘린더 + 월간 기분/활동 요약 + 일기 목록
- **주요 기능**:
  - 📅 **캘린더 터치 효과**: 날짜 셀 터치 시 `Animated.spring` scale bounce (0.85 → 1.0)
  - 📅 **스와이프 제스처**: `PanResponder`로 좌우 드래그 시 이전/다음 달 이동 (50px 이상 dx)
  - 🎨 **주간 기분 색상**: 해당 주의 가장 빈번한 기분의 `bgColor`로 셀 배경 tinting
  - 📊 **게이지 애니메이션**: MoodBar + 활동 바 모두 0% → 목표%까지 600ms 게이지 차오름
  - 🎉 **팡 효과**: "이번 달 주인공" 배너 터치 → `ConfettiEffect` 파티클 발사

## 3. 요약 스크린 (데이터 시각화 차트)

- **파일명**: `SummaryScreen.view.js`, `SummaryScreen.logic.js`, `SummaryScreen.styles.js`
- **경로**: `/src/screens/SummaryScreen/`
- **역할**: 연간 기분/활동 통계 (2페이지 가로 스크롤)
- **주요 기능**:
  - 📊 **게이지 애니메이션**: 전체 밸런스, 활동 분야별 요약 바 차오름 효과
  - 🎉 **팡 효과**: "올해의 핵심 기분", "올해의 최다 활동" 배너 터치 → `ConfettiEffect`

## 4. 글쓰기/수정 스크린

- **파일명**: `WriteScreen.view.js`, `WriteScreen.logic.js`, `WriteScreen.styles.js`
- **경로**: `/src/screens/WriteScreen/`
- **역할**: 기분 + 일기 + 활동 + 스티커 작성/수정
- **프리미엄 연동**: `isPremium` 상태에 따라 스티커 최대 개수 조절 (free: 5, premium: 99)

## 5. 잠금 화면 (LockScreen) — Doodle Flash 스타일 리디자인

- **파일명**: `LockScreen.view.js`, `LockScreen.styles.js`
- **경로**: `/src/screens/LockScreen/`
- **디자인 특징** (Doodle Flash 원칙 적용):
  - 🎨 외곽선 없는 파스텔 면 기반 숫자 패드 (borderWidth 제거)
  - ✦ 반짝이 데코 장식 (position: absolute)
  - 🔐 초록색(HAPPY) 포인트 컬러 도트 + scale 애니메이션
  - 📳 오류 시 도트 줄 전체 shake 애니메이션
  - 🫳 지문 아이콘 SVG + "생체인증으로 열기" 링크

## 6. PIN 설정 모달 (PinSetupModal)

- **파일명**: `PinSetupModal.js`
- **경로**: `/src/components/PinSetupModal/`
- **역할**: 설정 화면에서 비밀번호 설정/변경 시 사용하는 bottom-sheet 스타일 모달
- **2단계 플로우**: "새 비밀번호 입력" → "비밀번호 확인" (불일치 시 shake + 진동)

## 7. ConfettiEffect 컴포넌트

- **파일명**: `ConfettiEffect.js`
- **경로**: `/src/components/ConfettiEffect.js`
- **역할**: 이모지/텍스트가 중심에서 사방으로 팡 터지는 파티클 효과
- **트리거**: `trigger` prop 증가 시 `particleCount`개 파티클 생성 + scale/translate/opacity 애니메이션

## 8. 설정 스크린

- **파일명**: `SettingsScreen.view.js`, `SettingsScreen.logic.js`, `SettingsScreen.styles.js`
- **경로**: `/src/screens/SettingsScreen/`
- **주요 섹션**:
  - **보안**: 암호 잠금 스위치 + 비밀번호 변경 (PinSetupModal 연동)
  - **프리미엄**: 업그레이드 토글 버튼 (스티커 제한 해제)

## 9. 공통 UI 컴포넌트

- **파일명**: `components/index.js`, `theme.js`, `stickers.js`, `DoodleStickers.js`, `DraggableSticker.js`
- **MoodBar**: 게이지 차오름 애니메이션 적용 (`Animated.timing`, 600ms)
