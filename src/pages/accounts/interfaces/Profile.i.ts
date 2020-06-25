import { ImageFile } from "../../../common/containers/interfaces/ImagePicker.i";
import { UserAttributeProps, CognitoUserProps } from "./Accounts.i";
import { S3ObjectInput } from "../../../API";

export interface ProfileProps {
  userAttributes: UserAttributeProps; //object container user attributes
  user: CognitoUserProps; // user attributes saved in cognito
  admin: boolean; // boolean to check if user is admin
  // styles object containing classNames.
  classes: {
    noLeftBorderInput: string;
    buttonBottom: string;
  };
}

export interface PhoneNumber {
  code?: string | null;
  value: string;
}

export interface ProfileState {
  isLoading: boolean; // boolean which shows/hides loading ui effects
  isEditing: boolean; // boolean which allows/disallows editing of components
  username: {
    value: string;
    error: string;
  };
  email: {
    value: string;
    verified: boolean;
    error: string;
  };
  phoneNumber: {
    value: string;
    verified: boolean;
    error: string;
    code?: string;
  };
  shippingAddress: {
    city: string;
    line1: string;
    line2?: string;
    county: string;
    postcode: string;
    error: string;
  };
  displayImage: S3ObjectInput | null;
  newDisplayImage: ImageFile | null;
  dialogOpen: {
    password: boolean;
    email: boolean;
    emailConfirm: boolean;
    phoneNumber: boolean;
  };
}
