import {
  BasketItemProps,
  CheckoutProductProps,
} from "../pages/payment/interfaces/Basket.i";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";

export const cakeProduct: ProductProps = {
  id: "8c01cf0d-9de5-4168-8143-73e1ea067ac9",
  title: "Racing Cake",
  description: "Test test test test test test",
  tagline: "Racing birthday cake!",
  images: {
    cover: 1,
    collection: [
      {
        bucket: "francescajadecreatesimages102644-staging",
        region: "eu-west-2",
        key: "products/1608555324518-IMG_8831.JPEG",
      },
      {
        bucket: "francescajadecreatesimages102644-staging",
        region: "eu-west-2",
        key: "products/1608555338248-IMG_8829.JPEG",
      },
      {
        bucket: "francescajadecreatesimages102644-staging",
        key: "products/1608555349571-IMG_8841.JPEG",
        region: "eu-west-2",
      },
    ],
  },
  customOptions: ["Chocolate", "Oreo", "Cadburys"],
  setPrice: false,
  type: "Cake",
  variants: [],
  tags: ["Cake", "Racing"],
};

export const createsProduct: ProductProps = {
  customOptions: ["Solid Colour (add comment)"],
  description:
    "<p>Ut vestibulum lorem nibh, varius finibus urna rhoncus porta. Nunc vel ex purus. Donec convallis tristique lorem condimentum cursus. Mauris euismod placerat lacinia. Vestibulum vel eleifend magna. Integer vitae mauris vel diam facilisis posuere. Nulla ullamcorper sit amet purus non tincidunt. Morbi luctus vel magna ut mollis.</p>↵<p>Proin tincidunt pretium lectus nec luctus. Mauris tincidunt lorem lacus, non cursus nisi volutpat sit amet. Integer vel est turpis. Phasellus et posuere ipsum. Maecenas lectus ipsum, dignissim in neque sed, convallis cursus nulla. Quisque bibendum cursus luctus. Sed justo enim, volutpat a commodo sed, vestibulum at augue. Praesent dignissim elementum elit, et bibendum risus bibendum sit amet. Suspendisse potenti.</p>",
  id: "456539fc-d8a9-483b-a33c-9795b402cc32",
  images: {
    cover: 0,
    collection: [
      {
        bucket: "francescajadecreatesimages102644-staging",
        key: "products/1605189587805-IMG_0102.JPG",
        region: "eu-west-2",
      },
    ],
  },
  setPrice: true,
  tagline: "Celebrate someones special day with a personalised wedding frame!",
  tags: ["Wedding", "Love", "Memory", "Personal"],
  title: "Wedding Day Frame",
  type: "Creates",
  variants: [
    {
      dimensions: "23cm x 23cm (White Frame)",
      features: [
        {
          description: undefined,
          featureType: "images",
          inputType: "number",
          name: "Images",
          value: { array: undefined, range: undefined, number: 1 },
        },
        {
          description:
            "Please enter the couples' names in the way you wish for it to be shown - e.g Mr & Mrs Bloggs or Jill & Jim Bloggs.",
          featureType: "text",
          inputType: "number",
          name: "Couples' Names",
          value: { array: undefined, range: undefined, number: 1 },
        },
      ],
      instructions: "",
      price: { item: 22, postage: 4.99 },
      variantName: "",
    },
  ],
};

export const createsBasketOne: BasketItemProps = {
  id: "123",
  title: "test",
  tagline: "test tagline",
  variants: [],
  description: "test desc",
  image: {
    bucket: "francescajadecreatesimages102644-staging",
    key: "products/1605189587805-IMG_0102.JPG",
    region: "eu-west-2",
  },
  customOptions: ["red", "yellow", "green"],
  type: "Creates",
};

export const createsCheckoutOne: CheckoutProductProps = {
  id: "123",
  title: "test",
  tagline: "test tagline",
  variant: {
    dimensions: "20cm x 20cm",
    variantName: "Square Frame",
    price: {
      item: 20,
      postage: 5,
    },
    features: [],
    instructions: "test instructions",
  },
  image: {
    bucket: "francescajadecreatesimages102644-staging",
    key: "products/1605189587805-IMG_0102.JPG",
    region: "eu-west-2",
  },
  customOptions: [{ inputType: "number" }, { featureType: "range" }],
};

export const createsCheckoutTwo: CheckoutProductProps = {
  id: "321",
  title: "test two",
  tagline: "test tagline two",
  variant: {
    dimensions: "20cm x 20cm",
    variantName: "Square Frame two",
    price: {
      item: 10,
      postage: 5,
    },
    features: [],
    instructions: "test instructions two",
  },
  image: {
    bucket: "francescajadecreatesimages102644-staging",
    key: "products/1605189587805-IMG_0102.JPG",
    region: "eu-west-2",
  },
  customOptions: [{ inputType: "number" }, { featureType: "range" }],
};

export const createsBasketTwo: BasketItemProps = {
  id: "321",
  title: "test product two",
  tagline: "test tagline two",
  variants: [],
  description: "test desc two",
  image: {
    bucket: "francescajadecreatesimages102644-staging",
    key: "products/1605189587805-IMG_0102.JPG",
    region: "eu-west-2",
  },
  customOptions: ["orange", "pink", "purple"],
  type: "Creates",
};

export const createsBasketThree: BasketItemProps = {
  id: "987",
  title: "test product three",
  tagline: "test tagline three",
  variants: [],
  description: "test desc three",
  image: {
    bucket: "francescajadecreatesimages102644-staging",
    key: "products/1605189587805-IMG_0102.JPG",
    region: "eu-west-2",
  },
  customOptions: ["orange", "green", "blue"],
  type: "Creates",
};

export const userAttributes = {
  sub: "testsub123123abc",
  identities: null,
  email_verified: true,
  name: "James Gower",
  phone_number_verified: false,
  phone_number: "+12345678910",
  email: "test@test.com",
};
