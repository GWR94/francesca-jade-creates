import { History } from "history";
import { RouteComponentProps } from "react-router-dom";
import { ProductProps } from "../../../common/interfaces/Product.i";
import { AccountTabTypes } from "./Accounts.i";

export interface MatchParams {
  id: string;
}

export interface UpdateProps extends RouteComponentProps<MatchParams> {
  history: History;
  update?: boolean;
  setCurrentTab: (tab: AccountTabTypes) => void;
  classes: {
    [key: string]: string;
  };
}

export interface UpdateState {
  isLoading: boolean;
  product: ProductProps;
  imageConfirmOpen: boolean;
  confirmDialogOpen: boolean;
  isUploading: boolean;
  errors: {
    title: string | null;
    description: string | null;
    tags: string | null;
    image: string | null;
    tagline: string | null;
  };
  percentUploaded: number;
  customOptions: boolean;
}

export interface FileToUpload {
  file: File;
  name?: string;
}
