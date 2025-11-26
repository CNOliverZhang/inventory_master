import { User } from '@/Contexts/User';
import { BlogArticleTag, Category } from '../types';

export interface BlogArticleEditorRouterParams {
  id?: string;
}

export interface BlogArticleBasicInfo {
  id: number;
  title: string;
  subtitle?: string;
  author: User;
  coverImage?: string;
  categoryId?: number;
  category?: Category;
  introduction?: string;
  content: string;
  publishTime: Date;
  updateTime: Date;
  isPublished: boolean;
}

export interface BlogArticle extends BlogArticleBasicInfo {
  tags: BlogArticleTag[];
  relevantArticles: BlogArticle[];
}

export interface BlogArticleForm {
  id?: number;
  title: string;
  subtitle?: string;
  coverImage?: string;
  categoryId?: number;
  introduction?: string;
  content: string;
  publishTime?: Date;
  isPublished?: boolean;
}
