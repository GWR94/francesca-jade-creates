/* tslint:disable */
/* eslint-disable */
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
      images {
        cover
        collection {
          bucket
          region
          key
        }
      }
      customOptions
      setPrice
      type
      tags
      searchField
      createdAt
      updatedAt
      variants {
        variantName
        instructions
        dimensions
        features {
          name
          inputType
          description
          featureType
          value {
            array
            range
            number
          }
        }
        price {
          item
          postage
        }
        images {
          bucket
          region
          key
        }
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
      images {
        cover
        collection {
          bucket
          region
          key
        }
      }
      customOptions
      setPrice
      type
      tags
      searchField
      createdAt
      updatedAt
      variants {
        variantName
        instructions
        dimensions
        features {
          name
          inputType
          description
          featureType
          value {
            array
            range
            number
          }
        }
        price {
          item
          postage
        }
        images {
          bucket
          region
          key
        }
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
      images {
        cover
        collection {
          bucket
          region
          key
        }
      }
      customOptions
      setPrice
      type
      tags
      searchField
      createdAt
      updatedAt
      variants {
        variantName
        instructions
        dimensions
        features {
          name
          inputType
          description
          featureType
          value {
            array
            range
            number
          }
        }
        price {
          item
          postage
        }
        images {
          bucket
          region
          key
        }
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
          products {
            id
            title
            tagline
            image {
              bucket
              region
              key
            }
            variant {
              variantName
              instructions
              dimensions
              features {
                name
                inputType
                description
                featureType
              }
              price {
                item
                postage
              }
              images {
                bucket
                region
                key
              }
            }
            customOptions
          }
          stripePaymentIntent
          user {
            id
            username
            email
            name
            registered
            orders {
              items {
                id
                stripePaymentIntent
                createdAt
                stripeOrderId
                paymentStatus
                orderProcessed
                shipped
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
              type
              tagline
              variants {
                variantName
                instructions
                dimensions
              }
            }
            trackingInfo
            createdAt
            updatedAt
          }
          shippingAddress {
            city
            country
            address_line1
            address_line2
            address_postcode
          }
          createdAt
          stripeOrderId
          paymentStatus
          orderProcessed
          userInfo {
            emailAddress
            name
          }
          shipped
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
        type
        tagline
        variants {
          variantName
          instructions
          dimensions
          features {
            name
            inputType
            description
            featureType
            value {
              array
              range
              number
            }
          }
          price {
            item
            postage
          }
          images {
            bucket
            region
            key
          }
        }
      }
      trackingInfo
      createdAt
      updatedAt
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
          products {
            id
            title
            tagline
            image {
              bucket
              region
              key
            }
            variant {
              variantName
              instructions
              dimensions
              features {
                name
                inputType
                description
                featureType
              }
              price {
                item
                postage
              }
              images {
                bucket
                region
                key
              }
            }
            customOptions
          }
          stripePaymentIntent
          user {
            id
            username
            email
            name
            registered
            orders {
              items {
                id
                stripePaymentIntent
                createdAt
                stripeOrderId
                paymentStatus
                orderProcessed
                shipped
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
              type
              tagline
              variants {
                variantName
                instructions
                dimensions
              }
            }
            trackingInfo
            createdAt
            updatedAt
          }
          shippingAddress {
            city
            country
            address_line1
            address_line2
            address_postcode
          }
          createdAt
          stripeOrderId
          paymentStatus
          orderProcessed
          userInfo {
            emailAddress
            name
          }
          shipped
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
        type
        tagline
        variants {
          variantName
          instructions
          dimensions
          features {
            name
            inputType
            description
            featureType
            value {
              array
              range
              number
            }
          }
          price {
            item
            postage
          }
          images {
            bucket
            region
            key
          }
        }
      }
      trackingInfo
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      email
      name
      registered
      orders {
        items {
          id
          products {
            id
            title
            tagline
            image {
              bucket
              region
              key
            }
            variant {
              variantName
              instructions
              dimensions
              features {
                name
                inputType
                description
                featureType
              }
              price {
                item
                postage
              }
              images {
                bucket
                region
                key
              }
            }
            customOptions
          }
          stripePaymentIntent
          user {
            id
            username
            email
            name
            registered
            orders {
              items {
                id
                stripePaymentIntent
                createdAt
                stripeOrderId
                paymentStatus
                orderProcessed
                shipped
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
              type
              tagline
              variants {
                variantName
                instructions
                dimensions
              }
            }
            trackingInfo
            createdAt
            updatedAt
          }
          shippingAddress {
            city
            country
            address_line1
            address_line2
            address_postcode
          }
          createdAt
          stripeOrderId
          paymentStatus
          orderProcessed
          userInfo {
            emailAddress
            name
          }
          shipped
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
        type
        tagline
        variants {
          variantName
          instructions
          dimensions
          features {
            name
            inputType
            description
            featureType
            value {
              array
              range
              number
            }
          }
          price {
            item
            postage
          }
          images {
            bucket
            region
            key
          }
        }
      }
      trackingInfo
      createdAt
      updatedAt
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
      products {
        id
        title
        tagline
        image {
          bucket
          region
          key
        }
        variant {
          variantName
          instructions
          dimensions
          features {
            name
            inputType
            description
            featureType
            value {
              array
              range
              number
            }
          }
          price {
            item
            postage
          }
          images {
            bucket
            region
            key
          }
        }
        customOptions
      }
      stripePaymentIntent
      user {
        id
        username
        email
        name
        registered
        orders {
          items {
            id
            products {
              id
              title
              tagline
              image {
                bucket
                region
                key
              }
              variant {
                variantName
                instructions
                dimensions
              }
              customOptions
            }
            stripePaymentIntent
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
                address_postcode
              }
              savedProducts {
                id
                title
                description
                type
                tagline
              }
              trackingInfo
              createdAt
              updatedAt
            }
            shippingAddress {
              city
              country
              address_line1
              address_line2
              address_postcode
            }
            createdAt
            stripeOrderId
            paymentStatus
            orderProcessed
            userInfo {
              emailAddress
              name
            }
            shipped
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
          type
          tagline
          variants {
            variantName
            instructions
            dimensions
            features {
              name
              inputType
              description
              featureType
              value {
                array
                range
                number
              }
            }
            price {
              item
              postage
            }
            images {
              bucket
              region
              key
            }
          }
        }
        trackingInfo
        createdAt
        updatedAt
      }
      shippingAddress {
        city
        country
        address_line1
        address_line2
        address_postcode
      }
      createdAt
      stripeOrderId
      paymentStatus
      orderProcessed
      userInfo {
        emailAddress
        name
      }
      shipped
      updatedAt
    }
  }
`;
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      id
      products {
        id
        title
        tagline
        image {
          bucket
          region
          key
        }
        variant {
          variantName
          instructions
          dimensions
          features {
            name
            inputType
            description
            featureType
            value {
              array
              range
              number
            }
          }
          price {
            item
            postage
          }
          images {
            bucket
            region
            key
          }
        }
        customOptions
      }
      stripePaymentIntent
      user {
        id
        username
        email
        name
        registered
        orders {
          items {
            id
            products {
              id
              title
              tagline
              image {
                bucket
                region
                key
              }
              variant {
                variantName
                instructions
                dimensions
              }
              customOptions
            }
            stripePaymentIntent
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
                address_postcode
              }
              savedProducts {
                id
                title
                description
                type
                tagline
              }
              trackingInfo
              createdAt
              updatedAt
            }
            shippingAddress {
              city
              country
              address_line1
              address_line2
              address_postcode
            }
            createdAt
            stripeOrderId
            paymentStatus
            orderProcessed
            userInfo {
              emailAddress
              name
            }
            shipped
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
          type
          tagline
          variants {
            variantName
            instructions
            dimensions
            features {
              name
              inputType
              description
              featureType
              value {
                array
                range
                number
              }
            }
            price {
              item
              postage
            }
            images {
              bucket
              region
              key
            }
          }
        }
        trackingInfo
        createdAt
        updatedAt
      }
      shippingAddress {
        city
        country
        address_line1
        address_line2
        address_postcode
      }
      createdAt
      stripeOrderId
      paymentStatus
      orderProcessed
      userInfo {
        emailAddress
        name
      }
      shipped
      updatedAt
    }
  }
`;
