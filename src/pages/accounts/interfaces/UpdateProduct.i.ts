import { History } from "history";
import { RouteComponentProps } from "react-router-dom";
import { ProductProps } from "./Product.i";

export interface MatchParams {
  id: string;
}

export interface UpdateProps extends RouteComponentProps<MatchParams> {
  history: History;
  update?: boolean;
  classes: {
    [key: string]: string;
  };
  admin: boolean;
  // type: "Cake" | "Creates";
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
  customSwitch: boolean;
}

export interface FileToUpload extends Partial<File> {
  file?: File;
  webkitRelativePath?: string;
}
