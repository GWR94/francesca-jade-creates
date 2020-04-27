import { Crop } from "react-image-crop";
import { S3ObjectInput } from "../../API";

export interface ImagePickerProps {
  savedS3Image?: S3ObjectInput;
  disabled?: boolean;
  setImageFile: (image) => void;
  savedImage?: string;
  theme?: object;
  className?: string;
  setImagePreview?: (preview) => void;
  showPreview?: boolean;
  update?: boolean;
  profile?: boolean;
  showText?: boolean;
}

export interface ImagePickerState {
  imagePreview: string;
  src: string;
  crop: Crop;
  croppedImage: File;
  cropperOpen: boolean;
}
