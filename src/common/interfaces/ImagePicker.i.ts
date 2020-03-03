import { S3ObjectInput } from "../../API";

export interface ImagePickerProps {
  savedS3Image?: S3ObjectInput;
  disabled: boolean;
  setImageFile: (image) => void;
  savedImage?: string;
  theme?: object;
  className?: string;
  setImagePreview?: (preview) => void;
  showPreview?: boolean;
  update?: boolean;
  profile?: boolean;
}
