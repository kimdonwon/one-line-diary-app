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

## 2. 데이터 구조 (SQLite)

### 2.1 테이블 명세
| 테이블명 | 주요 컬럼 | 설명 |
|:--- |:--- |:--- |
| **diary** | `id`, `date`, `content`, `mood`, `stickers`, `photos`, `texts` | 일기 본문 및 모든 드래거블 요소(JSON 파싱) 저장 |
| **activities** | `id`, `date`, `activity`, `title`, `note` | 사용자 일일 활동 기록 |
| **word_stats** | `id`, `date`, `word`, `count` | 키워드 분석 데이타 (증분 동기화 방식) |
| **app_settings** | `key`, `value` | 잠금 설정, 프리미엄 상태, 벤토 키워드 캐시 등 |

### 2.2 DB 안정성 가드 (Mutex Queue)
- **병목 해결**: `expo-sqlite`의 Race Condition 차단을 위해 `dbQueue` Promise 체인 수립.
- **순차 처리**: 모든 쿼리는 단일 큐를 통해 순차적으로 실행되어 NPE(NullPointerException)를 원천 봉쇄함.

---

## 3. 핵심 엔진: 드래그 & 인터랙션 (v3.0)

### 3.1 통합 드래그 훅 (`useDraggable`)
모든 드래거블 요소(Text, Photo, Sticker)는 단일 엔진을 공유합니다.

- **조작 UI 통합 (`renderControls`)**:
  - 드래그 막대, 회전/크기 핸들, 수정 버튼을 훅 내부에서 원스톱으로 제공.
  - **우선순위**: 드래그 막대(`zIndex: 1000`) > 기타 핸들(`zIndex: 999`).
- **독립 배율 시스템**:
  - `scaleMultiplier`: 부모 요소(종이)의 기본 크기 보정.
  - `controlScale`: 조작 버튼들만의 독립적인 크기 배율.
  - `offsetMultiplier`: 조작 버튼의 테두리 이격 거리 제어.
  - **스케일 한도 (Type-specific Scale Limits)**:
    - **스티커**: 최소 0.7배, 최대 5.0배 (자유로운 꾸미기 허용)
    - **사진**: 최소 0.7배, 최대 1.5배 (해상도 유지 및 레이아웃 보호)
    - **텍스트**: 최소 0.5배, 최대 2.0배 (가독성 및 레이아웃 이탈 방지)
    - *참고: 개별 지정이 없을 경우 RotationHandle의 기본값(0.3~5.0)이 최종 적용됨.*
- **제스처 제어**: 
  - 400ms 롱프레스 후 드래그 활성화.
  - 선택 상태이거나 미세한 움직임(`0.1px`) 감지 시 캡처 단계에서 즉시 제스처를 선점하여 부모(FlatList)의 페이징 스크롤을 원천 차단.

---

## 4. UI/UX 시스템 섹션

### 4.1 하단 탭바 & 툴 패널
- **Bottom Bar (Dual Mode)**:
  - `nav`: 메인 탭 네비게이션용.
  - `action`: 작성 화면 전용 (중앙 완료 버튼 + 기분 색상 동기화).
- **Tool Panel (Floating Glass Island)**:
  - 반투명 블러 효과 가로 스와이프 도크.
  - 키보드 간섭 방지를 위해 루트 레이어에 배치.

### 4.2 멀티페이지 캔버스
- **구조**: `pages` 기반 2차원 데이터 상태 (`stickers[page][index]` 방식).
- **트리거**: 엣지 스와이프 시 `__ADD_PAGE__` 더미 요소를 통한 자동 페이지 생성.
- **동기화**: 현재 캔버스 배경색과 상단 인디케이터/탭바 배경색 실시간 컬러 매칭.

---

## 5. 분석 및 시스템 유틸리티

### 5.1 키워드 분석 & 벤토 보드
- **분석 로직**: 불용어 제거 후 빈도수 추출. `saveDiary` 시점에 백그라운드 증분 업데이트.
- **벤토 보드**: 연간 데이터를 타입 중심의 타일 레이아웃으로 시각화 (Main/Status/Activity/Mood Tile).

### 5.2 백업 및 보안
- **백업**: AES-256 암호화 + 사진 데이터를 포함한 ZIP 패키징 (`JSZip`).
- **보안**: 락스크린 핀코드 인증 및 생체 인식 확장성 확보.

---
*Last Updated: 2026-03-14*
