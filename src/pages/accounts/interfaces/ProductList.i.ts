import { History } from "history";
import { ProductProps } from "../../../common/interfaces/Product.i";

export interface ProductListProps {
  admin?: boolean;
  noTitle?: boolean;
  products: ProductProps[];
  type?: "Cake" | "Creates";
  history: History;
}

export interface ProductListState {
  page: number;
  queryResults: ProductProps[];
  sortMethod: string; // FIXME
  filterOpen: boolean;
}

export interface FilterProps {
  or?: any[];
  and?: any[];
}
