export interface Database {
  public: {
    Tables: {
      folders: {
        Row: {
          id: string;
          name: string;
          color: string;
          parent_id: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
          parent_id?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          parent_id?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_items: {
        Row: {
          id: string;
          title: string;
          content: string;
          type: 'text' | 'image' | 'link' | 'video' | 'file';
          stage: 'review' | 'refine' | 'consolidate';
          folder_id: string | null;
          user_id: string;
          ai_summary: string | null;
          ai_keywords: string[];
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string;
          type: 'text' | 'image' | 'link' | 'video' | 'file';
          stage?: 'review' | 'refine' | 'consolidate';
          folder_id?: string | null;
          user_id: string;
          ai_summary?: string | null;
          ai_keywords?: string[];
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          type?: 'text' | 'image' | 'link' | 'video' | 'file';
          stage?: 'review' | 'refine' | 'consolidate';
          folder_id?: string | null;
          user_id?: string;
          ai_summary?: string | null;
          ai_keywords?: string[];
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          color: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      content_tags: {
        Row: {
          content_id: string;
          tag_id: string;
        };
        Insert: {
          content_id: string;
          tag_id: string;
        };
        Update: {
          content_id?: string;
          tag_id?: string;
        };
      };
      collaborations: {
        Row: {
          id: string;
          content_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          created_at: string;
        };
        Insert: {
          id?: string;
          content_id: string;
          user_id: string;
          role?: 'owner' | 'editor' | 'viewer';
          created_at?: string;
        };
        Update: {
          id?: string;
          content_id?: string;
          user_id?: string;
          role?: 'owner' | 'editor' | 'viewer';
          created_at?: string;
        };
      };
    };
  };
}