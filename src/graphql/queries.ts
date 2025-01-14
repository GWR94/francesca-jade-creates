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
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
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
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
                customOptions
              }
              stripePaymentIntent
              user {
                id
                username
                email
                name
                registered
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
      nextToken
    }
  }
`;
