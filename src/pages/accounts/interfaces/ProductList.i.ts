import { History } from "history";
import { ProductProps } from "./Product.i";

export interface ProductListProps {
  admin?: boolean;
  noTitle?: boolean;
  products: ProductProps[] | null;
  type?: "Cake" | "Creates";
  history: History;
}

export interface ProductListState {
  page: number;
  queryResults: ProductProps[] | null;
  sortMethod: number | string; // FIXME
  filterOpen: boolean;
}

export interface FilterProps {
  or?: any[];
  and?: any[];
}

export type SortMethod = "createdAt" | "updatedAt";

export type SearchType = "all" | "title" | "description" | "tags";

export interface ProductFilters {
  adminFilters: {
    cake: boolean;
    creates: boolean;
  };
  searchType: SearchType;
  sortBy: SortMethod;
}
