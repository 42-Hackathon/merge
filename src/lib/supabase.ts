import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Folders
  folders: {
    list: async (userId: string) => {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    create: async (folder: {
      name: string;
      color?: string;
      parent_id?: string;
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from('folders')
        .insert(folder)
        .select()
        .single();
      return { data, error };
    },

    update: async (id: string, updates: Partial<{
      name: string;
      color: string;
      parent_id: string;
    }>) => {
      const { data, error } = await supabase
        .from('folders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);
      return { error };
    }
  },

  // Content Items
  contentItems: {
    list: async (userId: string, folderId?: string) => {
      let query = supabase
        .from('content_items')
        .select(`
          *,
          folder:folders(name, color),
          tags:content_tags(tag:tags(name, color))
        `)
        .eq('user_id', userId);

      if (folderId) {
        query = query.eq('folder_id', folderId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    },

    create: async (item: {
      title: string;
      content: string;
      type: 'text' | 'image' | 'link' | 'video' | 'file';
      stage?: 'review' | 'refine' | 'consolidate';
      folder_id?: string;
      user_id: string;
      metadata?: any;
    }) => {
      const { data, error } = await supabase
        .from('content_items')
        .insert(item)
        .select()
        .single();
      return { data, error };
    },

    update: async (id: string, updates: Partial<{
      title: string;
      content: string;
      stage: 'review' | 'refine' | 'consolidate';
      folder_id: string;
      ai_summary: string;
      ai_keywords: string[];
      metadata: any;
    }>) => {
      const { data, error } = await supabase
        .from('content_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);
      return { error };
    },

    search: async (userId: string, query: string, filters?: {
      type?: string;
      stage?: string;
      folderId?: string;
    }) => {
      let dbQuery = supabase
        .from('content_items')
        .select(`
          *,
          folder:folders(name, color),
          tags:content_tags(tag:tags(name, color))
        `)
        .eq('user_id', userId);

      // 텍스트 검색
      if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,ai_summary.ilike.%${query}%`);
      }

      // 필터 적용
      if (filters?.type) {
        dbQuery = dbQuery.eq('type', filters.type);
      }
      if (filters?.stage) {
        dbQuery = dbQuery.eq('stage', filters.stage);
      }
      if (filters?.folderId) {
        dbQuery = dbQuery.eq('folder_id', filters.folderId);
      }

      const { data, error } = await dbQuery.order('created_at', { ascending: false });
      return { data, error };
    }
  },

  // Tags
  tags: {
    list: async (userId: string) => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userId)
        .order('name');
      return { data, error };
    },

    create: async (tag: {
      name: string;
      color?: string;
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from('tags')
        .insert(tag)
        .select()
        .single();
      return { data, error };
    },

    addToContent: async (contentId: string, tagId: string) => {
      const { error } = await supabase
        .from('content_tags')
        .insert({ content_id: contentId, tag_id: tagId });
      return { error };
    },

    removeFromContent: async (contentId: string, tagId: string) => {
      const { error } = await supabase
        .from('content_tags')
        .delete()
        .eq('content_id', contentId)
        .eq('tag_id', tagId);
      return { error };
    }
  },

  // Collaborations
  collaborations: {
    list: async (contentId: string) => {
      const { data, error } = await supabase
        .from('collaborations')
        .select(`
          *,
          user:auth.users(email)
        `)
        .eq('content_id', contentId);
      return { data, error };
    },

    add: async (collaboration: {
      content_id: string;
      user_id: string;
      role: 'owner' | 'editor' | 'viewer';
    }) => {
      const { data, error } = await supabase
        .from('collaborations')
        .insert(collaboration)
        .select()
        .single();
      return { data, error };
    },

    update: async (id: string, role: 'owner' | 'editor' | 'viewer') => {
      const { data, error } = await supabase
        .from('collaborations')
        .update({ role })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    remove: async (id: string) => {
      const { error } = await supabase
        .from('collaborations')
        .delete()
        .eq('id', id);
      return { error };
    }
  }
};