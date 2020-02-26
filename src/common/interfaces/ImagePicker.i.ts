import { S3ObjectInput } from "../../API";

export interface ImagePickerProps {
  displayImage: S3ObjectInput;
  isEditing: boolean;
  setImageFile: (image) => void;
  userImage: string;
}
