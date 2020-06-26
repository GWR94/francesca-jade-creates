/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useRef, MutableRefObject } from "react";
import { S3Image } from "aws-amplify-react";
import _ from "underscore";
import { useDispatch } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import { Paper, IconButton, Tooltip, Typography, makeStyles } from "@material-ui/core";
import {
  BrushOutlined,
  CakeOutlined,
  Delete,
  Favorite,
  Schedule,
} from "@material-ui/icons";
import * as actions from "../../../actions/basket.actions";
import { RemoveItemAction, AddItemAction } from "../../../interfaces/basket.redux.i";
import { updateUser } from "../../../graphql/mutations";
import { BasketItemProps } from "../interfaces/Basket.i";
import useScreenWidth from "../../../hooks/useScreenWidth";
import styles from "../styles/basketItem.style";

interface BasketProps {
  item: BasketItemProps;
  sub: string;
  savedProducts: BasketItemProps[];
  saved?: boolean;
  updateSavedProducts: (products: BasketItemProps[]) => void;
}

const BasketItem: React.FC<BasketProps> = ({
  item,
  sub,
  savedProducts,
  updateSavedProducts,
  saved,
}): JSX.Element => {
  const useStyles = makeStyles(styles);
  const desktop = useScreenWidth(600);
  const classes = useStyles();
  const { id, title, description, image, price, shippingCost, type, tagline } = item;
  const dispatch = useDispatch();
  const basket = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;

  const handleDeleteBasketItem = (): void => {
    basket.current.classList.add("zoomOut");
    setTimeout((): RemoveItemAction => {
      // basket.current.classList.remove("zoomOut"); // FIXME - May be needed?
      return dispatch(actions.removeFromBasket(id));
    }, 500);
  };

  const handleDeleteSavedItem = async (): Promise<void> => {
    let updatedSaved: BasketItemProps[];
    if (savedProducts.length <= 1) {
      updatedSaved = [];
    } else {
      const idx = savedProducts.findIndex((itemToFind) => _.isEqual(itemToFind, item));
      updatedSaved = [...savedProducts.slice(0, idx), ...savedProducts.slice(idx + 1)];
    }
    updateSavedProducts(updatedSaved);
    await API.graphql(
      graphqlOperation(updateUser, {
        input: {
          id: sub,
          savedProducts: updatedSaved,
        },
      }),
    );
    handleDeleteBasketItem();
  };

  const handleAddToSaveLater = async (): Promise<void> => {
    const newProduct = {
      id,
      title,
      description,
      image,
      price,
      shippingCost,
      type,
      tagline,
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
    handleDeleteBasketItem();
  };

  return (
    <>
      <Paper ref={basket} className={`animated ${classes.container}`}>
        <S3Image
          imgKey={image.key}
          theme={{
            photoImg: {
              height: desktop ? "200px" : "120px",
              borderRadius: "5px",
            },
          }}
        />
        <div className={classes.infoContainer}>
          <div>
            <Typography className={classes.title}>{title}</Typography>
            {tagline && <Typography className={classes.tagline}>{tagline}</Typography>}
          </div>

          <>
            <Typography variant="caption">£{price.toFixed(2)}</Typography>
            <Typography variant="caption">£{shippingCost.toFixed(2)}</Typography>
          </>
          <>
            {item.type === "Cake" ? (
              <CakeOutlined className={classes.icon} />
            ) : (
              <BrushOutlined className={classes.icon} />
            )}
          </>
          <div className={classes.buttonContainer}>
            <Tooltip
              title={saved ? "Remove from Saved List" : "Remove from Basket"}
              placement="top"
            >
              <IconButton
                className={classes.iconButton}
                role="button"
                onClick={saved ? handleDeleteSavedItem : handleDeleteBasketItem}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={saved ? "Add to Shopping Basket" : "Move to Save For Later"}
              placement="top"
            >
              <IconButton
                className={classes.iconButton}
                role="button"
                onClick={
                  saved
                    ? (): AddItemAction => dispatch(actions.addToBasket(item))
                    : handleAddToSaveLater
                }
              >
                {saved ? <Favorite /> : <Schedule />}
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default BasketItem;
