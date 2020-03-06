import { History } from "history";
import { ProductProps } from "../../../common/interfaces/Product.i";

export interface UpdateProps {
  match?: {
    params: {
      id: string;
    };
  };
  history: History;
  update?: boolean;
}

export interface UpdateState {
  isLoading: boolean;
  product: ProductProps;
  imageConfirmOpen: boolean;
  confirmDialogOpen: boolean;
  isUploading: boolean;
  errors: {
    title: string;
    description: string;
    tags: string;
    image: string;
  };
  percentUploaded: number;
}
