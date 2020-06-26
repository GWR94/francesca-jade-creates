/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      name
      registered
      orders {
        items {
          id
          createdAt
          updatedAt
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
      savedProducts {
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
      }
      createdAt
      updatedAt
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        tagline
        image {
          bucket
          region
          key
        }
        price
        shippingCost
        type
        tags
        createdAt
        updatedAt
        customFeatures {
          expectedImages
          text
          expectedText
        }
      }
      nextToken
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      title
      description
      tagline
      image {
        bucket
        region
        key
      }
      price
      shippingCost
      type
      tags
      createdAt
      updatedAt
      customFeatures {
        images {
          bucket
          region
          key
        }
        expectedImages
        text
        expectedText
      }
    }
  }
`;
export const searchProducts = /* GraphQL */ `
  query SearchProducts(
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
        tagline
        image {
          bucket
          region
          key
        }
        price
        shippingCost
        type
        tags
        createdAt
        updatedAt
        customFeatures {
          expectedImages
          text
          expectedText
        }
      }
      nextToken
      total
    }
  }
`;
