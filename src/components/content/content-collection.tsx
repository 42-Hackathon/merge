import * as React from 'react';
import { ContentCard } from '../ui/content-card';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  aiSummary: string;
  keywords: string[];
  domain?: string;
  createdAt: string;
}

// 샘플 데이터 - 간단하고 깔끔한 형태
const sampleData: ContentItem[] = [
  {
    id: '1',
    title: 'AI Research Breakthrough',
    content: 'Groundbreaking research in AI showing significant improvements in language model performance.',
    aiSummary: 'New AI models achieve 40% better performance on language understanding tasks with novel transformer architecture.',
    keywords: ['AI', 'Machine Learning', 'NLP'],
    domain: 'arxiv.org',
    createdAt: '1/15/2024'
  },
  {
    id: '2',
    title: 'UI Design Inspiration',
    content: 'Collection of modern UI design patterns that showcase innovative interaction paradigms.',
    aiSummary: 'Modern UI patterns focus on micro-interactions and glass morphism design trends for better user engagement.',
    keywords: ['UI', 'Design', 'Interface'],
    domain: 'dribbble.com',
    createdAt: '1/11/2024'
  },
  {
    id: '3',
    title: 'Blockchain Development Guide',
    content: 'Step-by-step guide covering modern blockchain development tools and best practices.',
    aiSummary: 'Complete guide for building decentralized applications with modern tools and security best practices.',
    keywords: ['Blockchain', 'Development', 'Web3'],
    domain: 'github.com',
    createdAt: '1/10/2024'
  },
  {
    id: '4',
    title: 'Quantum Computing Advances',
    content: 'Comprehensive overview of quantum computing breakthroughs and their implications.',
    aiSummary: 'Quantum computers may revolutionize cryptography and scientific computing in the next decade.',
    keywords: ['Quantum', 'Computing', 'Technology'],
    domain: 'nature.com',
    createdAt: '1/7/2024'
  },
  {
    id: '5',
    title: 'Dashboard Analytics',
    content: 'Business intelligence dashboard displaying critical performance metrics and trends.',
    aiSummary: 'Real-time analytics dashboard showing key business metrics and KPIs for data-driven decisions.',
    keywords: ['Analytics', 'Dashboard', 'Metrics'],
    domain: 'tableau.com',
    createdAt: '1/5/2024'
  },
  {
    id: '6',
    title: 'Data Visualization Trends',
    content: 'Visual representation of current and emerging trends in data visualization techniques.',
    aiSummary: 'Interactive charts and 3D visualizations are becoming standard in data presentation workflows.',
    keywords: ['Data', 'Visualization', 'Charts'],
    domain: 'observablehq.com',
    createdAt: '12/28/2023'
  },
  {
    id: '7',
    title: 'Architecture Blueprint',
    content: 'Detailed blueprint showing how to design scalable microservices architecture.',
    aiSummary: 'Microservices architecture enables better scalability and independent deployments for large applications.',
    keywords: ['Architecture', 'Microservices', 'Scalability'],
    domain: 'medium.com',
    createdAt: '12/25/2023'
  },
  {
    id: '8',
    title: 'Meeting Notes Excerpt',
    content: 'Important meeting decisions covering UX improvements and project functionalities.',
    aiSummary: 'Team decided to prioritize user experience improvements and new features for Q1 roadmap.',
    keywords: ['Meeting', 'Strategy', 'Planning'],
    createdAt: '12/20/2023'
  },
  {
    id: '9',
    title: 'Sustainability Report Findings',
    content: 'Detailed analysis of how corporate sustainability programs are measurably impacting environmental goals.',
    aiSummary: 'Corporate sustainability efforts show 25% reduction in carbon footprint across major industries.',
    keywords: ['Sustainability', 'Environment', 'Corporate'],
    domain: 'sustainabilityreport.org',
    createdAt: '12/18/2023'
  },
  {
    id: '10',
    title: 'Market Research Summary',
    content: 'Comprehensive analysis of consumer behavior patterns and emerging market trends.',
    aiSummary: 'Consumers increasingly prefer sustainable products and digital experiences over traditional alternatives.',
    keywords: ['Market', 'Research', 'Consumer'],
    domain: 'mckinsey.com',
    createdAt: '12/15/2023'
  }
];

interface ContentCollectionProps {
  items?: ContentItem[];
  className?: string;
}

export function ContentCollection({ 
  items = sampleData, 
  className = "" 
}: ContentCollectionProps) {
  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Content Collection</h2>
        <span className="text-sm text-gray-600">{items.length} items in your workspace</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            title={item.title}
            content={item.content}
            aiSummary={item.aiSummary}
            keywords={item.keywords}
            domain={item.domain}
            createdAt={item.createdAt}
          />
        ))}
      </div>
    </div>
  );
} 