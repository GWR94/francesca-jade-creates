import { ProductProps } from "./Product.i";

export interface ProductListProps {
  admin: boolean;
  noTitle?: boolean;
  type?: "Cake" | "Creates";
}

export enum SortDirection {
  DESC = "DESC",
  ASC = "ASC",
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
  or?: unknown[];
  and?: unknown[];
}

export type SearchType = "all" | "title" | "description" | "tags";

export interface ProductFilters {
  adminFilters: {
    cake: boolean;
    creates: boolean;
  };
  searchType: SearchType;
}
