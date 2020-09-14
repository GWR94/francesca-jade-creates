import { S3ImageProps } from "../../../pages/accounts/interfaces/Product.i";

export interface ImageCarouselProps {
  images: S3ImageProps[] | File[];
  deleteImages?: boolean;
  id?: string;
  handleUpdateImages?: (image: S3ImageProps[]) => void;
  update?: boolean;
  type: "Cake" | "Creates";
}

export interface ImageCarouselState {
  dialogOpen: boolean;
  keyToDelete: string | null;
  isPlaying: boolean;
}
