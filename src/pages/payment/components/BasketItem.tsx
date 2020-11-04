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
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import { ExpandMore, LocalShipping, MonetizationOn } from "@material-ui/icons";
import * as actions from "../../../actions/basket.actions";
import { RemoveItemAction } from "../../../interfaces/basket.redux.i";
import {
  BasketItemProps,
  CheckoutProductProps,
  CustomOptionArrayType,
} from "../interfaces/Basket.i";
import useScreenWidth from "../../../hooks/useScreenWidth";
import styles from "../styles/basket.style";
import { AppState } from "../../../store/store";
import { Variant } from "../../accounts/interfaces/Variants.i";
import { COLORS } from "../../../themes";
import BasketCustomOptions from "./BasketCustomOptions";

interface BasketItemState {
  isLoading: boolean;
  currentVariant: Variant | null;
  variantIndex: number | "";
  customOptions: CustomOptionArrayType | undefined;
  isCompleted: boolean;
}

interface BasketProps {
  item: BasketItemProps;
  currentIdx: number;
  items: BasketItemProps[];
  setIndex: (num: number) => void;
  handleConfirmProduct: (product: CheckoutProductProps) => void;
}

const BasketItem: React.FC<BasketProps> = ({
  item,
  currentIdx,
  items,
  setIndex,
  handleConfirmProduct,
}: BasketProps): JSX.Element => {
  const { id, title, image, variants, tagline } = item as BasketItemProps;
  const initialState: BasketItemState = {
    isLoading: true,
    currentVariant: null,
    variantIndex: "",
    customOptions: [],
    isCompleted: false,
  };
  const [state, setState] = useState<BasketItemState>(initialState);

  const desktop = useScreenWidth(600);
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const dispatch = useDispatch();
  const basket = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;

  const { products, cost } = useSelector(({ basket }: AppState) => basket.checkout);
  useEffect(() => {
    if (variants.length === 1) {
      setState({
        ...state,
        currentVariant: variants[0],
        /**
         * fill customOptions array to feature.length + 2 to make sure there's space
         * for colour theme and notes sections.
         */
        customOptions: Array(variants[0].features.length + 2).fill(undefined),
      });
    }
  }, [state.currentVariant]);

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
      currentVariant: updatedVariant,
      /**
       * fill customOptions array to feature.length + 2 to make sure there's space
       * for colour theme and notes sections.
       */
      customOptions: Array(updatedVariant.features.length + 2).fill(undefined),
    });
  };

  const handleCustomCompletion = (): void => {
    const { customOptions, currentVariant } = state;
    if (customOptions?.every((option) => option !== undefined)) {
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
        dispatch(actions.addCustomOptionsToProduct(id, customOptions));
      }
    }
  };

  const { isLoading, variantIndex, currentVariant, customOptions, isCompleted } = state;

  const disabled =
    currentVariant === null ||
    customOptions
      ?.slice(0, customOptions.length - 1)
      .some((option) => option === undefined);
  return (
    <>
      <Card className={classes.variantsContainer}>
        <div className={classes.innerContainer}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <S3Image
              imgKey={item.image.key}
              theme={{
                photoImg: {
                  width: desktop ? 130 : 80,
                  margin: "auto",
                },
              }}
            />
          </div>
          <div className={classes.textContainer}>
            <Typography variant="h5" className={classes.title}>
              {item.title}
            </Typography>
            <Typography variant="subtitle1" className={classes.subtext}>
              {item.tagline}
            </Typography>
            {item.variants.length > 1 && (
              <>
                <Typography className={classes.text}>
                  Please select the variant you wish to purchase
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Pick Variant</InputLabel>
                  <Select
                    value={variantIndex}
                    onChange={handleVariantChange}
                    fullWidth
                    classes={{
                      outlined: classes.outlined,
                      root: classes.root,
                    }}
                    label="Pick Variant"
                  >
                    {item.variants.map((variant, i) => {
                      const value = variant?.variantName ?? variant?.dimensions;
                      return (
                        <MenuItem value={i} key={i}>
                          {value}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </>
            )}
            <div className={classes.infoContainer}>
              {currentVariant !== null && (
                <div>
                  <div className={classes.costContainer}>
                    <MonetizationOn className={classes.icon} />
                    <Typography>£{currentVariant.price.item.toFixed(2)}</Typography>
                  </div>
                  <div className={classes.costContainer} style={{ marginLeft: 8 }}>
                    <LocalShipping className={classes.icon} />
                    <Typography>£{currentVariant.price.postage.toFixed(2)}</Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {currentVariant && (
          <Accordion
            expanded={!isCompleted} //FIXME
            onClick={(): void => setState({ ...state, isCompleted: false })}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography className={classes.header}>Customisable Features</Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.accordionRoot }}>
              <BasketCustomOptions
                currentVariant={currentVariant}
                setCustomOptions={(customOptions: CustomOptionArrayType): void =>
                  setState({ ...state, customOptions })
                }
                customOptions={customOptions || []}
                colorScheme={item.customOptions}
              />
            </AccordionDetails>
          </Accordion>
        )}
      </Card>
      <div className={classes.buttonContainer}>
        <Button
          color="primary"
          variant="outlined"
          onClick={(): void => {
            setIndex(currentIdx - 1);
            setState({
              ...state,
              currentVariant: products[currentIdx - 1].variant,
              customOptions: products[currentIdx - 1].customOptions,
            });
          }}
          className={classes.button}
          disabled={currentIdx === 0}
          size="small"
        >
          Back
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          className={classes.button}
          onClick={handleDeleteBasketItem}
        >
          Delete
        </Button>
        <Button
          color="inherit"
          disabled={disabled}
          variant="outlined"
          style={{
            color: !disabled ? COLORS.SuccessGreen : "rgba(0, 0, 0, 0.26)",
          }}
          className={classes.button}
          size="small"
          onClick={(): void => {
            const { id, title, tagline, image } = item;
            dispatch(
              actions.addToCheckout({
                id,
                title,
                tagline,
                image,
                price: currentVariant!.price.item,
                shippingCost: currentVariant!.price.postage,
                variant: currentVariant,
                customOptions,
              }),
            );
            if (currentIdx + 1 < items.length) {
              setIndex(currentIdx + 1);
              setState({
                ...state,
                currentVariant: null,
                variantIndex: "",
                customOptions: [],
              });
            } else {
              setState({ ...state, isCompleted: true });
            }
          }}
        >
          Confirm
        </Button>
      </div>
      {isCompleted && (
        <div className={classes.container}>
          <Typography variant="h5">Checkout Overview</Typography>
          {products.map((product) => (
            <>
              <Typography>{product.title}</Typography>
              <Typography>
                £{product.price.toFixed(2)} + £{product.shippingCost} Postage & Packaging
              </Typography>
            </>
          ))}
          <Typography>Total: £{cost.toFixed(2)}</Typography>
        </div>
      )}
    </>
  );
};

export default BasketItem;
