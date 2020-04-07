import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { Callout, NonIdealState, Button } from "@blueprintjs/core";
import { AppState } from "../../store/store";
import { BasketItemProps } from "./interfaces/Basket.i";
import BasketItem from "./components/BasketItem";
import { UserAttributeProps } from "../accounts/interfaces/Accounts.i";
import { getUser } from "../../graphql/queries";
import Loading from "../../common/Loading";
import { useHistory } from "react-router-dom";

interface Props {
  userAttributes: UserAttributeProps;
}

const Basket: React.FC<Props> = () => {
  const items = useSelector(({ basket }: AppState): BasketItemProps[] => basket.items);
  const id = useSelector(({ user }: AppState): string => user.id);

  const [isLoading, setLoading] = useState(true);
  const [savedProducts, setSavedProducts] = useState(null);
  const history = useHistory();

  useEffect(() => {
    API.graphql(graphqlOperation(getUser, { id })).then(({ data }) =>
      setSavedProducts(data.getUser?.savedProducts ?? []),
    );
    setLoading(false);
  }, []);

  return (
    <div className="basket__container">
      <h3 className="basket__title">Shopping Basket</h3>
      {items.length > 0 ? (
        items.map((item) => {
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
        })
      ) : (
        <NonIdealState
          icon="issue"
          title="No items in basket"
          description="Please add items to the basket to see them here."
          action={
            <div className="dialog__button-container">
              <Button
                onClick={(): void => history.push("/cakes")}
                text="Go to Cakes"
                style={{ margin: "0 3px" }}
              />
              <Button
                onClick={(): void => history.push("/creates")}
                text="Go to Creations"
                style={{ margin: "0 3px" }}
              />
            </div>
          }
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
          icon="info-sign"
          title="No Saved Items"
          description='To save a product for next time you visit, click the "Save for Later" text'
        />
      )}
    </div>
  );
};

export default Basket;
