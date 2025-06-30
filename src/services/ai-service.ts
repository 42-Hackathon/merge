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
  private model = 'anthropic/claude-3.5-sonnet'; // Default model

  constructor() {
    // In Electron environment, set up for users to enter API key directly
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
      // Provide mock response when API key is not available (for demo)
      return this.getMockResponse(messages, contextItems);
    }

    // Convert context items to system message
    const contextMessage = this.buildContextMessage(contextItems);
    
    // Convert messages to OpenRouter API format
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
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Unable to receive AI response.');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Unable to connect to AI service.'
      );
    }
  }

  private getMockResponse(messages: AIMessage[], contextItems: ContextItem[]): Promise<string> {
    return new Promise((resolve) => {
      // Wait 1-2 seconds (to look like actual API call)
      setTimeout(() => {
        const lastMessage = messages[messages.length - 1];
        const userQuestion = lastMessage?.content || '';
        
        let response = '';
        
        if (contextItems.length > 0) {
          response = `Hello! I will answer based on ${contextItems.length} context information pieces.\n\n`;
          response += `📋 Referenced information: ${contextItems.map(item => item.title).join(', ')}\n\n`;
        }
        
        if (userQuestion.toLowerCase().includes('hello') || userQuestion.includes('hi')) {
          response += 'Hello! I am an AI assistant. How can I help you?';
        } else if (userQuestion.includes('?')) {
          response += `A question about "${userQuestion}"! \n\nThis is a demo response. To use actual AI features, please set up your OpenRouter API key.`;
        } else {
          response += `I understand what you've said. \n\nCurrently running in demo mode. To receive actual AI responses:\n\n1. Get API key from OpenRouter.ai\n2. Enter API key in Settings\n\nThen you can have real conversations with Claude 3.5 Sonnet!`;
        }
        
        resolve(response);
      }, Math.random() * 1000 + 500); // 0.5-1.5 second random delay
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

    return `Here is the information collected by the user. Please refer to this information when answering questions:

${contextSections.join('\n---\n')}

Based on the above information, please provide helpful answers to the user's questions.`;
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