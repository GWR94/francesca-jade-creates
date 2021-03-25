import { S3ImageProps } from "../../../pages/accounts/interfaces/Product.i";

export interface ImageCarouselProps {
  images: S3ImageProps[];
  deleteImages?: boolean;
  handleUpdateImages?: (image: S3ImageProps[]) => void;
  type?: "Cake" | "Creates";
  id?: string;
  update?: boolean;
  isCentered?: boolean;
  cover?: number;
  classes?: { [key: string]: string };
}

export interface ImageCarouselState {
  keyToDelete: string;
  isPlaying: boolean;
  imageLoading: boolean;
  coverImageIdx: number;
}
