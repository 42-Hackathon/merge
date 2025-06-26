import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  X, 
  Calendar,
  Tag,
  FileText,
  Image,
  Link,
  Video,
  Clock,
  TrendingUp
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Modal } from "@/components/ui/modal";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'link' | 'video';
  tags: string[];
  createdAt: string;
  relevance: number;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const recentSearches = [
    "디자인 시스템",
    "React 컴포넌트",
    "UI 패턴",
    "사용자 경험"
  ];

  const popularTags = [
    "design", "development", "research", "ui", "ux", "react", "typescript"
  ];

  const filters = [
    { id: 'all', name: '전체', icon: Search },
    { id: 'text', name: '텍스트', icon: FileText },
    { id: 'image', name: '이미지', icon: Image },
    { id: 'link', name: '링크', icon: Link },
    { id: 'video', name: '동영상', icon: Video }
  ];

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: '디자인 시스템 가이드라인',
      content: '일관된 사용자 경험을 위한 디자인 시스템 구축 방법론과 컴포넌트 라이브러리 설계 원칙...',
      type: 'text',
      tags: ['design', 'system', 'ui'],
      createdAt: '2024-01-15',
      relevance: 95
    },
    {
      id: '2',
      title: 'React 성능 최적화 기법',
      content: 'React 애플리케이션의 렌더링 성능을 향상시키는 다양한 최적화 기법들...',
      type: 'text',
      tags: ['react', 'performance', 'optimization'],
      createdAt: '2024-01-14',
      relevance: 87
    }
  ];

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      // 실제 검색 로직 시뮬레이션
      setTimeout(() => {
        setResults(mockResults.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        ));
        setIsSearching(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [query]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return FileText;
      case 'image': return Image;
      case 'link': return Link;
      case 'video': return Video;
      default: return FileText;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="top" className="max-w-4xl">
      <GlassCard className="mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-white/20">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
            <Input
              placeholder="검색어를 입력하세요... (유의어 검색 지원)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 text-lg h-12"
              autoFocus
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 p-4 border-b border-white/20">
          {filters.map(filter => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className="text-white hover:bg-white/10"
              >
                <Icon className="h-4 w-4 mr-2" />
                {filter.name}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 max-h-96">
          <div className="p-6">
            {query.length === 0 ? (
              <div className="space-y-6">
                {/* Recent Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-white/70" />
                    <span className="text-white/80 text-sm font-medium">최근 검색</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(search => (
                      <Button
                        key={search}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(search)}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/20" />

                {/* Popular Tags */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-white/70" />
                    <span className="text-white/80 text-sm font-medium">인기 태그</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/20 text-white cursor-pointer hover:bg-white/30"
                        onClick={() => setQuery(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-white/60">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"
                  />
                  <p>검색 중...</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>검색 결과가 없습니다</p>
                <p className="text-sm mt-1">다른 키워드로 시도해보세요</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-white/80 text-sm">
                  {results.length}개의 결과를 찾았습니다
                </div>
                {results.map(result => {
                  const TypeIcon = getTypeIcon(result.type);
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white/10 rounded-full">
                          <TypeIcon className="h-5 w-5 text-white/80" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{result.title}</h3>
                          <p className="text-white/70 text-sm line-clamp-2 mb-2">{result.content}</p>
                          <div className="flex items-center justify-between text-xs text-white/50">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <Tag className="h-3 w-3" />
                                <span>{result.tags.join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" />
                                <span>{result.createdAt}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="border-green-500/50 text-green-400">
                              정확도: {result.relevance}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </GlassCard>
    </Modal>
  );
}