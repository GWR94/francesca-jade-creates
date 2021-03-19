import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@material-ui/core";
import {
  AccountCircleTwoTone,
  ShoppingCartTwoTone,
  CreateTwoTone,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../actions/user.actions";
import AdminProducts from "./components/AdminProducts";
import Profile from "./components/Profile";
import UpdateProduct from "../products/components/UpdateProduct";
import Orders from "./components/Orders";
import AdminOrders from "./components/AdminOrders";
import { AccountsPageProps } from "./interfaces/Accounts.i";
import { AppState } from "../../store/store";

/**
 * Class component to group together all of the components that are used to control the users'
 * account, such as Profile and Orders for customers, and admin panels for admins.
 */
const AccountsPage: React.FC<AccountsPageProps> = ({
  user,
  userAttributes,
  admin,
}): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentTab } = useSelector(({ user }: AppState) => user);
  console.log(admin);
  const renderCurrentTab = (): JSX.Element | null => {
    let tab: JSX.Element | null;
    switch (currentTab) {
      case "profile":
        tab = <Profile user={user} userAttributes={userAttributes} />;
        break;
      case "products":
        tab = <AdminProducts admin={admin} />;
        break;
      case "create":
        tab = <UpdateProduct history={history} admin={admin} />;
        break;
      case "orders":
        tab = <Orders />;
        break;
      case "adminOrders":
        tab = <AdminOrders />;
        break;
      default:
        tab = null;
    }
    return tab;
  };

  return (
    <div className="content-container">
      <Tabs
        value={currentTab}
        onChange={(_e, currentTab): void => {
          dispatch(actions.setCurrentTab(currentTab));
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
      {renderCurrentTab()}
    </div>
  );
};

export default AccountsPage;
