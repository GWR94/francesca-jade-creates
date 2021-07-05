import React, { useState } from "react";
import {
  Card,
  CardHeader,
  IconButton,
  makeStyles,
  CardMedia,
  CardContent,
  MenuItem,
  Menu,
  Fab,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import {
  MoreVert,
  AddShoppingCartOutlined,
  ContactSupportOutlined,
} from "@material-ui/icons";
import { S3Image } from "aws-amplify-react";
import { useHistory } from "react-router-dom";
import { openSnackbar } from "../../utils/Notifier";
import * as actions from "../../actions/basket.actions";
import { ProductCardProps } from "../../pages/accounts/interfaces/Product.i";
import { COLORS, INTENT } from "../../themes";
import styles from "../styles/productCard.style";
import { getCompressedKey } from "../../utils";
import QuoteDialog from "../../pages/products/components/QuoteDialog";
import { AppState } from "../../store/store";
import DeleteProductAlert from "../alerts/DeleteProductAlert";

/**
 * Functional component which renders a card showing an overview of the chosen
 * product.
 * @param product - An object containing all of the relevant data which is needed to
 * render the product card.
 * @param admin - Boolean value to determine if the current authenticated user is an
 * admin and can view admin only settings/inputs.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }): JSX.Element => {
  // create styles for component
  const useStyles = makeStyles({
    // spread all styles from stylesheet
    ...styles,
    // add styles based on product.type
    fab: {
      position: "absolute",
      bottom: 4,
      right: 4,
      backgroundColor:
        product.type === "Cake" ? "rgba(253, 78, 242, 0.4)" : "rgba(188, 188, 188, 0.4)",
      "&:hover": {
        backgroundColor:
          product.type === "Cake"
            ? "rgba(253, 78, 242, 0.65)"
            : "rgba(188, 188, 188, 0.65)",
      },
    },
  });

  const classes = useStyles();
  // destructure product for ease of variable use
  const { id, images, title, type, tagline, variants } = product;
  // import and initialise useHistory() for navigation around the page
  const history = useHistory();
  // create anchorRef to allow a point to fit the anchor point for the menu
  const anchorRef = React.useRef<SVGSVGElement>(null);
  // connect with redux via hook.
  const dispatch = useDispatch();

  const [state, setState] = useState({
    isLoading: true,
    quoteDialogOpen: false,
    menuOpen: false,
    deleteAlertOpen: false,
  });

  const products = useSelector(({ basket }: AppState) => basket.items);
  const { admin } = useSelector(({ user }: AppState) => user);

  /**
   * Function to return a string containing the minimum price that the product
   * can be purchased with.
   * @returns {string} string describing price of product
   */
  const handleGetPrices = (): string => {
    // set min to be infinity to any value will change the value
    let min = Infinity;
    // if the variants array has 1 or more items, iterate through it and find the minimum value
    if (variants?.length) {
      for (const variant of variants) {
        // set min to the minimum of the current iterations price or the current min value.
        min = Math.min(min, variant.price.item);
      }
    }
    // if min still is infinity, there's no price so notify the user.
    if (min === Infinity) return `Request for Price`;
    // otherwise return the min value.
    return `From £${min.toFixed(2)}`;
  };

  const { isLoading, menuOpen, quoteDialogOpen, deleteAlertOpen } = state;

  return (
    <>
      <Card
        elevation={2}
        onClick={(): void => {
          // push the user to the full product page when they click on the card
          history.push(`/${type === "Cake" ? "cakes" : "creates"}/${id}`);
        }}
        data-testid="card-container"
        className={classes.card}
        // depending on the product type, place a border on top of the card with a color
        style={{
          borderTop: `3px solid ${type === "Cake" ? COLORS.Pink : COLORS.Gray}`,
        }}
      >
        <CardHeader
          classes={{
            title: classes.headerContainer,
            root: classes.root,
            content: classes.cardContent,
          }}
          action={
            /**
             * If the current authenticated user is an admin, show them extra options
             * where they can edit or delete the current product from the card.
             */
            admin && (
              <IconButton
                aria-label="extra options"
                data-testid="menu-dots"
                onClick={(e): void => {
                  // stop propagation to avoid unintended side effects
                  e.stopPropagation();
                  // open menu
                  setState({
                    ...state,
                    menuOpen: true,
                  });
                }}
                className={classes.options}
              >
                <MoreVert ref={anchorRef} />
              </IconButton>
            )
          }
          title={
            // if loading return a skeleton of the potential product
            isLoading ? (
              <div className={classes.content}>
                <Skeleton
                  animation="wave"
                  width="60%"
                  style={{
                    margin: "auto auto 10px",
                  }}
                />
                <Skeleton animation="wave" />
                <Skeleton
                  animation="wave"
                  height={10}
                  width="80%"
                  style={{
                    margin: "auto auto 6px auto",
                  }}
                />
              </div>
            ) : (
              <div className={classes.content}>
                <Typography
                  className={classes.title}
                  style={{ paddingRight: admin ? 20 : 0 }}
                >
                  {title}
                </Typography>
                <Typography className={classes.tagline}>{tagline || ""}</Typography>
                <Typography className={classes.price}>{handleGetPrices()}</Typography>
              </div>
            )
          }
          style={{
            textAlign: "center",
          }}
        />
        <CardContent
          classes={{
            root: classes.root,
          }}
        >
          <CardMedia className={classes.media} title={title}>
            <S3Image
              imgKey={getCompressedKey(images.collection[images.cover].key)}
              theme={{
                photoImg: isLoading
                  ? {
                      display: "none",
                    }
                  : {
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
              }}
              // once the image has loaded, set loading to be false
              onLoad={(): void =>
                setState({
                  ...state,
                  isLoading: false,
                })
              }
            />
            {/* if loading return a skeleton of the potential product */}
            {isLoading && (
              <Skeleton
                animation="wave"
                variant="rect"
                style={{
                  width: "100%",
                  height: 440,
                }}
              />
            )}
          </CardMedia>
          {/* show the tooltip to the user if they're hovering over the Floating Action Button (Fab) */}
          {/* render the Fab which allows the user to quickly add an item in their basket */}
          <Tooltip
            title={type === "Creates" ? "Add to Shopping Basket" : "Request a Quote"}
            arrow
            placement="top"
          >
            <Fab
              aria-label={
                type === "Creates" ? "Add to Shopping Basket" : "Request a Quote"
              }
              className={classes.fab}
              onClick={(e): void => {
                // stop propagation so there are no undesired effects
                e.stopPropagation();
                if (type === "Creates") {
                  try {
                    // dispatch the action to add current product to basket, and map the cover image to it.
                    if (products.findIndex((p) => product.title === p.title) === -1) {
                      dispatch(
                        actions.addToBasket({
                          ...product,
                          image: images.collection[images.cover],
                        }),
                      );
                      // notify the user of successful action
                      openSnackbar({
                        message: `Added ${product.title} to basket.`,
                        severity: INTENT.Success,
                      });
                    } else {
                      openSnackbar({
                        message: `${product.title} is already in the basket.`,
                        severity: INTENT.Danger,
                      });
                    }
                  } catch (err) {
                    // notify the user of failed action
                    openSnackbar({
                      message: `Unable to add ${product.title} to basket. Please try again.`,
                      severity: INTENT.Danger,
                    });
                  }
                } else {
                  setState({
                    ...state,
                    quoteDialogOpen: true,
                  });
                }
              }}
            >
              {type === "Cake" ? (
                <ContactSupportOutlined fontSize="large" />
              ) : (
                <AddShoppingCartOutlined />
              )}
            </Fab>
          </Tooltip>
        </CardContent>
      </Card>
      {/* if the current authenticated user is an admin, show the menu */}
      {admin && (
        <>
          <Menu
            // open if menuOpen is true
            open={menuOpen}
            anchorEl={anchorRef.current}
            onClose={(): void =>
              setState({
                ...state,
                menuOpen: false,
              })
            }
            // set correct transformOrigin for position of menu
            transformOrigin={{
              vertical: -32,
              horizontal: -20,
            }}
          >
            <MenuItem
              onClick={(e): void => {
                // stop propagation to avoid unintended side effects
                e.stopPropagation();
                // push to the edit product page
                history.push(`/account/${product.id}`);
              }}
            >
              Edit Product
            </MenuItem>
            <MenuItem
              onClick={(e): void => {
                // stop propagation to avoid unintended side effects
                e.stopPropagation();
                setState({
                  ...state,
                  menuOpen: false,
                  deleteAlertOpen: true,
                });
              }}
            >
              Delete Product
            </MenuItem>
          </Menu>
          <DeleteProductAlert
            isOpen={deleteAlertOpen}
            onClose={(): void => setState({ ...state, deleteAlertOpen: false })}
            product={product}
          />
        </>
      )}
      <QuoteDialog
        open={quoteDialogOpen}
        onClose={(): void =>
          setState({
            ...state,
            quoteDialogOpen: false,
          })
        }
        cake={product.title}
      />
    </>
  );
};

export default ProductCard;
