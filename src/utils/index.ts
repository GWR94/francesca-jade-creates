import { CognitoUserAttribute } from "amazon-cognito-identity-js";

export const convertPoundsToPence = (price: number): number => {
  return parseInt((price / 100).toFixed(2), 10);
};

export const convertPenceToPounds = (price: number): number => {
  return parseInt((price * 100).toFixed(0), 10);
};

export const attributesToObject = (attributes: CognitoUserAttribute[]): any => {
  const obj: { [key: string]: boolean | string } = {};
  attributes.map((attribute: any): void => {
    if (attribute.Value === "true") {
      obj[attribute.Name] = true;
    } else if (attribute.Value === "false") {
      obj[attribute.Name] = false;
    } else {
      obj[attribute.Name] = attribute.Value;
    }
  });
  return obj;
};
