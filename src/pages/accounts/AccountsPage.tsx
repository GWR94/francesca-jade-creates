import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Container, Tabs, Tab, Typography } from "@material-ui/core";
import {
  AccountCircleTwoTone,
  ShoppingCartTwoTone,
  CreateTwoTone,
} from "@material-ui/icons";
import { listProducts } from "../../graphql/queries";
import Profile from "./components/Profile";
import ProductsList from "./components/ProductsList";
import {
  onUpdateProduct,
  onCreateProduct,
  onDeleteProduct,
} from "../../graphql/subscriptions";
import Loading from "../../common/Loading";
import { AccountsProps, AccountsState } from "./interfaces/Accounts.i";
import UpdateProduct from "./components/UpdateProduct";

const initialState: AccountsState = {
  products: [],
  isLoading: true,
  currentTab: "profile",
};
class AccountsPage extends Component<AccountsProps, AccountsState> {
  public readonly state = initialState;

  private updateProductListener;
  private deleteProductListener;
  private createProductListener;

  public async componentDidMount(): Promise<void> {
    const { accountsTab, admin } = this.props;
    await this.handleGetProducts();
    if (admin) {
      await this.handleSubscriptions();
    }
    this.setState({ isLoading: false });
    if (accountsTab) this.setState({ currentTab: accountsTab });
  }

  public componentWillUnmount(): void {
    this.updateProductListener?.unsubscribe();
    this.deleteProductListener?.unsubscribe();
    this.createProductListener?.unsubscribe();
  }

  private handleGetProducts = async (): Promise<void> => {
    const { data } = await API.graphql(graphqlOperation(listProducts, { limit: 200 }));
    const products = data?.listProducts?.items ?? [];
    this.setState({ products, isLoading: false });
  };

  private handleSubscriptions = async (): Promise<void> => {
    const { user } = this.props;
    const {
      attributes: { sub },
    } = user;

    this.createProductListener = API.graphql(
      graphqlOperation(onCreateProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const { products } = this.state;
        const createdProduct = productData.value.data.onCreateProduct;
        const prevProducts = products
          ? products.filter((item): boolean => item.id !== createdProduct.id)
          : [];
        const updatedProducts = [createdProduct, ...prevProducts];
        return this.setState({ products: updatedProducts });
      },
    });

    this.updateProductListener = API.graphql(
      graphqlOperation(onUpdateProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const { products } = this.state;
        const updatedProduct = productData.value.data.onUpdateProduct;
        const updatedProductIdx = products.findIndex(
          (item): boolean => item.id === updatedProduct.id,
        );
        const updatedProducts = [
          ...products.slice(0, updatedProductIdx),
          updatedProduct,
          ...products.slice(updatedProductIdx + 1),
        ];
        return this.setState({ products: updatedProducts });
      },
    });

    this.deleteProductListener = API.graphql(
      graphqlOperation(onDeleteProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const { products } = this.state;
        const deletedProduct = productData.value.data.onDeleteProduct;
        const updatedProducts = products
          ? products.filter((item): boolean => item.id !== deletedProduct.id)
          : [];
        return this.setState({ products: updatedProducts });
      },
    });
  };

  public render(): JSX.Element {
    const { isLoading, currentTab, products } = this.state;
    const { admin, history, user, userAttributes } = this.props;
    return isLoading ? (
      <Loading size={100} />
    ) : (
      <div className="content-container">
        <Container>
          <Tabs
            value={currentTab}
            onChange={(e, newValue): void => {
              this.setState({ currentTab: newValue });
            }}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab icon={<AccountCircleTwoTone />} label="Profile" value="profile" />
            {admin ? (
              [
                <Tab
                  icon={<ShoppingCartTwoTone />}
                  label="Products"
                  key={1}
                  value="products"
                />,
                <Tab icon={<CreateTwoTone />} label="Create" key={2} value="create" />,
              ]
            ) : (
              <Tab icon={<ShoppingCartTwoTone />} label="My Orders" value="orders" />
            )}
          </Tabs>
          {currentTab === "profile" && (
            <Profile user={user} userAttributes={userAttributes} admin={admin} />
          )}
          {currentTab === "products" && (
            <>
              <div className="profile__container">
                <Typography variant="h4">Current Products</Typography>
                <Typography style={{ textAlign: "center", margin: "5px 0" }}>
                  Here are a list of all of the products that customers can see when
                  browsing the site.
                </Typography>
                <Typography style={{ textAlign: "center", margin: "5px 0 20px" }}>
                  To edit or delete products, click the 3 dots on the item you wish to
                  change and click the relevant choice.
                </Typography>
              </div>
              <ProductsList history={history} products={products} admin={admin} />
            </>
          )}
          {currentTab === "create" && (
            <UpdateProduct
              history={history}
              setCurrentTab={(currentTab): void => this.setState({ currentTab })}
            />
          )}
        </Container>
      </div>
    );
  }
}

export default AccountsPage;
