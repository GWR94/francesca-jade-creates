import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Container } from "reactstrap";
import { listProducts } from "../../graphql/queries";
import Profile from "./components/Profile";
import ProductsList from "./components/ProductsList";
import background from "../../img/background.jpg";
import {
  onUpdateProduct,
  onCreateProduct,
  onDeleteProduct,
} from "../../graphql/subscriptions";
import Loading from "../../common/Loading";
import { AccountsProps, AccountsState } from "./interfaces/Accounts.i";
import UpdateProduct from "./components/EditProduct";

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
    const { accountsTab } = this.props;
    await this.handleGetProducts();
    await this.handleSubscriptions();
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
    const products = data.listProducts.items;
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

  private getCurrentPage = (): JSX.Element => {
    const { products, currentTab } = this.state;
    const { userAttributes, user, admin, history } = this.props;

    switch (currentTab) {
      case "profile": {
        return <Profile user={user} userAttributes={userAttributes} admin={admin} />;
      }
      case "products":
        return <ProductsList products={products} admin={admin} />;
      case "create":
        return (
          <UpdateProduct
            history={history}
            setCurrentTab={(currentTab): void => this.setState({ currentTab })}
          />
        );
      default:
        return <Loading />;
    }
  };

  public render(): JSX.Element {
    const { isLoading, currentTab } = this.state;
    const { admin } = this.props;
    return isLoading ? (
      <Loading size={100} />
    ) : (
      <div
        style={{
          background: `url(${background}) no-repeat center center fixed`,
        }}
      >
        <Container className="content-container">
          <div className="accounts__tab-container">
            <div
              className={
                currentTab === "profile" ? "accounts__tab--active" : "accounts__tab"
              }
              onClick={(): void => this.setState({ currentTab: "profile" })}
              role="button"
              tabIndex={0}
            >
              <i className="fas fa-user-circle" />
              <span style={{ marginLeft: "5px" }}>Profile</span>
            </div>
            {admin ? (
              <>
                <div
                  className={
                    currentTab === "products" ? "accounts__tab--active" : "accounts__tab"
                  }
                  onClick={(): void => this.setState({ currentTab: "products" })}
                  role="button"
                  tabIndex={0}
                >
                  <i className="fas fa-clipboard" />
                  <span style={{ marginLeft: "5px" }}>Products</span>
                </div>
                <div
                  className={
                    currentTab === "create" ? "accounts__tab--active" : "accounts__tab"
                  }
                  onClick={(): void => this.setState({ currentTab: "create" })}
                  role="button"
                  tabIndex={0}
                >
                  <i className="fas fa-plus-circle" />
                  <span style={{ marginLeft: "5px" }}>Create</span>
                </div>
              </>
            ) : (
              <div
                className={
                  currentTab === "create" ? "accounts__tab--active" : "accounts__tab"
                }
                onClick={(): void => this.setState({ currentTab: "orders" })}
                role="button"
                tabIndex={0}
              >
                <i className="fas fa-shopping-basket" />
                <span style={{ marginLeft: "5px" }}>My Orders</span>
              </div>
            )}
          </div>
          {this.getCurrentPage()}
        </Container>
      </div>
    );
  }
}

export default AccountsPage;
