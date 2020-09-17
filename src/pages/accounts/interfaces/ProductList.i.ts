import { ProductProps } from "./Product.i";

export interface ProductListProps {
  admin: boolean;
  noTitle?: boolean;
  type?: "Cake" | "Creates";
}

export interface ProductListState {
  page: {
    min: number;
    max: number;
  };
  searchResults: ProductProps[] | null;
  filterOpen: boolean;
  isLoading: boolean;
}

export interface FilterProps {
  or?: any[];
  and?: any[];
}

export type SearchType = "all" | "title" | "description" | "tags";

export interface ProductFilters {
  adminFilters: {
    cake: boolean;
    creates: boolean;
  };
  searchType: SearchType;
}
