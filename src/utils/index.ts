import { Auth, Storage } from "aws-amplify";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { S3ImageProps } from "../pages/accounts/interfaces/Product.i";
import { Variant } from "../pages/products/interfaces/Variants.i";
import { openSnackbar } from "./Notifier";

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

/**
 * Function to remove an image that is stored in the cloud (S3)
 * @param key - the key of the image that wants to be removed from the cloud
 *
 */
export const handleRemoveFromS3 = async (key: string): Promise<void> => {
  try {
    // remove the image from s3 by using the key
    if (key) await Storage.remove(key);
  } catch (err) {
    openSnackbar({
      severity: "error",
      message: "Unable to remove image. Please try again.",
    });
  }
};

export const getPublicS3URL = (s3Image: S3ImageProps): string => {
  const { key, bucket, region } = s3Image;
  const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
  return url;
};

/**
 * Function to return the compressed s3 image key for the user inputted
 * key.
 * @param key - The s3 key that the user wishes to return a compressed
 * image key of.
 * @returns {string} - The s3 key of the compressed image.
 */
export const getCompressedKey = (key: string): string => {
  const arr = key.split("/");
  const compressedKey = [arr[0], "/compressed-", ...arr.slice(1)].join("");
  return compressedKey;
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

/**
 * Function to transform an array of strings into a human readable string.
 * @param array - Array of strings which will be transformed into a human readable
 * string
 */
export const getReadableStringFromArray = (array: string[]): string => {
  return array.length === 1
    ? array[0]
    : [array.slice(0, array.length - 1).join(", "), array[array.length - 1]].join(
        " and ",
      );
};

/**
 * A function to get the minimum possible value for the current chosen
 * products' variants. Will also return a string to notify the customer to request
 * a quote if there is no current price.
 * @param {Variant[]} variants - the variants array for the chosen product.
 * @param {boolean} showMax - value to signify if the maximum product price should be shown
 * the returned string.
 */
export const getProductPrice = (variants: Variant[], showMax = false): string => {
  // set min to infinity/max to -infinity so any first value will change them
  let min = Infinity;
  let max = -Infinity;
  // iterate through the variants of the current product
  variants.forEach((variant) => {
    // set the min value to be the smaller value of the current min or the current variants price
    min = showMax
      ? Math.min(variant.price.item + variant.price.postage, min)
      : Math.min(variant.price.item, min);
    max = Math.max(variant.price.item + variant.price.postage, max);
  });
  /**
   * if min is still infinity, there is no price so notify the user that they
   * need to request a quote; otherwise show the formatted price
   */
  return min === Infinity
    ? "Request for Price"
    : min === max
    ? `£${min.toFixed(2)}`
    : `From £${min.toFixed(2)}${showMax ? ` to £${max.toFixed(2)} incl. P&P` : ""}`;
};

export const checkUserAdmin = async (): Promise<boolean> => {
  const user = await Auth.currentAuthenticatedUser();
  if (user.signInUserSession.accessToken.payload["cognito:groups"].includes("Admin")) {
    return true;
  }
  return false;
};

export const getUserData = async () => {
  const user = await Auth.currentUserInfo();
  return user;
};
