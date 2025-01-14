import { ProductProps, ProductType } from "../../accounts/interfaces/Product.i";

export interface ProductListProps {
  admin: boolean;
  noTitle?: boolean;
  type?: ProductType;
  theme?: string;
  page?: number;
}

export interface ProductListState {
  page: {
    min: number;
    max: number;
  };
  searchResults: ProductProps[] | null;
  filterOpen: boolean;
  isLoading: boolean;
  // nextToken: string | undefined;
  // nextNextToken: string | undefined;
  // previousTokens: string[];
  // sortDirection: SortDirection;
}

export interface FilterProps {
  or: unknown[];
  and: unknown[];
}

export interface ProductFilters {
  adminFilters: {
    cake: boolean;
    creates: boolean;
  };
  searchType: SearchType;
}
