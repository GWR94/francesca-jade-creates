/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      createdAt
      updatedAt
      variants {
        dimensions
        features {
          name
          inputType
          featureType
          price {
            item
            postage
          }
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
      createdAt
      updatedAt
      variants {
        dimensions
        features {
          name
          inputType
          featureType
          price {
            item
            postage
          }
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
      createdAt
      updatedAt
      variants {
        dimensions
        features {
          name
          inputType
          featureType
          price {
            item
            postage
          }
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
