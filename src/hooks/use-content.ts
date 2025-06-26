import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { useAuth } from './use-auth';

export function useContent() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 콘텐츠 목록 로드
  const loadContent = async (folderId?: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await db.contentItems.list(user.id, folderId);
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '콘텐츠를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 폴더 목록 로드
  const loadFolders = async () => {
    if (!user) return;

    try {
      const { data, error } = await db.folders.list(user.id);
      if (error) throw error;
      setFolders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '폴더를 불러오는데 실패했습니다.');
    }
  };

  // 콘텐츠 생성
  const createContent = async (content: {
    title: string;
    content: string;
    type: 'text' | 'image' | 'link' | 'video' | 'file';
    folder_id?: string;
    metadata?: any;
  }) => {
    if (!user) return { error: '로그인이 필요합니다.' };

    try {
      const { data, error } = await db.contentItems.create({
        ...content,
        user_id: user.id
      });
      if (error) throw error;
      
      // 목록 새로고침
      await loadContent();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '콘텐츠 생성에 실패했습니다.';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  // 콘텐츠 업데이트
  const updateContent = async (id: string, updates: any) => {
    try {
      const { data, error } = await db.contentItems.update(id, updates);
      if (error) throw error;
      
      // 목록 새로고침
      await loadContent();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '콘텐츠 업데이트에 실패했습니다.';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  // 콘텐츠 삭제
  const deleteContent = async (id: string) => {
    try {
      const { error } = await db.contentItems.delete(id);
      if (error) throw error;
      
      // 목록 새로고침
      await loadContent();
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '콘텐츠 삭제에 실패했습니다.';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  // 폴더 생성
  const createFolder = async (folder: {
    name: string;
    color?: string;
    parent_id?: string;
  }) => {
    if (!user) return { error: '로그인이 필요합니다.' };

    try {
      const { data, error } = await db.folders.create({
        ...folder,
        user_id: user.id
      });
      if (error) throw error;
      
      // 폴더 목록 새로고침
      await loadFolders();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '폴더 생성에 실패했습니다.';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  // 검색
  const searchContent = async (query: string, filters?: any) => {
    if (!user) return { data: [], error: '로그인이 필요합니다.' };

    setLoading(true);
    try {
      const { data, error } = await db.contentItems.search(user.id, query, filters);
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '검색에 실패했습니다.';
      setError(errorMessage);
      return { data: [], error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (user) {
      loadContent();
      loadFolders();
    }
  }, [user]);

  return {
    items,
    folders,
    loading,
    error,
    loadContent,
    loadFolders,
    createContent,
    updateContent,
    deleteContent,
    createFolder,
    searchContent
  };
}