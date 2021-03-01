import { History } from "history";
import { ProductProps } from "../../accounts/interfaces/Product.i";

export interface UpdateProps {
  history: History;
  id?: string | undefined;
  admin: boolean;
  update?: boolean;
  setCurrentTab?: (tab: string) => void;
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
    customOptions: string | null;
  };
  percentUploaded: number;
  customSwitch: boolean;
}

export interface FileToUpload extends Partial<File> {
  file?: File;
  webkitRelativePath?: string;
}
