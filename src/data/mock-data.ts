import { ContentItem } from '../types/content';

export const mockContentItems: ContentItem[] = [
    // 🎨 Figma design tool
    {
        id: '1',
        title: 'Figma - Collaborative Design Platform',
        content: 'The ultimate tool for designing and prototyping with your team. Revolutionary design workflows with real-time collaboration and powerful component systems.',
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
    
    // 🖼️ Modern dashboard design
    {
        id: '2',
        title: 'Modern Dashboard UI Design',
        content: 'Clean and contemporary dashboard interface design. A perfect blend of data visualization and user-friendly layout showcasing modern design principles.',
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

    // 🎥 Design system architecture course
    {
        id: '3',
        title: 'Design System Architecture Deep Dive',
        content: 'Advanced course on building scalable design system architecture. Comprehensive coverage of token systems, component libraries, and team collaboration workflows.',
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

    // 📝 2024 design trends analysis
    {
        id: '4',
        title: '2024 UI/UX Design Trends Analysis',
        content: 'In-depth analysis of design trends to watch this year. Evolution of neomorphism, AI-driven personalized interfaces, accessibility-first design, and sustainable digital experience design.',
        type: 'text',
        stage: 'consolidate',
        tags: ['ui-trends', '2024', 'analysis', 'neomorphism', 'ai-design'],
        folderId: 'text',
        createdAt: '2024-01-21T09:00:00Z',
        updatedAt: '2024-01-21T09:00:00Z',
        metadata: {
            author: 'Sarah Chen',
            wordCount: 2800,
        },
    },

    // 🎥 Actual Figma tutorial video
    {
        id: '5',
        title: 'Figma Tutorial: Design Systems',
        content: 'Step-by-step practical tutorial for building complete design systems in Figma. Covers everything from component design to token management workflows.',
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

    // 🔗 Dribbble inspiration platform
    {
        id: '6',
        title: 'Dribbble - Design Inspiration Platform',
        content: 'Discover and find inspiration from the world\'s top designers. A creative community featuring UI/UX, branding, illustration, and diverse design work.',
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

    // 📋 Client feedback memo
    {
        id: '7',
        title: 'Client Feedback Summary - Mobile App Redesign',
        content: 'Comprehensive client feedback for mobile app redesign project. Key revision requests: 1) Simplify main navigation structure 2) Adjust color palette to brand guidelines 3) Increase button sizes.',
        type: 'text',
        stage: 'review',
        tags: ['client-feedback', 'mobile-app', 'redesign', 'navigation'],
        folderId: 'memo',
        createdAt: '2024-01-21T17:30:00Z',
        updatedAt: '2024-01-21T17:30:00Z',
        metadata: {
            author: 'Mike Johnson',
            priority: 'high',
        },
    },

    // 🖼️ Mobile app interface
    {
        id: '8',
        title: 'Mobile App Interface Showcase',
        content: 'Elegant interface design collection for mobile apps. Case study showcasing touch-friendly elements and intuitive navigation patterns.',
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

    // 🎥 Neuralink Progress Update
    {
        id: '9',
        title: 'Neuralink Progress Update - 7 Participants, Telepathy & Blind Sight Demo',
        content: 'Comprehensive presentation showcasing Neuralink\'s latest BCI developments. Features live demonstrations from 7 active participants (4 spinal cord injury, 3 ALS patients) using Telepathy product for cursor control, gaming, and robotic arm manipulation. Includes technical deep-dives on surgical robots, chip design, and roadmap through 2028 with speech cortex implants, Blind Sight vision restoration, and AI integration. Participants average 50+ hours/week independent use with record-breaking 7 BPS performance.',
        type: 'video',
        stage: 'consolidate',
        tags: ['neuralink', 'bci', 'brain-computer-interface', 'telepathy', 'blind-sight', 'elon-musk', 'neuroscience', 'cybernetics', 'ai-integration', 'spinal-cord-injury', 'als', 'assistive-technology', 'robotic-control', 'neural-prosthetics'],
        folderId: 'videos',
        createdAt: '2025-06-28T21:30:00Z',
        updatedAt: '2025-06-28T21:30:00Z',
        metadata: {
            url: 'https://youtu.be/FASMejN_5gs?si=xoBluFVMN62QCw5Z',
            duration: 7200,
            resolution: '2160p',
            platform: 'YouTube'
        },
    },

    // 🔗 Material Design 3
    {
        id: '10',
        title: 'Material Design 3',
        content: 'Google\'s latest design system. Dynamic Color, Material You, and adaptive design principles for creating personalized user experiences.',
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

    // 🎥 Actual UX design video
    {
        id: '11',
        title: 'UX Design Process - Case Study',
        content: 'Complete case study video covering the entire UX design project process. Detailed demonstration of design thinking methodology from user research to final prototype.',
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

    // 📝 Accessibility checklist
    {
        id: '12',
        title: 'Accessibility-First Design Checklist',
        content: 'Practical checklist for accessibility design meeting WCAG 2.1 AA standards. Key elements organized by category: color contrast, keyboard navigation, screen reader compatibility, and focus management.',
        type: 'text',
        stage: 'refine',
        tags: ['accessibility', 'wcag', 'checklist', 'inclusive-design'],
        folderId: 'text',
        createdAt: '2024-01-21T10:30:00Z',
        updatedAt: '2024-01-21T10:30:00Z',
        metadata: {
            author: 'Emma Rodriguez',
            wordCount: 1950,
        },
    },

    // 🖼️ Typography study
    {
        id: '13',
        title: 'Typography & Layout Study',
        content: 'Design study showcasing the harmony between typography and layout. Explores the art of text placement considering readability and aesthetic balance.',
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

    // 🔗 Coolors palette generator
    {
        id: '14',
        title: 'Coolors - Color Palette Generator',
        content: 'Create and explore beautiful color combinations with ease. Features infinite palette generation, accessibility checking, and export to various formats.',
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

    // 📎 CSS snippets collection
    {
        id: '15',
        title: 'Essential CSS Snippets Collection',
        content: `/* Glassmorphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Smooth gradient */
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
            author: 'Alex Thompson',
            language: 'css',
        },
    },

    // 🎥 Actual Figma prototyping video
    {
        id: '16',
        title: 'Advanced Figma Prototyping',
        content: 'Complete guide to mastering advanced prototyping features in Figma. Practical demonstrations of smart animations, interactive components, and complex user flows.',
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

    // 🖼️ Color theory practice
    {
        id: '17',
        title: 'Color Theory in Practice',
        content: 'Practical application of color theory in real design cases. Visual explanation of psychological effects of colors and color strategies that strengthen brand identity.',
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

    // 📝 Design handoff guide
    {
        id: '18',
        title: 'Design Handoff Best Practices',
        content: 'Handoff guide for seamless collaboration between designers and developers. Covers Figma Dev Mode usage, design token delivery methods, and responsive design specifications.',
        type: 'text',
        stage: 'review',
        tags: ['handoff', 'collaboration', 'dev-mode', 'communication'],
        folderId: 'text',
        createdAt: '2024-01-21T14:15:00Z',
        updatedAt: '2024-01-21T14:15:00Z',
        metadata: {
            author: 'Chris Williams',
            wordCount: 2200,
        },
    },

    // 🔗 Framer prototyping
    {
        id: '19',
        title: 'Framer - Interactive Prototyping',
        content: 'Create complex interactions and animations without code. Design and test realistic user experiences with powerful prototyping capabilities.',
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

    // 📝 B2B SaaS pattern library
    {
        id: '20',
        title: 'B2B SaaS Design Pattern Library',
        content: 'Curated collection of proven design patterns for B2B SaaS products. Covers dashboard layouts, data tables, form design, onboarding flows, and commonly used UI patterns.',
        type: 'text',
        stage: 'consolidate',
        tags: ['b2b-saas', 'patterns', 'dashboard', 'data-tables'],
        folderId: 'text',
        createdAt: '2024-01-21T16:00:00Z',
        updatedAt: '2024-01-21T16:00:00Z',
        metadata: {
            author: 'Rachel Kim',
            wordCount: 3200,
        },
    },

    // 📋 System update plan
    {
        id: '21',
        title: 'Design System Component Update Plan',
        content: 'Q2 design system roadmap and component update plan. April: Button, Input, Modal component redesign. May: Table, Chart component additions. June: Extended dark mode support.',
        type: 'text',
        stage: 'consolidate',
        tags: ['design-system', 'roadmap', 'components', 'migration'],
        folderId: 'memo',
        createdAt: '2024-01-21T18:45:00Z',
        updatedAt: '2024-01-21T18:45:00Z',
        metadata: {
            author: 'David Park',
            priority: 'medium',
        },
    },

    // 📎 Brand color reference
    {
        id: '22',
        title: 'Color Palette Reference Guide',
        content: `Brand signature colors:
        
• Figma: #F24E1E, #FF7262, #A259FF
• Slack: #4A154B, #ECB22E, #36C5F0  
• Notion: #000000, #37352F, #2F3437
• Linear: #5E6AD2, #A7B5EC, #C4CCF8
• Spotify: #1DB954, #191414, #FFFFFF

Accessibility check tools:
- WebAIM Contrast Checker
- Colour Contrast Analyser`,
        type: 'text',
        stage: 'consolidate',
        tags: ['colors', 'branding', 'accessibility', 'reference'],
        folderId: 'clipboard',
        createdAt: '2024-01-21T20:10:00Z',
        updatedAt: '2024-01-21T20:10:00Z',
        metadata: {
            author: 'Maya Patel',
        },
    }
];
