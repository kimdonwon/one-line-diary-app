# 📊 통계 및 그래프 명세 (Chart Specification)

이 문서는 '오늘조각' 앱의 각 화면(메인, 요약)에서 제공되는 감정 분석 및 활동 통계 그래프의 데이터 로직과 시각화 명세를 상세히 정의합니다.

---

## 1. 메인 화면: 월간 기분 흐름 (Main Screen: Monthly Mood Trend)

*   **목적**: 해당 월의 일별 기분 변화를 꺾은선 그래프로 시각화하여 감정의 기복을 한눈에 파악합니다.
*   **데이터 로직**:
    *   **샘플링**: 해당 월의 1일부터 마지막 날까지의 모든 일기 데이터를 스캔합니다.
    *   **점수화**: 기분 키값을 1~5점 점수로 변환합니다. (`HAPPY: 5`, `SOSO: 4`, `EMBARRASSED: 3`, `ANGRY: 2`, `SAD: 1`)
    *   **좌표 계산**:
        *   `X축`: 날짜 (1일 ~ 말일)를 그래프 너비에 맞춰 분배.
        *   `Y축`: 기분 점수를 높이(160px)에 맞춰 매핑. (5점이 가장 위, 1점이 가장 아래)
*   **시각화 요소**:
    *   **기분 가이드라인**: 보조선(Dash line)을 통해 기준점(3점)을 표시하고, 상단/하단에 대표 기분 캐릭터(Happy frog / Sad cat) 아이콘을 배치합니다.
    *   **연결선 (Polyline)**: 기록이 존재하는 일자들만 추출하여 부드러운 선으로 연결합니다.
    *   **기록 점 (Marker)**: 각 기록 일자에 해당 기분의 고유 컬러를 가진 원형 마커를 표시합니다.
*   **컴포넌트**: `renderDailyMoodFlow` (`MainScreen.view.js`)

---

## 2. 요약 화면: 페이지 1 (기분 분석)

### 🏆 1. 올해의 대표 기분 (Hero Banner)

*   **내용**: 연간 최다 빈도 기분 요약.
*   **로직**: 연간 `stats` 데이터 중 카운트 1위 추출.
*   **시각화**: 기분 컬러 배경 배너 + 캐릭터 애니메이션 + 폭죽 효과.

### 📊 2. 기분 비율 (Mood Ratio Bar)

*   **내용**: 전체적인 기분 분포(비율) 분석.
*   **로직**: `(특정 기분 횟수 / 전체 작성일 수) * 100` (%)
*   **시각화**: 수평 게이지 바(`MoodBar`). Reanimated를 이용한 탄성 있는(Spring) 차오름 애니메이션 적용.

### 📈 3. 월별 기분 흐름 (Monthly Mood Trend)

*   **내용**: 1월부터 12월까지의 기분 추이.
*   **로직**: 월별 기분별 카운트(0~N회) 추출.
*   **시각화**: SVG Polyline. 선의 굵기(2.5)와 마커(3px)를 통해 흐름 강조.

### 🎨 4. 자주 쓴 스티커 (Sticker Ranking)

*   **내용**: 가장 많이 사용한 스티커 TOP 3.
*   **로직**: `stickers` 필드의 `type`별 빈도 합산 후 내림차순 정렬 및 상단 3개 추출.
*   **시각화**: 순위별 카드 레이아웃. `StaticSticker` 컴포넌트를 이용해 실제 스티커 모양을 미리보기로 제공하며, 사용 횟수 숫자는 노출하지 않습니다.

---

## 3. 요약 화면: 페이지 2 (활동 분석)

### 🏆 1. 올해의 주된 활동 (Hero Banner)

*   **내용**: 연간 최다 빈도 활동 요약.
*   **로직**: 활동 기록 테이블에서 최다 빈도 항목 추출.
*   **시각화**: 활동 컬러 배경 배너 + 원형 아이콘 + 폭죽 효과.

### 📊 2. 활동별 기록 (Activity Breakdown)

*   **내용**: 각 활동이 기록된 횟수 분포.
*   **로직**: 활동별 총 횟수 집계 및 최대 횟수를 100% 기준으로 상대 비중 계산.
*   **시각화**: 애니메이션 바 차트(`AnimatedActivityBar`). 활동 아이콘과 숫자가 함께 표시됩니다.

### 📈 3. 월별 활동 흐름 (Monthly Activity Trend)

*   **내용**: 월별 특정 활동의 빈도 추이.
*   **로직**: 월별 활동 카운트 합계.
*   **시각화**: SVG 기반 꺾은선 그래프. 상단 레이블(월) 표시.

### 🔍 4. 활동별 행복 지수 (Mood-Activity Correlation)

*   **내용**: 어떤 활동을 했을 때 기분이 가장 좋았는지 분석.
*   **로직**:
    *   특정 활동(`A`)이 기록된 날들의 기분 점수 리스트 추출.
    *   `상관 점수 = Σ(해당 날의 기분 점수) / 활동 횟수`
    *   점수 높은 순으로 상위 5개 활동 선정.
*   **시각화**: 수평 바 차트. 5점 만점 기준의 평균 점수를 소수점 첫째 자리까지 표시.

---

## 4. [✅ 구현 완료] 프리미엄 연말 결산 피드 (Premium Archive: Bento Layout)

인스타그램 스토리나 Spotify Wrapped처럼 유저가 공유하고 싶어 하는 **'깔쌈한'** 시각적 요약을 제공합니다.

### 🍱 1. 연간 모먼트 벤토 보드 (Annual Bento Board) — ✅ 구현 완료

*   **목적**: 1년간의 파편화된 데이터를 세련된 매거진 스타일의 타일 레이아웃으로 통합 시각화.
*   **구성 요소**:
    *   **Main Tile**: 올해 가장 많이 언급한 단어 (타이포그래피 강조) + 서브 키워드 칩.
    *   **Status Tile**: 연간 총 작성일 수 및 🔥 연속 기록 배지 (Max Streak).
    *   **Activity Tile**: 최다 빈도 활동 아이콘 및 한 줄 요약 (컬러 배경).
    *   **Mood Tile**: 올해의 지배적 감정 캐릭터 (MoodCharacter 컴포넌트).
*   **시각화**: Flexbox 기반 Bento Grid 레이아웃 (Row1: Full-width 키워드, Row2: Half-half 통계+활동, Row3: Full-width 감정).
*   **컴포넌트**: `BentoBoard.js` (View) + `BentoBoard.styles.js` (Style)
*   **데이터**: `useBentoBoard` 훅 (`src/hooks/useBentoBoard.js`)

### 📝 2. 올해의 키워드 분석 (Word Frequency Analysis) — ✅ 구현 완료

*   **내용**: 일기 본문(`content`)과 자유 텍스트(`texts`)에서 가장 많이 등장한 명사 추출.
*   **로직** (`src/utils/wordAnalyzer.js`):
    *   `content` JSON 배열 및 `texts` 2차원 배열 내 모든 문자열 수집.
    *   이모지/특수문자/숫자 제거 → 공백 기준 단어 분리.
    *   한국어 불용어(조사, 접속사, 대명사, 흔한 동사 어미) 및 2글자 미만 필터링.
    *   빈도수 내림차순 정렬 후 상위 10개 추출.
*   **최적화 전략 (Performance)** — ✅ 모두 구현:
    *   **증분 동기화(Incremental Sync)**: `saveDiary()` 시 `InteractionManager`로 백그라운드에서 해당 날짜의 단어 빈도를 `word_stats` 테이블에 즉시 반영.
    *   **결과 캐싱(Caching)**: 분석 완료된 연도 데이터는 `app_settings`에 `bento_word_cache_{year}` 키로 JSON 캐싱하여 재진입 시 0.1초 이내 로드.
    *   **백그라운드 처리**: 대량 분석 시 `InteractionManager.runAfterInteractions`로 UI 스레드 보호.

### ✨ 3. 감정 에볼루션 & 결정체 (Flow & Crystal)

*   **에볼루션(Flow)**: 계절별 감정 색상의 변화를 부드러운 그라데이션 웨이브(SVG Path Animation)로 표현.
*   **결정체(Crystal)**: 기분 비율을 3D 기하학적 단면으로 형상화하여 "나의 1년은 이런 모양"이라고 정의.

---

## 🛠️ 기술 및 공통 명세 (Technical Details)

*   **그래프 엔진**: `react-native-svg` (Path, Polyline, Circle 사용)
*   **폭죽 엔진**: `@shopify/react-native-skia` (Atlas 기반 Batch Draw)
*   **애니메이션**: 
    *   **UI 스레드 가속**: `useNativeDriver: true` 및 `transform(scaleX, translateY)` 중심 설계. 레이아웃 재계산(Reflow) 없이 60fps 보장.
    *   **교체 이력**: `width`(JS 스레드) 기반 애니메이션은 성능 문제로 폐기됨.
*   **반응형**: `Dimensions`를 사용해 화면 너비에 맞게 그래프 너비(`chartW`) 자동 조정.
*   **Skia SVG 호환성 수칙 (v2) - [필수 준수]**:
    *   **Path 분산**: `M...M...` 형태의 복합 서브패스는 Skia 파서에서 누락될 위험이 크므로 개별 `<line>`이나 단일 `<path>`로 물리적으로 분리할 것.
    *   **Arc 제거**: `A` (Elliptical Arc) 명령은 기기별 파싱 변동성이 크므로 `C` (Cubic Bezier) 명령으로 변환하여 기술할 것.
    *   **투명도 표준**: `fill="none"` 대신 `fill="transparent"`를 사용하여 렌더링 누락 방지.
    *   **검증**: 새로운 활동 아이콘 추가 시 `SkiaConfettiEffect`에서 정상 파싱되는지 로그(`console.warn`) 필히 확인.
*   **색상 체계**: `constants/mood.js` 및 `constants/activities.js`에 정의된 파스텔 고유 컬러를 엄격히 준수.
