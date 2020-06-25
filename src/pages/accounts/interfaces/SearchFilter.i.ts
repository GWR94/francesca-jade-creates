import { ProductFilters } from "./ProductList.i";

export interface SearchFilterProps {
  type?: string;
  setQuery: (query: string, filters: ProductFilters) => void;
  admin?: boolean;
}
