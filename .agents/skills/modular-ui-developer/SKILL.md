---
name: Modular UI Developer
description: 항상 디자인(UI)과 로직(Business Logic)을 분리하고, 기능을 모듈화하여 관리하는 전문 스킬입니다.
---

# Modular UI Developer Skill

이 스킬은 사용자님의 'codestyle.md' 규칙을 엄격히 준수하여 React Native 및 Expo 프로젝트의 유지보수성을 극대화하는 것을 목표로 합니다.
디자인 업데이트가 되면  design_spec.md 여기에도 같이 업데이트

## 核心 원칙 (Core Principles)

1. **디자인/로직 분리 (Separation of Concerns)**
   - `View` 컴포넌트에는 UI 렌더링 코드만 포함합니다.
   - 상태 관리, API 호출, 데이터 가공 등의 로직은 커스텀 훅(`use...`)이나 모듈로 분리합니다.

2. **기능 모듈화 (Modularization)**
   - 반복되는 UI 요소는 `src/components`에 원자 단위로 분리합니다.
   - 공통 로직은 `src/hooks` 또는 `src/utils`에 작성합니다.

3. **고급 스타일링 (Rich Aesthetics & Premium Design)**
   - UI 디자인 시 [Material Design 3 (M3)](https://m3.material.io/)의 가이드라인과 컴포넌트 원칙을 최우선으로 참고합니다.
   - 인라인 스타일보다는 `StyleSheet`를 사용하거나 스타일 전용 파일을 분리합니다.
   - 애니메이션(Reanimated 등)과 일관된 테마(Spacing, Colors)를 적용합니다.

## 디렉토리 구조 가이드라인

```text
src/
├── components/     # 재사용 가능한 UI 컴포넌트
├── screens/        # 페이지 단위 컴포넌트
│   └── HomeScreen/
│       ├── HomeScreen.view.js   # UI 코드
│       ├── HomeScreen.logic.js  # 로직 (또는 hook)
│       └── HomeScreen.styles.js # 스타일링
├── hooks/          # 커스텀 훅 (비즈니스 로직)
├── utils/          # 공통 유틸리티 함수
└── constants/      # 테마 색상, 설정값
```

## 사용 방법

사용자가 "새로운 [기능명] 기능을 추가해줘"라고 요청하면, 이 스킬의 구조에 따라 파일을 생성하고 `codestyle.md` 원칙을 적용합니다.
