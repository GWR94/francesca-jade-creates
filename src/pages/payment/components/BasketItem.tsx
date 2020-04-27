/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useRef } from "react";
import { S3Image } from "aws-amplify-react";
import _ from "underscore";
import { useDispatch } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import { makeStyles } from "@material-ui/core";
import { BrushOutlined, CakeOutlined } from "@material-ui/icons";
import * as actions from "../../../actions/basket.actions";
import { RemoveItemAction } from "../../../interfaces/basket.redux.i";
import { updateUser } from "../../../graphql/mutations";
import { BasketItemProps } from "../interfaces/Basket.i";

interface Props {
  item: BasketItemProps;
  sub: string;
  savedProducts: BasketItemProps[];
  saved?: boolean;
  updateSavedProducts?: (products) => void;
}

const useStyles = makeStyles({
  icon: {
    position: "absolute",
    top: 8,
    right: 0,
  },
});
const BasketItem: React.FC<Props> = ({
  item,
  sub,
  savedProducts,
  updateSavedProducts,
  saved,
}): JSX.Element => {
  const classes = useStyles();
  const { title, price, shippingCost, id, image } = item;
  const dispatch = useDispatch();
  const basket = useRef(null);

  const removeItem = (): void => {
    basket.current.classList.add("zoomOut");
    setTimeout((): RemoveItemAction => {
      return dispatch(actions.removeFromBasket(id));
    }, 500);
  };

  return (
    <>
      <div ref={basket} className="basket-item__container animated">
        {item.type === "Cake" ? (
          <CakeOutlined className={classes.icon} />
        ) : (
          <BrushOutlined className={classes.icon} />
        )}
        <S3Image
          imgKey={image[0].key}
          theme={{
            photoImg: {
              width: "60px",
              borderRadius: "5px",
            },
          }}
        />
        <div className="basket-item__text">
          <h4 className="basket-item__title">{title}</h4>
          <p className="basket-item__costs">
            Cost: £{price.toFixed(2)} + £{shippingCost.toFixed(2)} P&P
          </p>
        </div>
        <div className="basket-item__controls">
          {!saved && (
            <p
              className="basket-item__remove"
              tabIndex={0}
              role="button"
              onClick={removeItem}
            >
              Remove from Basket
            </p>
          )}
          {saved ? (
            <p
              className="basket-item__remove"
              role="button"
              onClick={async (): Promise<void> => {
                const idx = savedProducts.findIndex((itemToFind) =>
                  _.isEqual(itemToFind, item),
                );
                const updatedSaved = [
                  ...savedProducts.slice(0, idx),
                  ...savedProducts.slice(idx + 1),
                ];
                updateSavedProducts(updatedSaved);
                await API.graphql(
                  graphqlOperation(updateUser, {
                    input: {
                      id: sub,
                      savedProducts: updatedSaved,
                    },
                  }),
                );
                removeItem();
              }}
            >
              Remove from Saved Products
            </p>
          ) : (
            <p
              className="basket-item__remove"
              role="button"
              onClick={async (): Promise<void> => {
                const { id, title, description, image, price, shippingCost, type } = item;
                const newProduct = {
                  id,
                  title,
                  description,
                  image,
                  price,
                  shippingCost,
                  type,
                };
                await API.graphql(
                  graphqlOperation(updateUser, {
                    input: {
                      id: sub,
                      savedProducts: [...savedProducts, newProduct],
                    },
                  }),
                );
                updateSavedProducts([...savedProducts, newProduct]);
                dispatch(actions.removeFromBasket(id));
                removeItem();
              }}
            >
              Save for Later
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default BasketItem;
