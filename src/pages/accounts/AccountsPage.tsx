import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Tabs, Tab } from "@material-ui/core";
import {
  AccountCircleTwoTone,
  ShoppingCartTwoTone,
  CreateTwoTone,
} from "@material-ui/icons";
import { History } from "history";
import { AppState } from "../../store/store";
import { ProductProps } from "./interfaces/Product.i";
import {
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
} from "../../graphql/subscriptions";
import { ProductData } from "../../routes/interfaces/Router.i";
import AdminProducts from "./components/AdminProducts";
import Profile from "./components/Profile";
import UpdateProduct from "./components/UpdateProduct";
import { FetchProductsSuccessAction } from "../../interfaces/products.redux.i";
import * as productActions from "../../actions/products.actions";
import * as userActions from "../../actions/user.actions";
import { SetCurrentTabAction, CurrentTabTypes } from "../../interfaces/user.redux.i";
import Orders from "./components/Orders";
import AdminOrders from "./components/AdminOrders";
import {
  AccountsMapProps,
  AccountsMapState,
  AccountPageProps,
} from "./interfaces/Accounts.i";

class AccountsPage extends Component<AccountPageProps, {}> {
  private createProductListener: PushSubscription;
  private deleteProductListener: PushSubscription;
  private updateProductListener: PushSubscription;

  public componentDidMount(): void {
    const { admin } = this.props;
    if (admin) this.handleSubscriptions();
  }

  public componentWillUnmount(): void {
    this.createProductListener?.unsubscribe();
    this.deleteProductListener?.unsubscribe();
    this.updateProductListener?.unsubscribe();
  }

  private handleSubscriptions = async (): Promise<void> => {
    const { sub } = this.props;
    const { fetchProductsSuccess } = this.props;
    if (!fetchProductsSuccess) return;

    this.createProductListener = API.graphql(
      graphqlOperation(onCreateProduct, { owner: sub }),
    ).subscribe({
      next: (productData: ProductData): void => {
        const { products } = this.props;
        const createdProduct = productData.value.data.onCreateProduct;
        const prevProducts = products
          ? products.filter(
              (item: ProductProps): boolean => item.id !== createdProduct.id,
            )
          : [];
        const updatedProducts = [createdProduct, ...prevProducts];
        fetchProductsSuccess(updatedProducts);
      },
    });

    this.updateProductListener = API.graphql(
      graphqlOperation(onUpdateProduct, { owner: sub }),
    ).subscribe({
      next: (productData: ProductData): void => {
        const { products } = this.props;
        const updatedProduct = productData.value.data.onUpdateProduct;
        const updatedProductIdx = products.findIndex(
          (item: ProductProps): boolean => item.id === updatedProduct.id,
        );
        const updatedProducts = [
          ...products.slice(0, updatedProductIdx),
          updatedProduct,
          ...products.slice(updatedProductIdx + 1),
        ];
        fetchProductsSuccess(updatedProducts);
      },
    });

    this.deleteProductListener = API.graphql(
      graphqlOperation(onDeleteProduct, { owner: sub }),
    ).subscribe({
      next: (productData: ProductData): void => {
        const { products } = this.props;
        const deletedProduct = productData.value.data.onDeleteProduct;
        const updatedProducts = products
          ? products.filter(
              (item: ProductProps): boolean => item.id !== deletedProduct.id,
            )
          : [];
        fetchProductsSuccess(updatedProducts);
      },
    });
  };

  public renderCurrentTab = (): JSX.Element | null => {
    const { admin, userAttributes, history, user, currentTab } = this.props;
    let tab: JSX.Element | null;
    switch (currentTab) {
      case "profile":
        tab = (
          <Profile
            userAttributes={userAttributes}
            user={user}
            history={history}
            admin={admin}
          />
        );
        break;
      case "products":
        tab = <AdminProducts admin={admin} />;
        break;
      case "create":
        tab = <UpdateProduct history={history} admin={admin} />;
        break;
      case "orders":
        tab = <Orders userAttributes={userAttributes} />;
        break;
      case "adminOrders":
        tab = <AdminOrders />;
        break;
      default:
        tab = null;
    }
    return tab;
  };

  public render(): JSX.Element {
    const { setCurrentTab, currentTab } = this.props;
    const { admin } = this.props;
    return (
      <div>
        <Tabs
          value={currentTab}
          onChange={(_e, currentTab): void => {
            if (setCurrentTab) setCurrentTab(currentTab);
          }}
          indicatorColor="primary"
          textColor="primary"
          centered
          className="animated bounceInLeft"
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
              <Tab icon={<ShoppingCartTwoTone />} label="Orders" value="adminOrders" />,
            ]
          ) : (
            <Tab icon={<ShoppingCartTwoTone />} label="My Orders" value="orders" />
          )}
        </Tabs>
        {this.renderCurrentTab()}
      </div>
    );
  }
}

const mapStateToProps = ({ user, products }: AppState): AccountsMapState => ({
  admin: user.admin,
  sub: user.id,
  products: products.items,
  currentTab: user.currentTab,
});

const mapDispatchToProps = (dispatch: Dispatch): AccountsMapProps => ({
  fetchProductsSuccess: (products: ProductProps[]): FetchProductsSuccessAction =>
    dispatch(productActions.fetchProductsSuccess(products)),
  setCurrentTab: (currentTab: CurrentTabTypes): SetCurrentTabAction =>
    dispatch(userActions.setCurrentTab(currentTab)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage);
