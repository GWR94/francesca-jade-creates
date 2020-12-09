import { Variant } from "../../accounts/interfaces/Variants.i";
import { CustomOptionArrayType, BasketItemProps } from "./Basket.i";

export interface BasketItemState {
  isLoading: boolean;
  currentVariant: Variant | null;
  variantIndex: number | "";
  customOptions: CustomOptionArrayType;
  isCompleted: boolean;
  expanded: boolean;
  isEditing: boolean;
}

export interface BasketProps {
  item: BasketItemProps;
  currentIdx: number;
  items: BasketItemProps[];
  setIndex: (num: number) => void;
}
