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

const Product: React.FC<ProductCardProps> = ({ product, admin = false }): JSX.Element => {
  // create styles for component
  const useStyles = makeStyles({
    ...styles,
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

  const handleGetPrices = (): string => {
    let min = Infinity;
    if (variants?.length) {
      for (const variant of variants) {
        min = Math.min(min, variant.price.item);
      }
    }
    if (min === Infinity) return `Variable Price - Request a Quote!`;
    return `From £${min.toFixed(2)}`;
  };

  return (
    <>
      <Card
        elevation={2}
        onClick={(): void =>
          history.push(`/${type === "Cake" ? "cakes" : "creates"}/${id}`)
        }
        className={classes.card}
      >
        <CardHeader
          classes={{
            title: classes.headerContainer,
          }}
          action={
            // if loading return a skeleton of the potential product
            admin && (
              <IconButton
                aria-label="extra options"
                onClick={(e): void => {
                  e.stopPropagation();
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
              title
            )
          }
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
              imgKey={images.collection[0]?.key}
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
          <Tooltip title="Add to Shopping Basket" arrow placement="top">
            <Fab
              aria-label="Add to shopping basket"
              className={classes.fab}
              onClick={(e): void => {
                e.stopPropagation();
                try {
                  dispatch(
                    actions.addToBasket({
                      ...product,
                      image: images.collection[images.cover],
                    }),
                  );
                  openSnackbar({
                    message: `Added ${product.title} to basket.`,
                    severity: "success",
                  });
                } catch (err) {
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
      {admin && (
        <>
          <Menu
            open={menuOpen}
            anchorEl={anchorRef.current}
            onClose={(): void => setMenuOpen(false)}
            transformOrigin={{
              vertical: -32,
              horizontal: -20,
            }}
          >
            <MenuItem
              onClick={(e): void => {
                e.stopPropagation();
                history.push(`/account/${product.id}`);
              }}
            >
              Edit Product
            </MenuItem>
            <MenuItem
              onClick={(e): void => {
                e.stopPropagation();
                setMenuOpen(false);
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

export default Product;
