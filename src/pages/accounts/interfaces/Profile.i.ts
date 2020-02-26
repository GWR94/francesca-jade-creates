import { UserAttributeProps, CognitoUserProps } from "./Accounts.i";
import { S3ObjectInput } from "../../../API";
import { ImageProps } from "./NewProduct.i";

export interface ProfileProps {
  userAttributes: UserAttributeProps;
  user: CognitoUserProps;
  admin: boolean;
}

export interface ProfileState {
  isLoading: boolean;
  isEditing: boolean;
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
    code: string;
  };
  shippingAddress: {
    city: string;
    line1: string;
    line2?: string;
    county: string;
    postcode: string;
    error: string;
  };
  displayImage: S3ObjectInput;
  newDisplayImage: ImageProps;
  percentUploaded: number;
  dialogOpen: {
    password: boolean;
    email: boolean;
    phoneNumber: boolean;
  };
}
