import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { InfoOutlined, ShoppingBasketOutlined, FavoriteBorder } from "@material-ui/icons";
import { Typography, Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { AppState } from "../../store/store";
import BasketItem from "./components/BasketItem";
import { UserAttributeProps } from "../accounts/interfaces/Accounts.i";
import { getUser } from "../../graphql/queries";
import Loading from "../../common/Loading";
import { BasketState } from "../../reducers/basket.reducer";
import NonIdealState from "../../common/NonIdealState";
import { Toaster } from "../../utils";

interface Props {
  userAttributes: UserAttributeProps;
}

const Basket: React.FC<Props> = () => {
  const { items, cost } = useSelector(({ basket }: AppState): BasketState => basket);
  const id = useSelector(({ user }: AppState): string => user.id);

  const [isLoading, setLoading] = useState(true);
  const [savedProducts, setSavedProducts] = useState(null);
  const history = useHistory();

  const getSavedProducts = async (): Promise<void> => {
    try {
      const { data } = await API.graphql(graphqlOperation(getUser, { id }));
      setSavedProducts(data.getUser?.savedProducts ?? []);
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "warning",
        message: "Failed to load saved products.",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getSavedProducts();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="basket__container">
      <h3 className="basket__title">Shopping Basket</h3>
      {items.length > 0 ? (
        <>
          {items.map((item) => {
            const uid = uuidv4();
            return (
              <BasketItem
                item={item}
                key={uid}
                sub={id}
                savedProducts={savedProducts}
                updateSavedProducts={(products): void => setSavedProducts(products)}
              />
            );
          })}
          <Button
            color="primary"
            startIcon={<ShoppingBasketOutlined />}
            onClick={(): void => history.push("/checkout")}
          >
            Checkout
          </Button>
        </>
      ) : (
        <NonIdealState
          title="No items in basket"
          Icon={<InfoOutlined />}
          subtext="Please add items to the basket to see them in here"
        />
      )}
      <h3 className="basket__title">Saved For Later</h3>
      {savedProducts?.length > 0 ? (
        <>
          {savedProducts.map((item) => {
            const uid = uuidv4();
            return (
              <BasketItem
                item={item}
                key={uid}
                sub={id}
                saved
                savedProducts={savedProducts}
                updateSavedProducts={(products): void => setSavedProducts(products)}
              />
            );
          })}
        </>
      ) : (
        <NonIdealState
          Icon={<FavoriteBorder />}
          title="No Saved Items"
          subtext='To save a product for next time you visit, click the "Save for Later" text'
        />
      )}
    </div>
  );
};

export default Basket;
