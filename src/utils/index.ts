import { Storage } from "aws-amplify";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import { BasketItemProps } from "../pages/payment/interfaces/Basket.i";
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

export const handleRemoveFromS3 = async (key: string): Promise<void> => {
  try {
    // remove the image from s3 by using the key
    if (key) await Storage.remove(key);
  } catch (err) {
    // if there are any errors log to console
    // FIXME - remove console.error for production
    console.error(err);
  }
};

/**
 * Marks for range/number sliders in Variants component.
 */
export const marks = [
  {
    value: 0,
    label: 0,
  },
  {
    value: 2,
    label: 2,
  },
  {
    value: 4,
    label: 4,
  },
  {
    value: 6,
    label: 6,
  },
  {
    value: 8,
    label: 8,
  },
  {
    value: 10,
    label: 10,
  },
  {
    value: 12,
    label: 12,
  },
  {
    value: 14,
    label: 14,
  },
  {
    value: 16,
    label: 16,
  },
  {
    value: 18,
    label: 18,
  },
  {
    value: 20,
    label: 20,
  },
  {
    value: 22,
    label: 22,
  },
  {
    value: 24,
    label: 24,
  },
  {
    value: 26,
    label: 26,
  },
  {
    value: 28,
    label: 28,
  },
  {
    value: 30,
    label: 30,
  },
  {
    value: 32,
    label: 32,
  },
];

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
  return array.length == 1
    ? array[0]
    : [array.slice(0, array.length - 1).join(", "), array[array.length - 1]].join(
        " and ",
      );
};

/**
 * A function to get the minimum possible value for the current chosen
 * product. Will also return a string to notify the customer to request
 * a quote if there is no current price.
 * @param {BasketItemProps} product - the current product to get the minimum price from
 * @param {boolean} showMax - value to signify if the maximum product price should be shown
 * the returned string.
 */
export const getProductPrice = (
  product: BasketItemProps | ProductProps,
  showMax = false,
): string => {
  // set min to infinity/max to -infinity so any first value will change them
  let min = Infinity;
  let max = -Infinity;
  // iterate through the variants of the current product
  product.variants.forEach((variant) => {
    // set the min value to be the smaller value of the current min or the current variants price
    min = Math.min(variant.price.item + variant.price.postage, min);
    max = Math.max(variant.price.item + variant.price.postage, max);
  });
  /**
   * if min is still infinity, there is no price so notify the user that they
   * need to request a quote; otherwise show the formatted price
   */
  return min === Infinity
    ? "Request for Price"
    : min === max
    ? `£${min.toFixed(2)} incl. P&P`
    : `From £${min.toFixed(2)}${showMax ? ` to £${max.toFixed(2)}` : ""} incl. P&P`;
};
