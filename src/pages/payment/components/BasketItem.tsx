import React, { useRef, MutableRefObject, useState, useEffect } from "react";
import { S3Image } from "aws-amplify-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  makeStyles,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Card,
  Button,
  CardActions,
  CardContent,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { CheckCircleOutline, DeleteRounded, EditRounded } from "@material-ui/icons";
import * as actions from "../../../actions/basket.actions";
import { RemoveItemAction } from "../../../interfaces/basket.redux.i";
import { BasketItemProps, CustomOptionArrayType } from "../interfaces/Basket.i";
import useScreenWidth from "../../../hooks/useScreenWidth";
import styles from "../styles/basketItem.style";
import BasketCustomOptions from "./BasketCustomOptions";
import { AppState } from "../../../store/store";
import { Variant } from "../../accounts/interfaces/Variants.i";

interface BasketItemState {
  isLoading: boolean;
  currentVariant: Variant | null;
  variantIndex: number | "";
  customOptions: CustomOptionArrayType;
  isCompleted: boolean;
}

interface BasketProps {
  item: BasketItemProps;
}

const BasketItem: React.FC<BasketProps> = ({ item }: BasketProps): JSX.Element => {
  const { id, title, image, variants, tagline } = item as BasketItemProps;

  const [state, setState] = useState<BasketItemState>({
    isLoading: true,
    currentVariant: null,
    variantIndex: "",
    customOptions: [],
    isCompleted: false,
  });

  const desktop = useScreenWidth(600);
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const dispatch = useDispatch();
  const basket = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;

  const { products } = useSelector(({ basket }: AppState) => basket.checkout);
  useEffect(() => {
    if (variants.length === 1) {
      setState({
        ...state,
        currentVariant: variants[0],
        customOptions: [...Array(variants[0].features.length)],
      });
    }
    if (products.find((item) => item.id === id)) {
      setState({ ...state, isCompleted: true });
    }
  }, []);

  const handleDeleteBasketItem = (): void => {
    basket.current?.classList.add("zoomOut");
    setTimeout((): RemoveItemAction => {
      // basket.current.classList.remove("zoomOut"); // FIXME - May be needed?
      return dispatch(actions.removeFromBasket(id));
    }, 500);
  };

  const handleVariantChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ): void => {
    const index = parseInt(event.target.value as string);
    const updatedVariant = variants[index];
    setState({
      ...state,
      variantIndex: index,
      customOptions: [...Array(updatedVariant.features.length)],
      currentVariant: updatedVariant,
    });
  };

  const handleCustomCompletion = (): void => {
    const { customOptions, currentVariant } = state;
    if (customOptions.every((option) => option !== undefined)) {
      setState({ ...state, isCompleted: true });
      if (
        products.findIndex((product) => product.id === id) === -1 &&
        currentVariant !== null
      ) {
        dispatch(
          actions.addToCheckout({
            id,
            title,
            tagline,
            image,
            variant: currentVariant,
            price: currentVariant.price.item,
            shippingCost: currentVariant.price.postage,
            customOptions,
          }),
        );
      } else {
        dispatch(actions.updateCustomOptions(id, customOptions));
      }
    }
  };

  const { isLoading, variantIndex, currentVariant, customOptions, isCompleted } = state;
  return (
    <Card
      ref={basket}
      className="animated"
      style={{ cursor: "default", marginBottom: 14 }}
    >
      <CardContent>
        <div className={classes.innerContainer}>
          <S3Image
            imgKey={image.key}
            theme={{
              photoImg: isLoading
                ? { display: "none" }
                : {
                    height: desktop ? "140px" : "80px",
                    display: "block",
                    margin: "auto",
                    padding: 10,
                  },
            }}
            onLoad={(): void => setState({ ...state, isLoading: false })}
          />
          {isLoading && (
            <Skeleton
              animation="wave"
              variant="rect"
              style={{ width: "80px", height: desktop ? 140 : 80 }}
            />
          )}
          <div className={classes.infoContainer}>
            <Typography className={classes.title}>{title}</Typography>
            {tagline && <Typography className={classes.tagline}>{tagline}</Typography>}
          </div>
        </div>
      </CardContent>
      <div className={classes.variantsInputContainer}>
        {variants.length > 1 && (
          <FormControl style={{ margin: "8px 0 6px" }} variant="outlined" fullWidth>
            <InputLabel id="select-helper-label">Pick Variant</InputLabel>
            <Select
              labelId="select-helper-label"
              labelWidth={80}
              value={variantIndex}
              onChange={(e): void => handleVariantChange(e)}
              style={{ marginBottom: 28 }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {item.variants.map((variant: Variant, i) => (
                <MenuItem value={i} key={i}>
                  {`${
                    variant?.variantName ?? variant.dimensions
                  } (£${variant.price.item.toFixed(2)})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {currentVariant && !isCompleted && (
          <BasketCustomOptions
            setCustomOptions={(customOptions: CustomOptionArrayType): void => {
              let isCompleted = false;
              if (customOptions.every((option) => option !== undefined)) {
                isCompleted = true;
                handleCustomCompletion();
              }
              setState({ ...state, customOptions, isCompleted });
            }}
            currentVariant={currentVariant}
            customOptions={customOptions}
          />
        )}
      </div>
      <CardActions
        disableSpacing
        style={{ display: "flex", justifyContent: "flex-end", padding: "5px 10px" }}
      >
        {isCompleted && (
          <Button
            onClick={(): void => {
              const product = products.find((product) => product.id === id);
              setState({
                ...state,
                isCompleted: false,
                currentVariant: product?.variant ?? null,
                customOptions: product?.customOptions ?? [],
              });
            }}
            startIcon={<EditRounded />}
          >
            {!desktop ? "Edit" : "Edit Custom Options"}
          </Button>
        )}
        {!isCompleted && customOptions.every((option) => option !== undefined) && (
          <Button onClick={handleCustomCompletion} startIcon={<CheckCircleOutline />}>
            {!desktop ? "Save Options" : "Save Custom Options"}
          </Button>
        )}
        <Button
          color="secondary"
          style={{ margin: "0 3px" }}
          onClick={handleDeleteBasketItem}
          startIcon={<DeleteRounded />}
        >
          {!desktop ? "Remove" : "Remove from Basket"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default BasketItem;
