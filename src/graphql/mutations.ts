// tslint:disable
// this is an auto generated file. This will be overwritten

export const createProduct = `mutation CreateProduct(
  $input: CreateProductInput!
  $condition: ModelProductConditionInput
) {
  createProduct(input: $input, condition: $condition) {
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
export const updateProduct = `mutation UpdateProduct(
  $input: UpdateProductInput!
  $condition: ModelProductConditionInput
) {
  updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = `mutation DeleteProduct(
  $input: DeleteProductInput!
  $condition: ModelProductConditionInput
) {
  deleteProduct(input: $input, condition: $condition) {
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
export const registerUser = `mutation RegisterUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  registerUser(input: $input, condition: $condition) {
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
  }
}
`;
export const updateUser = `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
  }
}
`;
export const createOrder = `mutation CreateOrder(
  $input: CreateOrderInput!
  $condition: ModelOrderConditionInput
) {
  createOrder(input: $input, condition: $condition) {
    id
    product {
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
    user {
      id
      username
      email
      name
      registered
      admin
      orders {
        nextToken
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
  }
}
`;
