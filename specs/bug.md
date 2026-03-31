# 요약 화면 및 앱 전체 렉(버벅임) 발생 원인 분석

## 🚨 문제 현상
1. **요약 화면 진입 시 심한 프리징(Freeze) 및 버벅임**: 화면 전환 애니메이션이 끊기거나, 첫 화면이 뜨기 전까지 앱이 멈춘 듯한 현상 발생.
2. **파티클 효과 제거 후에도 여전히 렉 발생**: 단순히 애니메이션 루프 문제만이 아님을 시사.
3. **요약 화면 진입 후 전반적인 성능 저하**: JS 스레드 부하가 잔존하여 다른 조작(스크롤 등)에도 영향.

## 🔍 원인 분석 (Deep Dive)

### 1. [핵심 원인] SkiaConfettiEffect의 JS 스레드 동기적 점유
`src/components/SkiaConfettiEffect.js`에서 2가지 심각한 성능 병목이 발견되었습니다.

- **문제 A (화면 전환 시 프리징)**: 마운트될 때마다 `isActivityMode` 여부에 따라 수많은 고해상도 SVG 아이콘들을 `Skia.SVG.MakeFromString(xml)`로 **동기적 반복 파싱**하고 있었습니다. 요약 화면에 2개가 동시에 올라가며 네비게이션 트랜지션(화면 밀기 등) 중 JS 스레드를 마비시켰습니다.
- **문제 B (요약 화면 진입 후 상시 버벅임)**: `useFrameCallback`이 항상 실행되며 파티클이 없어도 매 프레임(~60fps) Reanimated Worklet을 점유하여 빈 버퍼를 계속 계산했습니다.

- **수정 (2026-03-31) - 완벽 해결**:
  - `parsedMoodCache` 등 글로벌 캐시를 도입하고, `InteractionManager.runAfterInteractions` 이후에 비동기 지연 파싱(Lazy Parsing)하도록 개선했습니다.
  - Worklet 내부에 `isPaused` SharedValue를 두어 평소에는 `return`시키고, burst 시에만 시간(`delta`)이 흐르며 계산되도록 Time Slip 없는 Safe Pause 패턴을 적용했습니다.
  - Canvas 자체를 언마운트시키지 않고 유지하여, burst 터치 시 텍스처가 늦게 뜨는 버그(이모지 미출력 등)를 완벽히 차단했습니다.

### 2. [보조 원인] BentoBoard의 동기적 대량 텍스트 분석 (최초 1회만)
`src/hooks/useBentoBoard.js`에서 `word_stats`가 비었을 때 전체 일기를 분석합니다.

- **최초 진입 시 렉에 영향**: 최초 1회만 발생.
- **현재 완화 조치 적용됨**: 5개마다 30ms `setTimeout` 양보 (L107-L110)

### 3. [보조 원인] 과도한 훅 실행 및 상태 업데이트
- 요약 화면 진입 시 `SummaryScreen.logic.js`에서 6개의 DB 쿼리를 `Promise.all`로 처리하지만, 결과값이 업데이트되며 하위 `useMemo` 연산이 모두 쏠림 현상.
- **현재 완화 조치 적용됨**: `InteractionManager.runAfterInteractions` (L62)

## 🛠 남은 개선 가능 항목 (미적용)
1. **고해상도 SVG 메모이제이션 강화**
   - `MoodCharacter` 등 불필요하게 반복해서 그려지는 복잡한 SVG 노드들을 더 공격적으로 `React.memo` 처리.
