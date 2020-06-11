import { History } from "history";
import { ProductProps } from "../../../common/interfaces/Product.i";

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

export type sortMethod = "createdAt" | "updatedAt";

export interface ProductFilters {
  adminFilters: {
    cake: boolean;
    creates: boolean;
  };
  searchQuery: string;
  sortBy: sortMethod;
}
