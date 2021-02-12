import { Crop } from "react-image-crop";
import { ImageProps } from "../../../pages/products/interfaces/NewProduct.i";
import { S3ObjectInput } from "../../../API";

export interface ImagePickerProps {
  savedS3Image?: S3ObjectInput | null;
  disabled?: boolean;
  setImageFile: (image: ImageFile) => void;
  savedImage?: string;
  theme?: object;
  className?: string;
  setImagePreview?: (preview: string) => void;
  showPreview?: boolean;
  update?: boolean;
  profile?: boolean;
  showText?: boolean;
  cropImage?: boolean;
  type?: "Cake" | "Creates";
  classes: {
    [key: string]: string;
  };
}

export type ImageFile = ImageProps | File;

export interface ImagePickerState {
  imagePreview: string | null;
  src: string | null;
  crop: Crop;
  croppedImage: ImageFile | null;
  cropperOpen: boolean;
  originalFileName: string;
}
