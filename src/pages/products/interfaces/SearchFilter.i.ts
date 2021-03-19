export interface SearchFilterProps {
  type?: string;
  admin: boolean;
  filterOpen: boolean;
  closeDrawer: () => void;
}

export interface ProductFilterType {
  cake: boolean;
  creates: boolean;
}

export type SortMethod = "createdAt" | "updatedAt";
