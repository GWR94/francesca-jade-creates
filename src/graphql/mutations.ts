// tslint:disable
// this is an auto generated file. This will be overwritten

export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
export const registerUser = /* GraphQL */ `
  mutation RegisterUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    registerUser(input: $input, condition: $condition) {
      id
      username
      email
      name
      registered
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
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      email
      name
      registered
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
    }
  }
`;
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      user {
        id
        username
        email
        name
        registered
        orders {
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
          price
          shippingCost
          type
        }
      }
      shippingAddress {
        city
        country
        address_line1
        address_line2
        address_county
        address_postcode
      }
      createdAt
      product {
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
    }
  }
`;
