export interface Category {
  id: number;
  name: string;
  parentId?: number;
  children?: Category[];
}

export interface CategoryForm {
  id?: number;
  name: string;
  parentId?: number;
}

export interface BlogArticleTag {
  id: number;
  name: string;
}

export interface BlogArticleTagForm {
  name: string;
}
