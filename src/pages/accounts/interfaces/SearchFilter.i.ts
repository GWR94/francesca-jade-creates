import { ProductProps } from "./Product.i";

export interface SearchFilterProps {
  type?: string;
  admin: boolean;
  setSearchResults: (results: ProductProps[] | null) => void;
}

export interface AdminFilters {
  cake: boolean;
  creates: boolean;
}

export type SortMethod = "createdAt" | "updatedAt";
