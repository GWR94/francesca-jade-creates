/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder {
    onCreateOrder {
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
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder {
    onUpdateOrder {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct {
    onCreateProduct {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct {
    onUpdateProduct {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct {
    onDeleteProduct {
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
