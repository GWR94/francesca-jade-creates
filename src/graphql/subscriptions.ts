// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateProduct = `subscription OnCreateProduct($owner: String!) {
  onCreateProduct(owner: $owner) {
    id
    title
    description
    image {
      bucket
      region
      key
    }
    price
    shippingCost
    type
    tags
    owner
  }
}
`;
export const onUpdateProduct = `subscription OnUpdateProduct($owner: String!) {
  onUpdateProduct(owner: $owner) {
    id
    title
    description
    image {
      bucket
      region
      key
    }
    price
    shippingCost
    type
    tags
    owner
  }
}
`;
export const onDeleteProduct = `subscription OnDeleteProduct($owner: String!) {
  onDeleteProduct(owner: $owner) {
    id
    title
    description
    image {
      bucket
      region
      key
    }
    price
    shippingCost
    type
    tags
    owner
  }
}
`;
