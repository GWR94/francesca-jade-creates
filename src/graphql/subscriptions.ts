// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct {
    onCreateProduct {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct {
    onUpdateProduct {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct {
    onDeleteProduct {
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
