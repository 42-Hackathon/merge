import { ContentItem } from '../types/content';

export const mockContentItems: ContentItem[] = [
    {
        id: '1',
        title: '디자인 시스템 가이드라인',
        content:
            '일관된 사용자 경험을 위한 디자인 시스템 구축 방법론과 컴포넌트 라이브러리 설계 원칙에 대한 상세한 가이드입니다. 색상 팔레트, 타이포그래피, 간격 시스템, 그리고 재사용 가능한 컴포넌트들의 설계 철학을 다룹니다.',
        type: 'text',
        stage: 'consolidate',
        tags: ['design', 'system', 'ui', 'guidelines'],
        folderId: 'text',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        metadata: {
            author: '김디자이너',
        },
    },
    {
        id: '2',
        title: 'React 성능 최적화 기법',
        content:
            'React 애플리케이션의 렌더링 성능을 향상시키는 다양한 최적화 기법들을 소개합니다. useMemo, useCallback, React.memo 등의 훅과 고차 컴포넌트를 활용한 최적화 전략을 다룹니다.',
        type: 'text',
        stage: 'refine',
        tags: ['react', 'performance', 'optimization', 'hooks'],
        folderId: 'text',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T14:20:00Z',
        metadata: {
            author: '박개발자',
        },
    },
    {
        id: '3',
        title: 'AI 기반 사용자 인터페이스 트렌드',
        content:
            '2024년 AI 기술이 사용자 인터페이스 디자인에 미치는 영향과 새로운 패러다임을 분석합니다. 개인화된 UI, 예측적 인터페이스, 그리고 자연어 처리를 활용한 상호작용 방식들을 살펴봅니다.',
        type: 'text',
        stage: 'review',
        tags: ['ai', 'ui', 'trends', '2024'],
        folderId: 'text',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:15:00Z',
        metadata: {
            author: '이연구원',
        },
    },
    {
        id: '4',
        title: 'Figma 디자인 시스템 템플릿',
        content:
            'Figma에서 사용할 수 있는 포괄적인 디자인 시스템 템플릿입니다. 컴포넌트, 스타일, 그리고 프로토타이핑을 위한 완전한 세트를 제공합니다.',
        type: 'image',
        stage: 'consolidate',
        tags: ['figma', 'template', 'design-system'],
        folderId: 'images',
        createdAt: '2024-01-12T16:45:00Z',
        updatedAt: '2024-01-12T16:45:00Z',
        metadata: {
            dimensions: { width: 1920, height: 1080 },
            fileSize: 2048000,
        },
    },
    {
        id: '5',
        title: 'TypeScript 고급 패턴 가이드',
        content:
            'TypeScript의 고급 타입 시스템을 활용한 패턴들을 소개합니다. 제네릭, 조건부 타입, 매핑된 타입 등을 활용하여 더 안전하고 표현력 있는 코드를 작성하는 방법을 다룹니다.',
        type: 'link',
        stage: 'refine',
        tags: ['typescript', 'patterns', 'advanced'],
        folderId: 'links',
        createdAt: '2024-01-11T11:30:00Z',
        updatedAt: '2024-01-11T11:30:00Z',
        metadata: {
            url: 'https://example.com/typescript-patterns',
        },
    },
    {
        id: '6',
        title: '모바일 앱 UX 디자인 원칙',
        content:
            '모바일 환경에서의 사용자 경험 디자인 원칙과 베스트 프랙티스를 정리한 문서입니다. 터치 인터페이스, 제스처, 그리고 반응형 디자인의 핵심 요소들을 다룹니다.',
        type: 'text',
        stage: 'review',
        tags: ['mobile', 'ux', 'design', 'principles'],
        folderId: 'text',
        createdAt: '2024-01-10T13:20:00Z',
        updatedAt: '2024-01-10T13:20:00Z',
        metadata: {
            author: '최UX디자이너',
        },
    },
    {
        id: '7',
        title: 'CSS Grid 레이아웃 마스터클래스',
        content:
            'CSS Grid를 활용한 현대적인 웹 레이아웃 기법을 마스터하기 위한 종합 가이드입니다. 기본 개념부터 고급 기법까지 실제 예제와 함께 설명합니다.',
        type: 'video',
        stage: 'consolidate',
        tags: ['css', 'grid', 'layout', 'web'],
        folderId: 'videos',
        createdAt: '2024-01-09T15:10:00Z',
        updatedAt: '2024-01-09T15:10:00Z',
        metadata: {
            duration: 3600,
            resolution: '1080p',
        },
    },
    {
        id: '8',
        title: '접근성을 고려한 웹 디자인',
        content:
            '모든 사용자가 접근할 수 있는 웹사이트를 만들기 위한 접근성 가이드라인과 실무 적용 방법을 다룹니다. WCAG 2.1 기준과 실제 구현 사례를 포함합니다.',
        type: 'text',
        stage: 'refine',
        tags: ['accessibility', 'web', 'inclusive-design'],
        folderId: 'text',
        createdAt: '2024-01-08T10:45:00Z',
        updatedAt: '2024-01-08T10:45:00Z',
        metadata: {
            author: '정접근성전문가',
        },
    },
    {
        id: '9',
        title: 'Node.js 마이크로서비스 아키텍처',
        content:
            'Node.js를 활용한 마이크로서비스 아키텍처 설계와 구현 방법을 다룹니다. 서비스 분리, API 게이트웨이, 데이터 일관성 등의 핵심 개념을 실제 예제와 함께 설명합니다.',
        type: 'link',
        stage: 'review',
        tags: ['nodejs', 'microservices', 'architecture'],
        folderId: 'links',
        createdAt: '2024-01-07T14:30:00Z',
        updatedAt: '2024-01-07T14:30:00Z',
        metadata: {
            url: 'https://example.com/nodejs-microservices',
        },
    },
    {
        id: '10',
        title: '브랜드 아이덴티티 디자인 프로세스',
        content:
            '효과적인 브랜드 아이덴티티를 구축하기 위한 체계적인 디자인 프로세스를 소개합니다. 브랜드 전략 수립부터 비주얼 시스템 개발까지의 전 과정을 다룹니다.',
        type: 'image',
        stage: 'consolidate',
        tags: ['branding', 'identity', 'design-process'],
        folderId: 'images',
        createdAt: '2024-01-06T12:15:00Z',
        updatedAt: '2024-01-06T12:15:00Z',
        metadata: {
            dimensions: { width: 1600, height: 900 },
            fileSize: 1536000,
        },
    },
    {
        id: '11',
        title: '프로젝트 회의 노트',
        content:
            '2024년 1월 신규 프로젝트 킥오프 미팅 내용 정리. 주요 목표, 일정, 역할 분담에 대한 상세한 내용을 포함합니다.',
        type: 'text',
        stage: 'review',
        tags: ['meeting', 'project', 'notes'],
        folderId: 'memo',
        createdAt: '2024-01-05T16:30:00Z',
        updatedAt: '2024-01-05T16:30:00Z',
        metadata: {
            author: '김프로젝트매니저',
        },
    },
    {
        id: '12',
        title: '개발 아이디어 메모',
        content:
            '새로운 기능 개발에 대한 아이디어들을 정리한 메모입니다. 사용자 경험 개선 방안과 기술적 구현 방법을 포함합니다.',
        type: 'text',
        stage: 'consolidate',
        tags: ['development', 'ideas', 'features'],
        folderId: 'memo',
        createdAt: '2024-01-04T09:20:00Z',
        updatedAt: '2024-01-04T09:20:00Z',
        metadata: {
            author: '이개발자',
        },
    },
    {
        id: '13',
        title: '클립보드 스크랩',
        content:
            '유용한 코드 스니펫과 링크들을 모아둔 클립보드 스크랩입니다. 자주 사용하는 함수들과 참고 자료들이 포함되어 있습니다.',
        type: 'text',
        stage: 'refine',
        tags: ['snippets', 'code', 'reference'],
        folderId: 'clipboard',
        createdAt: '2024-01-03T14:45:00Z',
        updatedAt: '2024-01-03T14:45:00Z',
        metadata: {
            author: '박개발자',
        },
    },
    {
        id: '14',
        title: 'UI 컴포넌트 스크린샷',
        content: '새로운 UI 컴포넌트 디자인의 스크린샷입니다. 다양한 상태와 변형들을 캡처했습니다.',
        type: 'image',
        stage: 'review',
        tags: ['ui', 'components', 'design'],
        folderId: 'screenshots',
        createdAt: '2024-01-02T11:30:00Z',
        updatedAt: '2024-01-02T11:30:00Z',
        metadata: {
            dimensions: { width: 1920, height: 1080 },
            fileSize: 2048000,
        },
    },
];
