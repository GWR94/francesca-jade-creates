import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listProducts } from "../graphql/queries";
import NewProduct from "../components/NewProduct";
import Profile from "../components/Profile";
import Products from "../components/ProductsList";
import background from "../img/background.jpg";
import {
  onUpdateProduct,
  onCreateProduct,
  onDeleteProduct,
} from "../graphql/subscriptions";
import { ProductProps } from "../interfaces/Product.i";
import Loading from "../components/Loading";

interface AccountsState {
  show: "profile" | "products" | "create";
  products: ProductProps[];
  isLoading: boolean;
}

interface AccountsProps {
  user: any;
  admin: boolean;
}

export default class AccountsPage extends Component<AccountsProps, AccountsState> {
  public readonly state: AccountsState = {
    show: "profile",
    products: null,
    isLoading: true,
  };

  private updateProductListener;

  private deleteProductListener;

  private createProductListener;

  public async componentDidMount(): Promise<void> {
    await this.handleGetProducts();
    this.createSubscriptions();
  }

  public componentWillUnmount(): void {
    this.updateProductListener.unsubscribe();
    this.deleteProductListener.unsubscribe();
    this.createProductListener.unsubscribe();
  }

  private createSubscriptions = (): void => {
    const { products } = this.state;
    const { user } = this.props;
    const {
      attributes: { sub },
    } = user;

    this.createProductListener = API.graphql(
      graphqlOperation(onCreateProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        console.log(products);
        const createdProduct = productData.value.data.onCreateProduct;
        const prevProducts = products.filter(
          (item): boolean => item.id !== createdProduct.id,
        );
        const updatedProducts = [createdProduct, ...prevProducts];
        this.setState({ products: updatedProducts });
      },
    });

    this.updateProductListener = API.graphql(
      graphqlOperation(onUpdateProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const updatedProduct = productData.value.data.onUpdateProduct;
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
        const updatedProducts = products.filter(
          (item): boolean => item.id !== deletedProduct.id,
        );
        this.setState({ products: updatedProducts });
      },
    });
  };

  private getCurrentPage = (): JSX.Element => {
    const { show, products } = this.state;
    switch (show) {
      case "profile":
        return <Profile />;
      case "products":
        return <Products products={products} />;
      case "create":
        return <NewProduct onCancel={(): void => this.setState({ show: "products" })} />;
      default:
        return null;
    }
  };

  private handleGetProducts = async (): Promise<void> => {
    const { data } = await API.graphql(graphqlOperation(listProducts));
    this.setState({ products: data.listProducts.items, isLoading: false });
  };

  public render(): JSX.Element {
    const { isLoading } = this.state;
    return isLoading ? (
      <Loading size={100} />
    ) : (
      <div
        style={{
          background: `url(${background}) no-repeat center center fixed`,
        }}
      >
        <div className="content-container">
          <div
            className="accounts__tab"
            onClick={(): void => this.setState({ show: "profile" })}
            role="button"
            tabIndex={0}
          >
            Profile
          </div>
          <div
            className="accounts__tab"
            onClick={(): void => this.setState({ show: "products" })}
            role="button"
            tabIndex={0}
          >
            Products
          </div>
          <div
            className="accounts__tab"
            onClick={(): void => this.setState({ show: "create" })}
            role="button"
            tabIndex={0}
          >
            Create Product
          </div>
          {this.getCurrentPage()}
        </div>
      </div>
    );
  }
}
