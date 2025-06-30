export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  contextItems?: ContextItem[];
}

export interface ContextItem {
  id: string;
  type: 'text' | 'image' | 'link' | 'video' | 'audio' | 'clipboard' | 'screenshot' | 'other';
  title: string;
  content: string;
  metadata?: { url?: string; domain?: string; favicon?: string; };
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private model = 'anthropic/claude-3.5-sonnet'; // 기본 모델

  constructor() {
    // Electron 환경에서는 사용자가 직접 API 키를 입력하도록 설정
    this.apiKey = '';
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(
    messages: AIMessage[],
    contextItems: ContextItem[] = []
  ): Promise<string> {
    if (!this.apiKey) {
      // API 키가 없을 때 Mock 응답 제공 (데모용)
      return this.getMockResponse(messages, contextItems);
    }

    // 컨텍스트 아이템들을 시스템 메시지로 변환
    const contextMessage = this.buildContextMessage(contextItems);
    
    // OpenRouter API 형식으로 메시지 변환
    const apiMessages = [
      ...(contextMessage ? [{ role: 'system', content: contextMessage }] : []),
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Assistant'
        },
        body: JSON.stringify({
          model: this.model,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('AI 응답을 받을 수 없습니다.');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI 서비스 오류:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'AI 서비스에 연결할 수 없습니다.'
      );
    }
  }

  private getMockResponse(messages: AIMessage[], contextItems: ContextItem[]): Promise<string> {
    return new Promise((resolve) => {
      // 1-2초 대기 (실제 API 호출처럼 보이게)
      setTimeout(() => {
        const lastMessage = messages[messages.length - 1];
        const userQuestion = lastMessage?.content || '';
        
        let response = '';
        
        if (contextItems.length > 0) {
          response = `안녕하세요! 현재 ${contextItems.length}개의 컨텍스트 정보를 참고하여 답변드리겠습니다.\n\n`;
          response += `📋 참고한 정보: ${contextItems.map(item => item.title).join(', ')}\n\n`;
        }
        
        if (userQuestion.toLowerCase().includes('hello') || userQuestion.includes('안녕')) {
          response += '안녕하세요! AI 어시스턴트입니다. 무엇을 도와드릴까요?';
        } else if (userQuestion.includes('?') || userQuestion.includes('질문')) {
          response += `"${userQuestion}"에 대한 질문이군요! \n\n이것은 데모 응답입니다. 실제 AI 기능을 사용하려면 OpenRouter API 키를 설정해주세요.`;
        } else {
          response += `말씀하신 내용을 잘 이해했습니다. \n\n현재는 데모 모드로 실행 중입니다. 실제 AI 응답을 받으려면:\n\n1. OpenRouter.ai에서 API 키 발급\n2. Settings에서 API 키 입력\n\n그러면 Claude 3.5 Sonnet과 실제 대화할 수 있습니다!`;
        }
        
        resolve(response);
      }, Math.random() * 1000 + 500); // 0.5-1.5초 랜덤 지연
    });
  }

  private buildContextMessage(contextItems: ContextItem[]): string {
    if (contextItems.length === 0) return '';

    const contextSections = contextItems.map(item => {
      let section = `## ${item.title} (${item.type})\n`;
      
      if (item.type === 'link' && item.metadata?.url) {
        section += `URL: ${item.metadata.url}\n`;
      }
      
      section += `${item.content}\n`;
      return section;
    });

    return `다음은 사용자가 수집한 정보들입니다. 이 정보들을 참고하여 질문에 답변해주세요:

${contextSections.join('\n---\n')}

위 정보들을 바탕으로 사용자의 질문에 도움이 되는 답변을 제공해주세요.`;
  }

  // 스트리밍 응답을 위한 메서드 (향후 확장용)
  async streamMessage(
    messages: AIMessage[],
    contextItems: ContextItem[] = [],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    // 향후 스트리밍 구현
    const response = await this.sendMessage(messages, contextItems);
    onChunk(response);
  }
}

export const aiService = new AIService(); 