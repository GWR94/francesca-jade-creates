import React, { RefObject } from "react";
import { Popover, Typography, Button, makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { RemoveItemAction } from "../../../interfaces/basket.redux.i";
import * as actions from "../../../actions/basket.actions";
import styles from "../styles/miniBasket.style";
import { BasketItemProps } from "../../payment/interfaces/Basket.i";
import { COLORS } from "../../../themes";

interface MiniBasketProps {
  basketOpen: boolean;
  basketRef: RefObject<HTMLDivElement>;
  setBasketOpen: (value: boolean) => void;
  items: BasketItemProps[];
  setMenuOpen: (value: boolean) => void;
  closeNav: () => void;
}

const MiniBasketMenu: React.FC<MiniBasketProps> = ({
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
      anchorEl={basketRef.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: 28,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: 280,
      }}
      style={{ marginTop: 6 }}
      onClose={(): void => setBasketOpen(false)}
    >
      <div className={classes.basket}>
        <Typography
          variant="h5"
          style={{
            textAlign: "center",
            margin: "4px 0",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          Basket
        </Typography>
        {items.length > 0 ? (
          items.map((item, i) => (
            <div key={i} style={{ display: "flex" }}>
              <Typography style={{ width: "100%" }}>{item.title}</Typography>
              <i
                className={`fas fa-times ${classes.basketDelete}`}
                onClick={(): RemoveItemAction =>
                  dispatch(actions.removeFromBasket(item.id))
                }
                role="button"
                tabIndex={0}
              />
            </div>
          ))
        ) : (
          <Typography
            variant="subtitle1"
            style={{ color: COLORS.DisabledGray, marginTop: 10, fontSize: "0.8rem" }}
          >
            Basket is empty.
          </Typography>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
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
        </div>
      </div>
    </Popover>
  );
};

export default MiniBasketMenu;
