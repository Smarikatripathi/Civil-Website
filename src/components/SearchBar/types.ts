export interface SearchResult {
  id: string;
  title: string;
  category: string;
  icon?: string;
  url: string;
}

export interface SearchBarProps {
  className?: string;
}
