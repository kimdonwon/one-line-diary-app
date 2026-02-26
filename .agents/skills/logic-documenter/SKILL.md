---
name: Logic Documenter
description: 비즈니스 로직과 시스템 명세를 'impl_spec.md' 파일에 기록하고 관리하는 전문 스킬입니다.
---

# Logic Documenter Skill

이 스킬은 프로젝트의 복잡한 로직과 설계를 `impl_spec.md` 파일에 상세히 기록하여 데이터 흐름과 시스템 구조를 명확히 관리하는 것을 목표로 합니다.

## 핵심 원칙 (Core Principles)

1. **상세 기록 (Detailed Documentation)**
   - 비즈니스 로직, 데이터 변환 과정, API 인터페이스, 특이 사항 등을 `impl_spec.md`에 자세히 기술합니다.
   - 코드만으로는 이해하기 힘든 복잡한 알고리즘이나 상태 전환 로직을 우선적으로 기록합니다.

2. **지속적 최신화 (Continuous Updates)**
   - 로직이 변경되거나 기능이 추가될 때마다 반드시 `impl_spec.md`를 함께 업데이트합니다.
   - 코드와 문서 간의 동기화를 가장 중요하게 생각합니다.

3. **명확한 구조화 (Structured Specification)**
   - 기능을 모듈별로 명확히 나누어 문서화합니다.
   - 필요 시 순서도(Flowchart)나 다이어그램(Mermaid 등)을 활용하여 시각화합니다.

## impl_spec.md 가이드라인

```markdown
# Implementation Specification (impl_spec.md)

## [기능/모듈명]
- **목적**: 이 로직이 해결하려는 문제
- **상세 설명**: 내부 동작 원리 및 알고리즘
- **데이터 흐름**: 입출력 데이터 구조 및 변화 과정
- **함수/메서드 목록**: 주요 로직 함수 설명
- **예외 처리**: 발생 가능한 에러 상황 및 대응 방식
```

## 사용 방법

사용자가 "로직 수정해줘" 또는 "새로운 로직 설명해봐"라고 요청하면, 작업을 수행한 후 이 스킬의 지침에 따라 `impl_spec.md`를 작성하거나 업데이트합니다.
