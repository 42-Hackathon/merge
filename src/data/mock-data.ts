import { ContentItem } from '../types/content';

export const mockContentItems: ContentItem[] = [
    // 🎨 Figma 디자인 도구
    {
        id: '1',
        title: 'Figma - 협업 디자인 플랫폼',
        content: '팀과 함께 디자인하고 프로토타입을 만드는 최고의 도구. 실시간 협업과 강력한 컴포넌트 시스템으로 디자인 워크플로우를 혁신합니다.',
        type: 'link',
        stage: 'consolidate',
        tags: ['figma', 'design-tool', 'collaboration', 'prototyping'],
        folderId: 'links',
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2024-01-20T09:00:00Z',
        metadata: {
            url: 'https://www.figma.com',
            domain: 'figma.com',
            favicon: 'https://www.figma.com/favicon.ico'
        },
    },
    
    // 🖼️ 현대적 대시보드 디자인
    {
        id: '2',
        title: 'Modern Dashboard UI Design',
        content: '깔끔하고 현대적인 대시보드 인터페이스 디자인. 데이터 시각화와 사용자 친화적인 레이아웃을 완벽하게 조합한 작품입니다.',
        type: 'image',
        stage: 'consolidate',
        tags: ['dashboard', 'ui-design', 'modern', 'data-visualization'],
        folderId: 'images',
        createdAt: '2024-01-20T16:30:00Z',
        updatedAt: '2024-01-20T16:30:00Z',
        metadata: {
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
            dimensions: { width: 2340, height: 1560 },
            fileSize: 890000,
        },
    },

    // 🎥 디자인 시스템 아키텍처 강의
    {
        id: '3',
        title: 'Design System Architecture Deep Dive',
        content: '확장 가능한 디자인 시스템을 구축하는 고급 아키텍처 방법론을 다루는 심화 강의입니다. 토큰 체계, 컴포넌트 라이브러리, 그리고 팀 간 협업 워크플로우를 포괄적으로 설명합니다.',
        type: 'video',
        stage: 'consolidate',
        tags: ['design-system', 'architecture', 'tokens', 'workflow'],
        folderId: 'videos',
        createdAt: '2024-01-20T19:45:00Z',
        updatedAt: '2024-01-20T19:45:00Z',
        metadata: {
            url: 'https://www.youtube.com/watch?v=IrGYUq1mklk&t=907s',
            duration: 2340,
            resolution: '1080p',
            platform: 'YouTube'
        },
    },

    // 📝 2024 디자인 트렌드 분석
    {
        id: '4',
        title: '2024 UI/UX 디자인 트렌드 분석',
        content: '올해 주목해야 할 디자인 트렌드들을 심층 분석합니다. 뉴모피즘의 진화, AI 기반 개인화 인터페이스, 접근성 우선 디자인, 그리고 지속가능한 디지털 경험 디자인까지 최신 동향을 포괄적으로 다룹니다.',
        type: 'text',
        stage: 'consolidate',
        tags: ['ui-trends', '2024', 'analysis', 'neomorphism', 'ai-design'],
        folderId: 'text',
        createdAt: '2024-01-21T09:00:00Z',
        updatedAt: '2024-01-21T09:00:00Z',
        metadata: {
            author: '김UX전문가',
            wordCount: 2800,
        },
    },

    // 🎥 실제 Figma 튜토리얼 동영상
    {
        id: '5',
        title: 'Figma Tutorial: Design Systems',
        content: 'Figma를 사용해서 완전한 디자인 시스템을 구축하는 방법을 단계별로 설명하는 실무 튜토리얼입니다. 컴포넌트 설계부터 토큰 관리까지 모든 과정을 다룹니다.',
        type: 'video',
        stage: 'consolidate',
        tags: ['figma', 'design-system', 'tutorial', 'components'],
        folderId: 'videos',
        createdAt: '2024-01-20T20:15:00Z',
        updatedAt: '2024-01-20T20:15:00Z',
        metadata: {
            url: 'https://www.youtube.com/watch?v=EK-pHkc5EL4',
            duration: 1680,
            resolution: '1080p',
            platform: 'YouTube'
        },
    },

    // 🔗 Dribbble 영감 플랫폼
    {
        id: '6',
        title: 'Dribbble - 디자인 영감 플랫폼',
        content: '전 세계 최고의 디자이너들의 작품을 발견하고 영감을 받을 수 있는 디자인 커뮤니티. UI/UX, 브랜딩, 일러스트레이션 등 다양한 분야의 작품들을 만나보세요.',
        type: 'link',
        stage: 'review',
        tags: ['dribbble', 'inspiration', 'portfolio', 'community'],
        folderId: 'links',
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
        metadata: {
            url: 'https://dribbble.com',
            domain: 'dribbble.com',
            favicon: 'https://dribbble.com/favicon.ico'
        },
    },

    // 📋 클라이언트 피드백 메모
    {
        id: '7',
        title: '클라이언트 피드백 정리 - 모바일 앱 리디자인',
        content: '모바일 앱 리디자인 프로젝트에 대한 클라이언트 피드백을 종합 정리했습니다. 주요 수정 요청사항: 1) 메인 내비게이션 구조 단순화 2) 컬러 팔레트를 브랜드 가이드라인에 맞게 조정 3) 버튼 크기 키우기.',
        type: 'text',
        stage: 'review',
        tags: ['client-feedback', 'mobile-app', 'redesign', 'navigation'],
        folderId: 'memo',
        createdAt: '2024-01-21T17:30:00Z',
        updatedAt: '2024-01-21T17:30:00Z',
        metadata: {
            author: '정프로젝트매니저',
            priority: 'high',
        },
    },

    // 🖼️ 모바일 앱 인터페이스
    {
        id: '8',
        title: 'Mobile App Interface Showcase',
        content: '모바일 앱을 위한 세련된 인터페이스 디자인 컬렉션. 터치 친화적인 요소들과 직관적인 내비게이션을 보여주는 케이스 스터디입니다.',
        type: 'image',
        stage: 'review',
        tags: ['mobile-ui', 'app-design', 'interface', 'touch'],
        folderId: 'images',
        createdAt: '2024-01-20T17:15:00Z',
        updatedAt: '2024-01-20T17:15:00Z',
        metadata: {
            url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
            dimensions: { width: 2340, height: 1560 },
            fileSize: 750000,
        },
    },

    // 🎥 UX 리서치 방법론 강의
    {
        id: '9',
        title: 'Advanced UX Research Methods',
        content: '사용자 경험 연구를 위한 심화 방법론을 다루는 전문가 강의입니다. 정성적, 정량적 연구 방법의 조합과 데이터 기반 인사이트 도출 과정을 실무 사례와 함께 설명합니다.',
        type: 'video',
        stage: 'refine',
        tags: ['ux-research', 'methodology', 'data-analysis', 'insights'],
        folderId: 'videos',
        createdAt: '2024-01-20T21:30:00Z',
        updatedAt: '2024-01-20T21:30:00Z',
        metadata: {
            url: 'https://youtu.be/FASMejN_5gs?si=xoBluFVMN62QCw5Z',
            duration: 2580,
            resolution: '1080p',
            platform: 'YouTube'
        },
    },

    // 🔗 Material Design 3
    {
        id: '10',
        title: 'Material Design 3',
        content: 'Google의 최신 디자인 시스템. Dynamic Color, Material You, 그리고 적응형 디자인 원칙을 통해 개인화된 사용자 경험을 만드는 방법을 제시합니다.',
        type: 'link',
        stage: 'consolidate',
        tags: ['material-design', 'design-system', 'google', 'guidelines'],
        folderId: 'links',
        createdAt: '2024-01-20T11:15:00Z',
        updatedAt: '2024-01-20T11:15:00Z',
        metadata: {
            url: 'https://m3.material.io',
            domain: 'm3.material.io',
            favicon: 'https://m3.material.io/favicon.ico'
        },
    },

    // 🎥 실제 UX 디자인 동영상
    {
        id: '11',
        title: 'UX Design Process - Case Study',
        content: '실제 UX 디자인 프로젝트의 전 과정을 담은 케이스 스터디 영상입니다. 사용자 리서치부터 최종 프로토타입까지 디자인 씽킹 프로세스를 상세히 보여줍니다.',
        type: 'video',
        stage: 'review',
        tags: ['ux-design', 'case-study', 'design-process', 'user-research'],
        folderId: 'videos',
        createdAt: '2024-01-20T21:00:00Z',
        updatedAt: '2024-01-20T21:00:00Z',
        metadata: {
            url: 'https://www.youtube.com/watch?v=ebPLYcAx__s',
            duration: 2250,
            resolution: '1080p',
            platform: 'YouTube'
        },
    },

    // 📝 접근성 체크리스트
    {
        id: '12',
        title: '접근성 우선 디자인 체크리스트',
        content: 'WCAG 2.1 AA 기준을 충족하는 접근성 디자인을 위한 실무 체크리스트입니다. 색상 대비, 키보드 내비게이션, 스크린 리더 호환성, 포커스 관리 등 핵심 요소들을 항목별로 정리했습니다.',
        type: 'text',
        stage: 'refine',
        tags: ['accessibility', 'wcag', 'checklist', 'inclusive-design'],
        folderId: 'text',
        createdAt: '2024-01-21T10:30:00Z',
        updatedAt: '2024-01-21T10:30:00Z',
        metadata: {
            author: '박접근성디자이너',
            wordCount: 1950,
        },
    },

    // 🖼️ 타이포그래피 스터디
    {
        id: '13',
        title: 'Typography & Layout Study',
        content: '타이포그래피와 레이아웃의 조화를 보여주는 디자인 스터디. 가독성과 미적 균형을 고려한 텍스트 배치의 예술을 탐구합니다.',
        type: 'image',
        stage: 'refine',
        tags: ['typography', 'layout', 'composition', 'hierarchy'],
        folderId: 'images',
        createdAt: '2024-01-20T18:00:00Z',
        updatedAt: '2024-01-20T18:00:00Z',
        metadata: {
            url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
            dimensions: { width: 2340, height: 1560 },
            fileSize: 680000,
        },
    },

    // 🔗 Coolors 팔레트 생성기
    {
        id: '14',
        title: 'Coolors - 컬러 팔레트 생성기',
        content: '아름다운 컬러 조합을 쉽게 만들고 탐색할 수 있는 도구. 무한한 컬러 팔레트 생성, 접근성 검사, 그리고 다양한 포맷으로 내보내기 기능을 제공합니다.',
        type: 'link',
        stage: 'refine',
        tags: ['colors', 'palette', 'generator', 'accessibility'],
        folderId: 'links',
        createdAt: '2024-01-20T14:20:00Z',
        updatedAt: '2024-01-20T14:20:00Z',
        metadata: {
            url: 'https://coolors.co',
            domain: 'coolors.co',
            favicon: 'https://coolors.co/favicon.ico'
        },
    },

    // 📎 CSS 스니펫 모음
    {
        id: '15',
        title: '자주 사용하는 CSS 스니펫 모음',
        content: `/* 글래스모피즘 카드 */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 부드러운 그라데이션 */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}`,
        type: 'text',
        stage: 'refine',
        tags: ['css', 'snippets', 'glassmorphism', 'animations'],
        folderId: 'clipboard',
        createdAt: '2024-01-21T19:20:00Z',
        updatedAt: '2024-01-21T19:20:00Z',
        metadata: {
            author: '이프론트엔드개발자',
            language: 'css',
        },
    },

    // 🎥 실제 Figma 프로토타이핑 동영상
    {
        id: '16',
        title: 'Advanced Figma Prototyping',
        content: 'Figma의 고급 프로토타이핑 기능을 마스터하는 완전 가이드입니다. 스마트 애니메이션, 인터랙티브 컴포넌트, 복잡한 사용자 플로우를 구현하는 방법을 실무 중심으로 설명합니다.',
        type: 'video',
        stage: 'refine',
        tags: ['figma', 'prototyping', 'animation', 'interaction'],
        folderId: 'videos',
        createdAt: '2024-01-20T22:30:00Z',
        updatedAt: '2024-01-20T22:30:00Z',
        metadata: {
            url: 'https://youtu.be/o3r1CBEFYX4?si=fnFHfeLAVU2ygbDH',
            duration: 1890,
            resolution: '1080p',
            platform: 'YouTube'
        },
    },

    // 🖼️ 컬러 이론 실습
    {
        id: '17',
        title: 'Color Theory in Practice',
        content: '컬러 이론을 실제 디자인에 적용한 사례. 색상의 심리적 효과와 브랜드 정체성을 강화하는 컬러 전략을 시각적으로 설명합니다.',
        type: 'image',
        stage: 'consolidate',
        tags: ['color-theory', 'branding', 'psychology', 'visual'],
        folderId: 'images',
        createdAt: '2024-01-20T19:30:00Z',
        updatedAt: '2024-01-20T19:30:00Z',
        metadata: {
            url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
            dimensions: { width: 2340, height: 1560 },
            fileSize: 920000,
        },
    },

    // 📝 디자인 핸드오프 가이드
    {
        id: '18',
        title: '디자인 핸드오프 베스트 프랙티스',
        content: '디자이너와 개발자 간의 원활한 협업을 위한 핸드오프 가이드입니다. Figma Dev Mode 활용법, 디자인 토큰 전달 방식, 반응형 디자인 명세서 작성법을 다룹니다.',
        type: 'text',
        stage: 'review',
        tags: ['handoff', 'collaboration', 'dev-mode', 'communication'],
        folderId: 'text',
        createdAt: '2024-01-21T14:15:00Z',
        updatedAt: '2024-01-21T14:15:00Z',
        metadata: {
            author: '이협업전문가',
            wordCount: 2200,
        },
    },

    // 🔗 Framer 프로토타이핑
    {
        id: '19',
        title: 'Framer - 인터랙티브 프로토타이핑',
        content: '코드 없이도 복잡한 인터랙션과 애니메이션을 만들 수 있는 프로토타이핑 도구. 실제와 같은 사용자 경험을 디자인하고 테스트할 수 있습니다.',
        type: 'link',
        stage: 'consolidate',
        tags: ['framer', 'prototyping', 'animation', 'interaction'],
        folderId: 'links',
        createdAt: '2024-01-20T15:45:00Z',
        updatedAt: '2024-01-20T15:45:00Z',
        metadata: {
            url: 'https://www.framer.com',
            domain: 'framer.com',
            favicon: 'https://www.framer.com/favicon.ico'
        },
    },

    // 📝 B2B SaaS 패턴 라이브러리
    {
        id: '20',
        title: 'B2B SaaS 디자인 패턴 라이브러리',
        content: 'B2B SaaS 제품을 위한 검증된 디자인 패턴 모음집입니다. 대시보드 레이아웃, 데이터 테이블, 폼 디자인, 온보딩 플로우 등 자주 사용되는 UI 패턴들을 정리했습니다.',
        type: 'text',
        stage: 'consolidate',
        tags: ['b2b-saas', 'patterns', 'dashboard', 'data-tables'],
        folderId: 'text',
        createdAt: '2024-01-21T16:00:00Z',
        updatedAt: '2024-01-21T16:00:00Z',
        metadata: {
            author: '최SaaS디자이너',
            wordCount: 3200,
        },
    },

    // 📋 시스템 업데이트 계획
    {
        id: '21',
        title: '디자인 시스템 컴포넌트 업데이트 계획',
        content: 'Q2 디자인 시스템 로드맵 및 컴포넌트 업데이트 계획입니다. 4월: Button, Input, Modal 컴포넌트 리뉴얼, 5월: Table, Chart 컴포넌트 추가, 6월: 다크모드 지원 확장.',
        type: 'text',
        stage: 'consolidate',
        tags: ['design-system', 'roadmap', 'components', 'migration'],
        folderId: 'memo',
        createdAt: '2024-01-21T18:45:00Z',
        updatedAt: '2024-01-21T18:45:00Z',
        metadata: {
            author: '김시스템디자이너',
            priority: 'medium',
        },
    },

    // 📎 브랜드 컬러 참고 자료
    {
        id: '22',
        title: '컬러 팔레트 참고 자료',
        content: `브랜드별 시그니처 컬러들:
        
• Figma: #F24E1E, #FF7262, #A259FF
• Slack: #4A154B, #ECB22E, #36C5F0  
• Notion: #000000, #37352F, #2F3437
• Linear: #5E6AD2, #A7B5EC, #C4CCF8
• Spotify: #1DB954, #191414, #FFFFFF

접근성 체크 도구:
- WebAIM Contrast Checker
- Colour Contrast Analyser`,
        type: 'text',
        stage: 'consolidate',
        tags: ['colors', 'branding', 'accessibility', 'reference'],
        folderId: 'clipboard',
        createdAt: '2024-01-21T20:10:00Z',
        updatedAt: '2024-01-21T20:10:00Z',
        metadata: {
            author: '박컬러스페셜리스트',
        },
    }
];
