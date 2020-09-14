import { CognitoUserAttribute } from "amazon-cognito-identity-js";

/**
 * helper method to put cognito user attributes array into an object that can
 * be read and processed properly
 */
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

// helper methods for setting up aws_exports with localhost and production simultaneously
export const hasLocalhost = (hostname: string): boolean =>
  Boolean(
    hostname.match(/localhost/) ||
      hostname.match(/127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/),
  );

export const hasHostname = (hostname: string): boolean =>
  Boolean(hostname.includes(window.location.hostname));

export const isLocalhost = hasLocalhost(window.location.hostname);

export const getReadableStringFromArray = (array: string[]): string => {
  return array.length == 1
    ? array[0]
    : [array.slice(0, array.length - 1).join(", "), array[array.length - 1]].join(
        " and ",
      );
};
