import {
  ProductFilters,
  sortMethod,
} from "../../pages/accounts/interfaces/ProductList.i";

export interface SearchFilterProps {
  type?: string;
  setQuery: (query: string, filters: ProductFilters) => void;
  admin?: boolean;
}

export interface SearchFilterState {
  adminFilters: {
    cake: boolean;
    creates: boolean;
  };
  searchQuery: string;
  query: string;
  sortBy: sortMethod;
}
