import * as React from "react"
import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"

export interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  content: string;
  aiSummary: string;
  keywords: string[];
  domain?: string;
  createdAt: string;
}

const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  ({ 
    className, 
    title, 
    content, 
    aiSummary,
    keywords = [], 
    domain,
    createdAt,
    ...props 
  }, ref) => {
    // www. 제거
    const cleanDomain = domain?.replace(/^www\./, '') || '';

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer",
          "hover:shadow-md transition-shadow duration-200",
          className
        )}
        {...props}
      >
        <div className="space-y-3">
          {/* 제목 */}
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {title}
          </h3>

          {/* 내용 (1줄) */}
          <p className="text-gray-600 text-xs line-clamp-1">
            {content}
          </p>

          {/* AI 요약 (1~3줄) */}
          <div className="bg-blue-50 rounded-md p-2">
            <p className="text-blue-800 text-xs line-clamp-3 leading-relaxed">
              {aiSummary}
            </p>
          </div>

          {/* 키워드 3개 */}
          <div className="flex gap-1">
            {keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* 도메인과 생성일 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            {domain && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{cleanDomain}</span>
              </div>
            )}
            <span>{createdAt}</span>
          </div>
        </div>
      </div>
    )
  }
)
ContentCard.displayName = "ContentCard"

export { ContentCard } 