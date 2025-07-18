# Flux - AI-Powered Knowledge Hub

Flux는 흩어져 있는 당신의 지식과 아이디어를 한 곳에 모아, AI와 함께 탐색하고, 다듬고, 새로운 인사이트를 발견할 수 있도록 돕는 차세대 지식 관리 도구입니다.

---

## 주요 컨셉

- **수집 (Collect)**: 웹 서핑 중 발견한 텍스트, 이미지, 링크 등 모든 정보를 마찰 없이 수집합니다.
- **정리 (Organize)**: 유연한 드래그 앤 드롭 인터페이스와 AI 기반 자동 분류를 통해 지식을 손쉽게 구조화합니다.
- **탐색 (Explore)**: 강력한 검색 기능과 시각적인 그래프 뷰를 통해 아이디어 간의 연결고리를 발견합니다.
- **창조 (Create)**: 수집된 정보를 바탕으로 AI 어시스턴트와 함께 새로운 콘텐츠를 생성하고 발전시킵니다.

---

## 핵심 기능 개발 계획

### 1. 메인 윈도우 요소 재배열

콘텐츠 카드의 정보 가독성을 높이기 위해 아래와 같은 순서로 레이아웃을 재배열합니다.

- **기본 레이아웃 (Grid/Masonry View)**:
  1.  **제목**
  2.  **내용 (콘텐츠)**: 텍스트, 이미지, 비디오 등
  3.  **AI 요약**: (데이터가 있을 경우)
  4.  **하단 정보**:
      - 좌측: **키워드(태그)**
      - 우측: **파비콘(Favicon) 및 생성일**

- **리스트 레이아웃 (List View)**:
  - `[콘텐츠 썸네일]` `[제목, 내용/요약]` `[파비콘, 생성일]` 형태로 한 줄에 표시하여 밀도를 높입니다.

_**진행 상태: 완료**_ (`src/components/content/content-item-card.tsx`)

---

### 2. AI 요약 및 키워딩 (RAG 기반)

수집된 콘텐츠의 맥락을 풍부하게 만들기 위해 AI 기반 자동화 기능을 도입합니다.

- **구현 목표**:
  - 사용자가 콘텐츠를 수집하면, 백그라운드에서 RAG(Retrieval-Augmented Generation) 파이프라인이 동작합니다.
  - 지정된 Agent가 콘텐츠의 핵심 내용을 **자동으로 요약**하고, 핵심 **키워드(태그)를 추출**하여 메타데이터에 추가합니다.
- **데이터 구조**:
  - `ContentItem` 타입에 `summary: string` 필드와 `tags: string[]` 필드를 활용합니다.
  - RAG 처리 상태를 관리하기 위한 필드를 추가할 수 있습니다. (예: `ai_status: 'pending' | 'completed' | 'failed'`)
- **사용자 경험**:
  - AI가 처리한 요약과 키워드는 콘텐츠 카드에 즉시 표시되어 사용자가 내용을 빠르게 파악할 수 있도록 돕습니다.

_**진행 상태: 계획 수립 완료. `summary` 필드 타입 추가 완료.**_

---

### 3. Chrome 확장 프로그램

자세한 계획은 `docs/extension-plan.md` 문서를 참고하세요. 