import React, { useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  CardHeader,
  IconButton,
  makeStyles,
  CardMedia,
  CardContent,
  MenuItem,
  Menu,
  Fab,
  Tooltip,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import { MoreVert, AddShoppingCartOutlined } from "@material-ui/icons";
import { S3Image } from "aws-amplify-react";
import { useHistory } from "react-router-dom";
import { openSnackbar } from "../../utils/Notifier";
import * as actions from "../../actions/basket.actions";
import { ProductCardProps } from "../../pages/accounts/interfaces/Product.i";
import { deleteProduct } from "../../graphql/mutations";
import ChipContainer from "../inputs/ChipContainer";
import { INTENT } from "../../themes";
import styles from "../styles/productCard.style";

/**
 * Functional component which renders a card showing an overview of the chosen
 * product.
 * @param product - An object containing all of the relevant data which is needed to
 * render the product card.
 * @param admin - Boolean value to determine if the current authenticated user is an
 * admin and can view admin only settings/inputs.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  admin = false,
}): JSX.Element => {
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
        product.type === "Cake" ? "rgba(253, 78, 242, 0.4)" : "rgba(147, 112, 246, 0.5)",
      "&:hover": {
        backgroundColor:
          product.type === "Cake"
            ? "rgba(253, 78, 242, 0.65)"
            : "rgba(147, 112, 246, 0.75)",
      },
    },
  });

  const classes = useStyles();
  // destructure product for ease of variable use
  const { id, images, title, type, tags, tagline, variants } = product;
  // boolean which shows/hides delete alert visibility
  const [deleteAlertOpen, setDeleteAlert] = useState(false);
  // boolean which opens dropdown menu for admin options
  const [menuOpen, setMenuOpen] = useState(false);
  // boolean which shows/hides loading UI effects
  const [isLoading, setLoading] = useState(true);
  // import and initialise useHistory() for navigation around the page
  const history = useHistory();
  // create anchorRef to allow a point to fit the anchor point for the menu
  const anchorRef = React.useRef<SVGSVGElement>(null);
  // connect with redux via hook.
  const dispatch = useDispatch();

  /**
   * Function to delete the current product from the database, using the deleteProduct
   * graphQL mutation.
   */
  const handleDeleteProduct = async (): Promise<void> => {
    try {
      // use the id of the current product as the input for deleteProduct
      await API.graphql(
        graphqlOperation(deleteProduct, {
          input: {
            id,
          },
        }),
      );
      // close the confirm delete dialog
      setDeleteAlert(false);
      // notify the user of success using a success snackbar with a relevant title.
      openSnackbar({
        severity: INTENT.Success,
        message: `${title} has been successfully removed.`,
      });
    } catch (err) {
      console.error(err);
      // if there are any errors, notify the user with a danger snackbar.
      openSnackbar({
        severity: INTENT.Danger,
        message: `${title} could not be removed.
        Please try again`,
      });
    }
  };

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
    if (min === Infinity) return `Variable Price - Request a Quote!`;
    // otherwise return the min value.
    return `From £${min.toFixed(2)}`;
  };

  return (
    <>
      <Card
        elevation={2}
        onClick={(): void => {
          // push the user to the full product page when they click on the card
          history.push(`/${type === "Cake" ? "cakes" : "creates"}/${id}`);
        }}
        className={classes.card}
      >
        <CardHeader
          classes={{
            title: classes.headerContainer,
          }}
          action={
            /**
             * If the current authenticated user is an admin, show them extra options
             * where they can edit or delete the current product from the card.
             */
            admin && (
              <IconButton
                aria-label="extra options"
                onClick={(e): void => {
                  // stop propagation to avoid unintended side effects
                  e.stopPropagation();
                  // open menu
                  setMenuOpen(true);
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
              <Skeleton
                animation="wave"
                style={{
                  marginRight: 14,
                }}
              />
            ) : (
              // otherwise show the title
              title
            )
          }
          // if isLoading is true, show the skeleton, otherwise show the tagline if there is one
          subheader={isLoading ? <Skeleton animation="wave" /> : tagline || ""}
          style={{
            textAlign: "center",
          }}
        />
        <CardContent
          classes={{
            root: classes.root,
          }}
        >
          {/* if isLoading is true, show a skeleton, otherwise show price and tags */}
          {isLoading ? (
            <div
              style={{
                margin: "30px 0",
              }}
            >
              <Skeleton
                animation="wave"
                height={10}
                style={{
                  marginBottom: 6,
                }}
              />
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{
                  margin: "auto",
                }}
              />
            </div>
          ) : (
            <>
              <p className={classes.price}>{handleGetPrices()}</p>
              {tags && (
                <div
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <ChipContainer type={type} tags={tags} />
                </div>
              )}
            </>
          )}
          <CardMedia className={classes.media} title={title}>
            <S3Image
              imgKey={images.collection[images.cover]?.key}
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
              onLoad={(): void => setLoading(false)}
            />
            {/* if loading return a skeleton of the potential product */}
            {isLoading && (
              <Skeleton
                animation="wave"
                variant="rect"
                style={{
                  width: "100%",
                  height: 400,
                }}
              />
            )}
          </CardMedia>
          {/* show the tooltip to the user if they're hovering over the Floating Action Button (Fab) */}
          {/* render the Fab which allows the user to quickly add an item in their basket */}
          <Tooltip title="Add to Shopping Basket" arrow placement="top">
            <Fab
              aria-label="Add to shopping basket"
              className={classes.fab}
              onClick={(e): void => {
                // stop propagation so there are no undesired effects
                e.stopPropagation();
                try {
                  // dispatch the action to add current product to basket, and map the cover image to it.
                  dispatch(
                    actions.addToBasket({
                      ...product,
                      image: images.collection[images.cover],
                    }),
                  );
                  // notify the user of successful action
                  openSnackbar({
                    message: `Added ${product.title} to basket.`,
                    severity: "success",
                  });
                } catch (err) {
                  // notify the user of failed action
                  openSnackbar({
                    message: `Unable to add ${product.title} to basket. Please try again.`,
                    severity: "error",
                  });
                }
              }}
            >
              <AddShoppingCartOutlined />
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
            onClose={(): void => setMenuOpen(false)}
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
                // close the menu
                setMenuOpen(false);
                // show the delete alert
                setDeleteAlert(true);
              }}
            >
              Delete Product
            </MenuItem>
          </Menu>
          <Dialog open={deleteAlertOpen} onClose={(): void => setDeleteAlert(false)}>
            <DialogTitle>
              Delete &quot;
              {title}
              &quot;?
            </DialogTitle>
            <DialogContent>
              <p>
                Are you sure you want to delete &quot;
                {title}
                &quot;?
              </p>
              <p>This cannot be undone.</p>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={(): void => setDeleteAlert(false)}>
                Cancel
              </Button>
              <Button color="secondary" onClick={handleDeleteProduct}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default ProductCard;
