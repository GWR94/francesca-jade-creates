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

export const createsProduct = {
  id: "3e743155-95e2-4ae4-8d70-eb5cb2d0c086",
  title: "Name Frame",
  description: "test test test test test test test test test test",
  image: [
    {
      bucket: "fjadecreatesmedia121747-production",
      region: "eu-west-2",
      key:
        "/public/eu-west-2:1f7a6231-22c8-459a-a078-69ef91991a5e/1584106241635-IMG_0299.JPEG",
    },
    {
      bucket: "fjadecreatesmedia121747-production",
      region: "eu-west-2",
      key:
        "/public/eu-west-2:1f7a6231-22c8-459a-a078-69ef91991a5e/1584106241635-IMG_0299.JPEG",
    },
    {
      bucket: "fjadecreatesmedia121747-production",
      region: "eu-west-2",
      key:
        "/public/eu-west-2:1f7a6231-22c8-459a-a078-69ef91991a5e/1584106268144-IMG_0305.JPEG",
    },
  ],
  price: 14.5,
  shippingCost: 4.5,
  type: "Creates",
  tags: ["Personalised", "Name", "Frame"],
  createdAt: "2020-03-09T12:51:52.637Z",
  updatedAt: "2020-03-20T14:24:14.718Z",
  setPrice: true,
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
