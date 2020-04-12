import { S3ImageProps } from "./Product.i";

export interface ImageCarouselProps {
  images: S3ImageProps[];
  deleteImages?: boolean;
  id?: string;
  handleUpdateImages?: (image: S3ImageProps[]) => void;
  update?: boolean;
}

export interface ImageCarouselState {
  animating: boolean;
  currentIndex: number;
  dialogOpen: boolean;
  keyToDelete: string;
}
