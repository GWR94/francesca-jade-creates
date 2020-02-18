import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { withRouter } from "react-router-dom";
import { listProducts } from "../../graphql/queries";
import NewProduct from "./components/NewProduct";
import Profile from "./components/Profile";
import Products from "./components/ProductsList";
import background from "../../img/background.jpg";
import {
  onUpdateProduct,
  onCreateProduct,
  onDeleteProduct,
} from "../../graphql/subscriptions";
import Loading from "../../common/Loading";
import { AccountsProps, AccountsState } from "./interfaces/Accounts.i";

interface Props {
  page: string;
}

class AccountsPage extends Component<AccountsProps, AccountsState> {
  public readonly state: AccountsState = {
    products: [],
    isLoading: true,
    currentTab: "profile",
  };

  private updateProductListener;

  private deleteProductListener;

  private createProductListener;

  public async componentDidMount(): Promise<void> {
    await this.handleGetProducts();

    const { products } = this.state;
    const { user, accountsTab } = this.props;
    const {
      attributes: { sub },
    } = user;

    if (accountsTab) this.setState({ currentTab: accountsTab });

    this.createProductListener = API.graphql(
      graphqlOperation(onCreateProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const createdProduct = productData.value.data.onCreateProduct;
        const prevProducts = products
          ? products.filter((item): boolean => item.id !== createdProduct.id)
          : [];
        const updatedProducts = [createdProduct, ...prevProducts];
        this.setState({ products: updatedProducts });
      },
    });

    this.updateProductListener = API.graphql(
      graphqlOperation(onUpdateProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const updatedProduct = productData.value.data.onUpdateProduct;
        console.log(products);
        const updatedProductIdx = products.findIndex(
          (item): boolean => item.id === updatedProduct.id,
        );
        const updatedProducts = [
          ...products.slice(0, updatedProductIdx),
          updatedProduct,
          ...products.slice(updatedProductIdx + 1),
        ];
        this.setState({ products: updatedProducts });
      },
    });

    this.deleteProductListener = API.graphql(
      graphqlOperation(onDeleteProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const deletedProduct = productData.value.data.onDeleteProduct;
        const updatedProducts = products
          ? products.filter((item): boolean => item.id !== deletedProduct.id)
          : [];
        this.setState({ products: updatedProducts });
      },
    });
  }

  public componentWillUnmount(): void {
    this.updateProductListener?.unsubscribe();
    this.deleteProductListener?.unsubscribe();
    this.createProductListener?.unsubscribe();
  }

  private getCurrentPage = (): JSX.Element => {
    const { products, currentTab } = this.state;
    const { userAttributes, user } = this.props;
    switch (currentTab) {
      case "profile":
        return <Profile user={user} userAttributes={userAttributes} />;
      case "products":
        return <Products products={products} />;
      case "create":
        return (
          <NewProduct onCancel={(): void => this.setState({ currentTab: "products" })} />
        );
      default:
        return null;
    }
  };

  private handleGetProducts = async (): Promise<void> => {
    try {
      const { data } = await API.graphql(graphqlOperation(listProducts));
      this.setState({ products: data.listProducts.items, isLoading: false });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false, products: null });
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
        <div className="content-container">
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
                  <span style={{ marginLeft: "5px" }}>Create Product</span>
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
        </div>
      </div>
    );
  }
}

export default withRouter<any, any>(AccountsPage);
