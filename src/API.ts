/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateProductInput = {
  id?: string | null,
  title: string,
  description: string,
  image: Array< S3ObjectInput | null >,
  price: number,
  shippingCost: number,
  type: string,
  tags?: Array< string | null > | null,
  _version?: number | null,
};

export type S3ObjectInput = {
  bucket: string,
  region: string,
  key: string,
};

export type ModelProductConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  price?: ModelFloatInput | null,
  shippingCost?: ModelFloatInput | null,
  type?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  and?: Array< ModelProductConditionInput | null > | null,
  or?: Array< ModelProductConditionInput | null > | null,
  not?: ModelProductConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateProductInput = {
  id: string,
  title?: string | null,
  description?: string | null,
  image?: Array< S3ObjectInput | null > | null,
  price?: number | null,
  shippingCost?: number | null,
  type?: string | null,
  tags?: Array< string | null > | null,
  _version?: number | null,
};

export type DeleteProductInput = {
  id?: string | null,
  _version?: number | null,
};

export type CreateUserInput = {
  id?: string | null,
  username: string,
  email: string,
  name?: string | null,
  registered?: boolean | null,
  profileImage?: S3ObjectInput | null,
  shippingAddress?: ShippingAddressInput | null,
  _version?: number | null,
};

export type ShippingAddressInput = {
  city: string,
  country: string,
  address_line1: string,
  address_line2?: string | null,
  address_county: string,
  address_postcode: string,
};

export type ModelUserConditionInput = {
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  registered?: ModelBooleanInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateUserInput = {
  id: string,
  username?: string | null,
  email?: string | null,
  name?: string | null,
  registered?: boolean | null,
  profileImage?: S3ObjectInput | null,
  shippingAddress?: ShippingAddressInput | null,
  _version?: number | null,
};

export type CreateOrderInput = {
  id?: string | null,
  product?: ProductInput | null,
  user?: UserInput | null,
  shippingAddress?: ShippingAddressInput | null,
  createdAt: string,
  _version?: number | null,
  orderProductId?: string | null,
  orderUserId?: string | null,
};

export type ProductInput = {
  id: string,
  title: string,
  description: string,
  image: Array< S3ObjectInput | null >,
  price: number,
  shippingCost: number,
  type: string,
  tags?: Array< string | null > | null,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UserInput = {
  id: string,
  username: string,
  email: string,
  name?: string | null,
  registered?: boolean | null,
  profileImage?: S3ObjectInput | null,
  shippingAddress?: ShippingAddressInput | null,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelOrderConditionInput = {
  createdAt?: ModelStringInput | null,
  and?: Array< ModelOrderConditionInput | null > | null,
  or?: Array< ModelOrderConditionInput | null > | null,
  not?: ModelOrderConditionInput | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  registered?: ModelBooleanInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelOrderFilterInput = {
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelOrderFilterInput | null > | null,
  or?: Array< ModelOrderFilterInput | null > | null,
  not?: ModelOrderFilterInput | null,
};

export type ModelProductFilterInput = {
  id?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  price?: ModelFloatInput | null,
  shippingCost?: ModelFloatInput | null,
  type?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  and?: Array< ModelProductFilterInput | null > | null,
  or?: Array< ModelProductFilterInput | null > | null,
  not?: ModelProductFilterInput | null,
};

export type SearchableProductFilterInput = {
  id?: SearchableStringFilterInput | null,
  title?: SearchableStringFilterInput | null,
  description?: SearchableStringFilterInput | null,
  price?: SearchableFloatFilterInput | null,
  shippingCost?: SearchableFloatFilterInput | null,
  type?: SearchableStringFilterInput | null,
  tags?: SearchableStringFilterInput | null,
  and?: Array< SearchableProductFilterInput | null > | null,
  or?: Array< SearchableProductFilterInput | null > | null,
  not?: SearchableProductFilterInput | null,
};

export type SearchableStringFilterInput = {
  ne?: string | null,
  gt?: string | null,
  lt?: string | null,
  gte?: string | null,
  lte?: string | null,
  eq?: string | null,
  match?: string | null,
  matchPhrase?: string | null,
  matchPhrasePrefix?: string | null,
  multiMatch?: string | null,
  exists?: boolean | null,
  wildcard?: string | null,
  regexp?: string | null,
};

export type SearchableFloatFilterInput = {
  ne?: number | null,
  gt?: number | null,
  lt?: number | null,
  gte?: number | null,
  lte?: number | null,
  eq?: number | null,
  range?: Array< number | null > | null,
};

export type SearchableProductSortInput = {
  field?: SearchableProductSortableFields | null,
  direction?: SearchableSortDirection | null,
};

export enum SearchableProductSortableFields {
  id = "id",
  title = "title",
  description = "description",
  price = "price",
  shippingCost = "shippingCost",
  type = "type",
  tags = "tags",
}


export enum SearchableSortDirection {
  asc = "asc",
  desc = "desc",
}


export type CreateProductMutationVariables = {
  input: CreateProductInput,
  condition?: ModelProductConditionInput | null,
};

export type CreateProductMutation = {
  createProduct:  {
    __typename: "Product",
    id: string,
    title: string,
    description: string,
    image:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null >,
    price: number,
    shippingCost: number,
    type: string,
    tags: Array< string | null > | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateProductMutationVariables = {
  input: UpdateProductInput,
  condition?: ModelProductConditionInput | null,
};

export type UpdateProductMutation = {
  updateProduct:  {
    __typename: "Product",
    id: string,
    title: string,
    description: string,
    image:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null >,
    price: number,
    shippingCost: number,
    type: string,
    tags: Array< string | null > | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteProductMutationVariables = {
  input: DeleteProductInput,
  condition?: ModelProductConditionInput | null,
};

export type DeleteProductMutation = {
  deleteProduct:  {
    __typename: "Product",
    id: string,
    title: string,
    description: string,
    image:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null >,
    price: number,
    shippingCost: number,
    type: string,
    tags: Array< string | null > | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type RegisterUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type RegisterUserMutation = {
  registerUser:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    name: string | null,
    registered: boolean | null,
    orders:  {
      __typename: "ModelOrderConnection",
      items:  Array< {
        __typename: "Order",
        id: string,
        createdAt: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
      } | null > | null,
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    profileImage:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null,
    shippingAddress:  {
      __typename: "ShippingAddress",
      city: string,
      country: string,
      address_line1: string,
      address_line2: string | null,
      address_county: string,
      address_postcode: string,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    name: string | null,
    registered: boolean | null,
    orders:  {
      __typename: "ModelOrderConnection",
      items:  Array< {
        __typename: "Order",
        id: string,
        createdAt: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
      } | null > | null,
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    profileImage:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null,
    shippingAddress:  {
      __typename: "ShippingAddress",
      city: string,
      country: string,
      address_line1: string,
      address_line2: string | null,
      address_county: string,
      address_postcode: string,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateOrderMutationVariables = {
  input: CreateOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type CreateOrderMutation = {
  createOrder:  {
    __typename: "Order",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      name: string | null,
      registered: boolean | null,
      orders:  {
        __typename: "ModelOrderConnection",
        nextToken: string | null,
        startedAt: number | null,
      } | null,
      profileImage:  {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null,
      shippingAddress:  {
        __typename: "ShippingAddress",
        city: string,
        country: string,
        address_line1: string,
        address_line2: string | null,
        address_county: string,
        address_postcode: string,
      } | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    shippingAddress:  {
      __typename: "ShippingAddress",
      city: string,
      country: string,
      address_line1: string,
      address_line2: string | null,
      address_county: string,
      address_postcode: string,
    } | null,
    createdAt: string,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    product:  {
      __typename: "Product",
      id: string,
      title: string,
      description: string,
      image:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null >,
      price: number,
      shippingCost: number,
      type: string,
      tags: Array< string | null > | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
  } | null,
};

export type SyncUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUsersQuery = {
  syncUsers:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      name: string | null,
      registered: boolean | null,
      orders:  {
        __typename: "ModelOrderConnection",
        nextToken: string | null,
        startedAt: number | null,
      } | null,
      profileImage:  {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null,
      shippingAddress:  {
        __typename: "ShippingAddress",
        city: string,
        country: string,
        address_line1: string,
        address_line2: string | null,
        address_county: string,
        address_postcode: string,
      } | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    name: string | null,
    registered: boolean | null,
    orders:  {
      __typename: "ModelOrderConnection",
      items:  Array< {
        __typename: "Order",
        id: string,
        createdAt: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
      } | null > | null,
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    profileImage:  {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null,
    shippingAddress:  {
      __typename: "ShippingAddress",
      city: string,
      country: string,
      address_line1: string,
      address_line2: string | null,
      address_county: string,
      address_postcode: string,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type SyncOrdersQueryVariables = {
  filter?: ModelOrderFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncOrdersQuery = {
  syncOrders:  {
    __typename: "ModelOrderConnection",
    items:  Array< {
      __typename: "Order",
      id: string,
      user:  {
        __typename: "User",
        id: string,
        username: string,
        email: string,
        name: string | null,
        registered: boolean | null,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
      } | null,
      shippingAddress:  {
        __typename: "ShippingAddress",
        city: string,
        country: string,
        address_line1: string,
        address_line2: string | null,
        address_county: string,
        address_postcode: string,
      } | null,
      createdAt: string,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      product:  {
        __typename: "Product",
        id: string,
        title: string,
        description: string,
        price: number,
        shippingCost: number,
        type: string,
        tags: Array< string | null > | null,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
      } | null,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type ListProductsQueryVariables = {
  filter?: ModelProductFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProductsQuery = {
  listProducts:  {
    __typename: "ModelProductConnection",
    items:  Array< {
      __typename: "Product",
      id: string,
      title: string,
      description: string,
      image:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null >,
      price: number,
      shippingCost: number,
      type: string,
      tags: Array< string | null > | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type GetProductQueryVariables = {
  id: string,
};

export type GetProductQuery = {
  getProduct:  {
    __typename: "Product",
    id: string,
    title: string,
    description: string,
    image:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null >,
    price: number,
    shippingCost: number,
    type: string,
    tags: Array< string | null > | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type SearchProductsQueryVariables = {
  filter?: SearchableProductFilterInput | null,
  sort?: SearchableProductSortInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SearchProductsQuery = {
  searchProducts:  {
    __typename: "SearchableProductConnection",
    items:  Array< {
      __typename: "Product",
      id: string,
      title: string,
      description: string,
      image:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null >,
      price: number,
      shippingCost: number,
      type: string,
      tags: Array< string | null > | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    total: number | null,
  } | null,
};

export type SyncProductsQueryVariables = {
  filter?: ModelProductFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncProductsQuery = {
  syncProducts:  {
    __typename: "ModelProductConnection",
    items:  Array< {
      __typename: "Product",
      id: string,
      title: string,
      description: string,
      image:  Array< {
        __typename: "S3Object",
        bucket: string,
        region: string,
        key: string,
      } | null >,
      price: number,
      shippingCost: number,
      type: string,
      tags: Array< string | null > | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type OnCreateProductSubscription = {
  onCreateProduct:  {
    __typename: "Product",
    id: string,
    title: string,
    description: string,
    image:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null >,
    price: number,
    shippingCost: number,
    type: string,
    tags: Array< string | null > | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateProductSubscription = {
  onUpdateProduct:  {
    __typename: "Product",
    id: string,
    title: string,
    description: string,
    image:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null >,
    price: number,
    shippingCost: number,
    type: string,
    tags: Array< string | null > | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteProductSubscription = {
  onDeleteProduct:  {
    __typename: "Product",
    id: string,
    title: string,
    description: string,
    image:  Array< {
      __typename: "S3Object",
      bucket: string,
      region: string,
      key: string,
    } | null >,
    price: number,
    shippingCost: number,
    type: string,
    tags: Array< string | null > | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};
