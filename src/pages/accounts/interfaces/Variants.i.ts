export interface VariantsProps {
  variants: Variant[];
  classes: {
    [key: string]: string;
  };
  type: "Cake" | "Creates";
  setPrice: boolean;
  updateVariants: (variants: Variant[]) => void;
}

export interface Feature {
  name: string;
  featureType: FeatureType;
  inputType: InputType;
  value: {
    range?: number[];
    number?: number;
    array?: string[];
  };
}

export interface VariantsState {
  dimensions: string;
  price: {
    item: number;
    postage: number;
  };
  range: number[];
  array: string[];
  name: string;
  inputType: InputType;
  featureType: FeatureType;
  number: number;
  current: number;
  features: Feature[];
  variantName: string;
  errors: {
    [key: string]: string;
  };
  isEditing: number | null;
  instructions: string;
}

export type FeatureType = "images" | "text" | "other" | "";

export type InputType = "number" | "range" | "array" | "";

export interface Variant {
  dimensions: string;
  price: {
    item: number;
    postage: number;
  };
  features: Feature[];
  variantName: string;
  instructions: string;
}
