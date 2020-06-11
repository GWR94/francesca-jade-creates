import React, { RefObject } from "react";
import { Popover, Typography, Button, makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { RemoveItemAction } from "../../../interfaces/basket.redux.i";
import * as actions from "../../../actions/basket.actions";
import styles from "../styles/miniBasket.style";
import { BasketItemProps } from "../../payment/interfaces/Basket.i";

interface MiniBasketProps {
  basketOpen: boolean;
  basketRef: RefObject<HTMLDivElement>;
  setBasketOpen: (value: boolean) => void;
  items: BasketItemProps[];
  setMenuOpen: (value: boolean) => void;
  closeNav: () => void;
}

const MiniBasketMenu: React.SFC<MiniBasketProps> = ({
  basketOpen,
  basketRef,
  setBasketOpen,
  items,
  setMenuOpen,
  closeNav,
}): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();

  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <Popover
      open={basketOpen}
      getContentAnchorEl={null}
      anchorEl={basketRef.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: 28,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      style={{ marginTop: 6 }}
      onClose={(): void => setBasketOpen(false)}
    >
      <div className={classes.basket}>
        <Typography
          variant="h6"
          style={{ textAlign: "center", margin: 0, fontWeight: "bold" }}
        >
          Basket
        </Typography>
        {items.length > 0 ? (
          items.map((item, i) => (
            <div style={{ display: "flex", marginRight: 22 }} key={i}>
              <Typography style={{ width: 20 }}>{i + 1}.</Typography>
              <Typography style={{ width: "100%" }}>{item.title}</Typography>
              <i
                className="fas fa-times nav__basket-delete"
                onClick={(): RemoveItemAction =>
                  dispatch(actions.removeFromBasket(item.id))
                }
                role="button"
                tabIndex={0}
              />
            </div>
          ))
        ) : (
          <Typography>Basket is empty.</Typography>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Button
            size="small"
            color="secondary"
            onClick={(): void => {
              history.push("/basket");
              closeNav();
              setBasketOpen(false);
              setMenuOpen(false);
            }}
          >
            View Basket
          </Button>
          {/* // FIXME */}
          <Button size="small" color="primary">
            Checkout
          </Button>
        </div>
      </div>
    </Popover>
  );
};

export default MiniBasketMenu;
