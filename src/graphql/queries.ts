// tslint:disable
// this is an auto generated file. This will be overwritten

export const getProduct = `query GetProduct($id: ID!) {
  getProduct(id: $id) {
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
export const listProducts = `query ListProducts(
  $filter: ModelProductFilterInput
  $limit: Int
  $nextToken: String
) {
  listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    email
    name
    registered
    admin
    orders {
      items {
        id
        createdAt
      }
      nextToken
    }
    profileImage {
      bucket
      region
      key
    }
    shippingAddress {
      city
      country
      address_line1
      address_line2
      address_county
      address_postcode
    }
  }
}
`;
export const searchProducts = `query SearchProducts(
  $filter: SearchableProductFilterInput
  $sort: SearchableProductSortInput
  $limit: Int
  $nextToken: String
) {
  searchProducts(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    total
  }
}
`;
