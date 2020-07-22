import React from "react";
import { Tab, Tabs } from "@material-ui/core";
import {
  AccountCircleTwoTone,
  ShoppingCartTwoTone,
  CreateTwoTone,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";

interface Props {
  current: "profile" | "products" | "create" | "orders";
  admin: boolean;
}

const TabNavigation: React.FC<Props> = ({ current, admin }) => {
  const history = useHistory();
  return (
    <Tabs
      value={current}
      onChange={(_e, link): void => history.push(`/${link}`)}
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
  );
};

export default TabNavigation;
