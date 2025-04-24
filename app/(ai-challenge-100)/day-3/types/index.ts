export interface Memo {
  id: number;
  title: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface UseMemoReturn {
  memos: Memo[];
  addMemo: (title: string, text: string) => void;
  editMemo: (id: number, title: string, text: string) => void;
  deleteMemo: (id: number) => void;
  searchMemos: (query: string) => Memo[];
  sortMemos: (sortBy: 'createdAt' | 'updatedAt') => void;
}

export type SortType = 'createdAt' | 'updatedAt'; 