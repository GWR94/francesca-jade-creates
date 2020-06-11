import { Crop } from "react-image-crop";
import { S3ObjectInput } from "../../API";
import { ImageProps } from "../../pages/accounts/interfaces/NewProduct.i";

export interface ImagePickerProps {
  savedS3Image?: S3ObjectInput | null;
  disabled?: boolean;
  setImageFile: (image: ImageProps | File) => void;
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

export interface ImagePickerState {
  imagePreview: string | null;
  src: string | null;
  crop: Crop;
  croppedImage: File | null;
  cropperOpen: boolean;
}
