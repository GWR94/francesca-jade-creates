export interface VariantsProps {
  variants: Variant[]; // array of variants passed to the component
  classes: {
    // set of styles (jss)
    [key: string]: string;
  };
  // the type of product passed from parent
  type: "Cake" | "Creates";
  // boolean value to signify if there is a set price for product/variant
  setPrice: boolean;
  // size of inputs (smaller should be set for mobile)
  size: "small" | "medium";
  // function to update all variants in parent
  updateVariants: (variants: Variant[]) => void;
}

export interface UpdateVariantProps {
  dimensions: string;
  price: {
    item: number;
    postage: number;
  };
  features: Feature[];
  variantName: string;
  instructions: string;
  variantIdx: number | null;
}

export interface Feature {
  name: string; // the name of the feature set by admin
  featureType: FeatureType; // see FeatureType interface below
  inputType: InputType; // see InputType interface below
  // only one of the three values should hold a value at one time
  value: {
    range?: number[]; // the range set by the admin
    number?: number; // the number set by the admin
    array?: string[]; // the array of values set by the admin
  };
  description?: string; // the description set by the admin
}

export interface VariantsState {
  // variant dimensions in cm
  dimensions: string;
  // variant price
  price: {
    item: number;
    postage: number;
  };
  // the index of the current selected variant
  currentIdx: number;
  // array for holding current variants features
  features: Feature[];
  // the name of the current variant
  variantName: string;
  // object for tracking each inputs' errors
  errors: {
    variantName: string;
    dimensions: string;
    priceItem: string;
    priceShipping: string;
    instructions: string;
  };
  // the index of the selected variant
  variantIdx: number | null;
  // instructions set by the admin user for the current variant
  instructions: string;
  // the index of the selected feature
  featureIdx: number | null;
  // the description of the current feature.
  featureDesc: string;
}

// the type of the input which will be returned base on this input
export type FeatureType =
  | "images" // the user uploads an image - ImagePicker component will render
  | "text" // the user inputs text - text field will be rendered
  | "other" // the user picks from a set of values - select input will be rendered
  | "dropdown" // same as above - should be removed // FIXME
  | string;

// the value expected to be returned from the input
export type InputType =
  | "number" // expect a number to be returned
  | "range" // expect an array (two different numbers) to be returned
  | "array" // expect an array to be returned.
  | string;

export interface Variant {
  dimensions: string; // dimensions of the variant in cm
  price: {
    item: number; // the cost of the variant
    postage: number; // the postage cost of variant
  };
  features: Feature[]; // array of features in the variant
  variantName: string; // the name of the variant
  instructions: string; // instructions for the current variant
}
