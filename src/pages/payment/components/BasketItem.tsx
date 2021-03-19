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
  useMediaQuery,
} from "@material-ui/core";
import { ExpandMore, LocalShipping, MonetizationOn } from "@material-ui/icons";
import * as actions from "../../../actions/basket.actions";
import { RemoveItemAction } from "../../../interfaces/basket.redux.i";
import { BasketItemProps, CustomOptionArrayType } from "../interfaces/Basket.i";
import styles from "../styles/basket.style";
import { AppState } from "../../../store/store";
import { COLORS } from "../../../themes";
import BasketCustomOptions from "./BasketCustomOptions";
import { BasketItemState, BasketProps } from "../interfaces/BasketItem.i";

/**
 * TODO
 * [ ] Put ALL products & filter logic into redux and remove async actions from redux if poss
 * [ ] Remove all unnecessary data from reducers (admin etc)
 *
 */

/**
 * Functional component to render one item (product) that is in the customers' shopping basket. The component
 * will allow the customer to view, edit and delete the item from the basket, but will also allow the user to
 * add their own customisable options for the product that they're attempting to purchase.
 * @param item - the data for the current item that will be rendered inside the component
 * @param currentIdx - the index for the current item in the items array
 * @param items - the array of items (products), which hold all of the relevant data for each product
 * @param setIndex - function to update the currentIdx in the parent component.
 */
const BasketItem: React.FC<BasketProps> = ({
  item,
  currentIdx,
  items,
  setIndex,
}): JSX.Element => {
  const { id, variants } = item as BasketItemProps;
  const initialState: BasketItemState = {
    isLoading: true,
    currentVariant: null,
    variantIndex: "",
    customOptions: [],
    isCompleted: false,
    expanded: true,
    isEditing: false,
  };

  const [state, setState] = useState<BasketItemState>(initialState);

  // useMediaQuery changes boolean to true if window is larger than 600px
  const desktop = useMediaQuery("(min-width: 600px)");
  // make styles to be used in component from stylesheet
  const useStyles = makeStyles(styles);
  // create classes variable to retrieve styles in component
  const classes = useStyles();
  // create useDispatch hook so actions can be dispatched to redux store
  const dispatch = useDispatch();
  // create ref for basket so animations can be triggered from it
  const basket = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;
  // retrieve products and cost from redux store.
  const { products } = useSelector(({ basket }: AppState) => basket.checkout);

  const getMinPrice = (product: BasketItemProps, isItem: boolean): string => {
    let min = Infinity;
    product.variants.forEach((variant) => {
      min = Math.min(isItem ? variant.price.item : variant.price.postage, min);
    });
    return min.toFixed(2);
  };

  /**
   * When the component mounts, or the currentVariant state changes, check to see if
   * the new variants array is 1. If it is, then set the current variant to be the first
   * index in the array (as there's only one item in it) - if not, then do nothing.
   */
  useEffect(() => {
    if (variants.length === 1 && state.customOptions.length === 0) {
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

  /**
   * Function to delete an item from the basket, and show an animation which
   * moves it out of view in the screen.
   */
  const handleDeleteBasketItem = (): void => {
    // add the animation to the component so it zooms out of view
    basket.current?.classList.add("zoomOut");
    // dispatch the action after the animation has finished, which will remove it from basket.
    setTimeout((): RemoveItemAction => {
      return dispatch(actions.removeFromBasket(id));
    }, 500);
  };

  /**
   * Function to change the current variant, it's index and customOptions in state
   * based upon the newly selected variant by the user.
   * @param event - Event object containing data to determine what has been selected
   * from the input.
   */
  const handleVariantChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ): void => {
    // retrieve the index that the user clicked on
    const index = parseInt(event.target.value as string);
    // store the new variant in a variable so it can be set into state
    const updatedVariant = variants[index];
    setState({
      // set both index and currentVariant into state
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

  /**
   * Function to add a completed product (custom options and variant completed) to
   * the checkout redux store.
   */
  const handleAddToCheckout = (): void => {
    // destructure relevant state
    const { currentVariant, customOptions } = state;
    // destructure item
    const { id, title, tagline, image } = item;
    // search the products (checkout products) to see if it exists in the array.
    const match = products.find((product) => product.id === id);
    // if it's not in the array, then add it to the store.
    if (!match) {
      dispatch(
        actions.addToCheckout({
          id,
          title,
          tagline,
          image,
          // price: currentVariant!.price.item,
          // shippingCost: currentVariant!.price.postage,
          variant: currentVariant,
          customOptions,
        }),
      );
      // If it does exist in the array, just update custom options
    } else if (customOptions) {
      dispatch(actions.addCustomOptionsToProduct(id, customOptions));
    }
    /**
     * If the currentIdx + 1 is less than the length of the items array, then
     * try and locate the next product in the array if the user has completed it
     */
    if (currentIdx + 1 < items.length) {
      const updatedIdx = currentIdx + 1;
      // update the index into state
      setIndex(updatedIdx);
      // store a potential next product into a variable
      const nextProduct = products[updatedIdx];
      // if a value exists in nextProduct, set it into state so the user can edit it.
      if (nextProduct !== undefined) {
        setState({
          ...state,
          currentVariant: nextProduct?.variant ?? null,
          variantIndex: "",
          customOptions: nextProduct?.customOptions ?? [],
          isEditing: false,
        });
      } else {
        // If there's no value in nextProduct, set the inputs' state to empty values.
        setState({
          ...state,
          currentVariant: null,
          variantIndex: "",
          customOptions: [],
          isEditing: false,
        });
      }
    } else {
      /**
       * If the updated index is equal to or larger than the length of items array
       * then update state with isCompleted being set to true (to show "completed"
       * tags), set expanded to false to close accordion, and set isEditing to false
       * as the user is no longer editing anymore.
       */
      setState({
        ...state,
        isCompleted: true,
        expanded: false,
        isEditing: false,
      });
    }
  };

  // destructure all relevant pieces of state
  const { variantIndex, currentVariant, customOptions, expanded, isEditing } = state;

  // set disabled to be true if there's no current variable or all required fields aren't completed
  const disabled =
    currentVariant === null ||
    customOptions
      ?.slice(0, customOptions.length - 1)
      .some((option) => option === undefined);

  return (
    <>
      <Card className={classes.variantsContainer}>
        <div className={classes.innerContainer}>
          {/* Render the cover image centralised */}
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
                  // change the size of the image based on the screen width
                  width: desktop ? 130 : 90,
                  margin: "auto",
                },
              }}
            />
          </div>
          <div className={classes.textContainer}>
            <>
              <Typography variant="h5" className={classes.title}>
                {item.title}
              </Typography>
              <Typography variant="subtitle1" className={classes.subtext}>
                {item.tagline}
              </Typography>
            </>
            {/*
              If there are more than one variants for the user to choose from, render a 
              Select component with all of the variants inside, so the user can pick their
              chosen variant, and then go ahead and pick the custom options for that
              variant. If there was only one variant, that variant would already have been
              picked during the useEffect hook.
            */}
            <div className={classes.infoContainer}>
              {/*
                If the user has chosen a variant (currentVariant isn't null), then show
                the prices (shipping cost and unit price) for the variant to the user.
              */}
              <div className={classes.priceContainer}>
                {currentVariant === null && (
                  <Typography variant="caption">From</Typography>
                )}
                <div className={classes.priceInner}>
                  <div className={classes.costContainer}>
                    <MonetizationOn className={classes.icon} />

                    <Typography>
                      £
                      {currentVariant !== null
                        ? currentVariant.price.item.toFixed(2)
                        : getMinPrice(item, true)}
                    </Typography>
                  </div>
                  <div className={classes.costContainer} style={{ marginLeft: 8 }}>
                    <LocalShipping className={classes.icon} />
                    <Typography>
                      £
                      {currentVariant !== null
                        ? currentVariant.price.postage.toFixed(2)
                        : getMinPrice(item, false)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {item.variants.length > 1 && (
          <>
            <Typography
              variant="subtitle1"
              className={classes.text}
              style={{ marginBottom: 10 }}
            >
              Please select the variant you wish to purchase
            </Typography>

            <FormControl
              variant="outlined"
              size="small"
              style={{ width: "80%", margin: "0 auto 10px", display: "block" }}
            >
              <InputLabel>Pick Variant</InputLabel>
              <Select
                value={variantIndex}
                onChange={handleVariantChange}
                fullWidth
                label="Pick Variant"
              >
                {/* Map the variants into their own MenuItem component */}
                {item.variants.map((variant, i) => {
                  // Set the value to be the variantName if it exists, or the dimensions if not
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

        {currentVariant && (
          /**
           * Create a root accordion which will allow the user to open and close the
           * inputs for creating and editing the custom options for the current product.
           * Allows users on mobile to not fill up the whole screen unnecessarily.
           */
          <Accordion expanded={expanded}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              onClick={(): void => setState({ ...state, expanded: !expanded })}
            >
              <Typography className={classes.header}>Customisable Features</Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.accordionRoot }}>
              {/* Render the custom options accordion for the current product */}
              <BasketCustomOptions
                currentVariant={currentVariant}
                setCustomOptions={(customOptions: CustomOptionArrayType): void =>
                  setState({ ...state, customOptions })
                }
                customOptions={customOptions!}
                colorScheme={item.customOptions}
              />
            </AccordionDetails>
          </Accordion>
        )}
      </Card>
      {/*
        Render a set of buttons to control the flow of customising the different products.
      */}
      <div className={classes.buttonContainer}>
        {/* If the back button is pressed, go back to the previous product */}
        <Button
          color="primary"
          variant="outlined"
          onClick={(): void => {
            // store the updated index into a variable
            const updatedIdx = currentIdx - 1;
            // set the index in state.
            setIndex(updatedIdx);
            // set the current variant and custom options of the previous product into state.
            setState({
              ...state,
              currentVariant: products[updatedIdx].variant,
              customOptions: products[updatedIdx]?.customOptions ?? [],
              isEditing: true,
            });
          }}
          className={classes.button}
          // disable if the currentIdx is 0 as you obviously can't go back from the first item.
          disabled={currentIdx === 0}
          size="small"
        >
          Back
        </Button>
        {/* Render a button to delete the current product from basket */}
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          className={classes.button}
          onClick={handleDeleteBasketItem}
        >
          Delete
        </Button>
        {/* Render a button to add the completed product to the checkout - with all custom options */}
        <Button
          color="inherit"
          disabled={disabled}
          variant="outlined"
          style={{
            color: !disabled
              ? items.length === products.length
                ? COLORS.InfoBlue
                : COLORS.SuccessGreen
              : "rgba(0, 0, 0, 0.26)",
          }}
          className={classes.button}
          size="small"
          onClick={handleAddToCheckout}
        >
          {isEditing || items.length === products.length ? "Update" : "Confirm"}
        </Button>
      </div>
    </>
  );
};

export default BasketItem;
