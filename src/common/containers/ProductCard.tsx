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
import {
  MoreVert,
  BrushOutlined,
  CakeOutlined,
  AddShoppingCartOutlined,
} from "@material-ui/icons";
import { S3Image } from "aws-amplify-react";
import { openSnackbar } from "../../utils/Notifier";
import * as actions from "../../actions/basket.actions";
import { ProductCardProps } from "../../pages/accounts/interfaces/Product.i";
import { deleteProduct } from "../../graphql/mutations";
import ChipContainer from "../inputs/ChipContainer";
import { INTENT, FONTS } from "../../themes";

/**
 * TODO
 * [ ] Find out why Creates cards have broken tooltip
 * [x] Change Carousel/Reactstrap components
 **/

// create styles for component
const useStyles = makeStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  media: {
    overflow: "hidden",
    width: "100%",
  },
  price: {
    textAlign: "center",
    margin: "10px 0",
    fontStyle: "italic",
    fontFamily: FONTS.Title,
  },
  root: {
    padding: 0,
    paddingBottom: "0 !important",
  },
});

const Product: React.FC<ProductCardProps> = ({
  product,
  admin = false,
  history,
}): JSX.Element => {
  const classes = useStyles();
  // destructure product for ease of variable use
  const { id, image, title, price, shippingCost, type, tags, tagline } = product;
  // boolean which shows/hides delete alert visibility
  const [deleteAlertOpen, setDeleteAlert] = useState(false);
  // boolean which opens dropdown menu for admin options
  const [menuOpen, setMenuOpen] = useState(false);
  // boolean which shows/hides loading UI effects
  const [isLoading, setLoading] = useState(true);

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
      await API.graphql(graphqlOperation(deleteProduct, { input: { id } }));
      // close the confirm delete dialog
      setDeleteAlert(false);
      // notify the user of success using a success snackbar with a relevant title.
      openSnackbar({
        severity: INTENT.Success,
        message: `${title} has been successfully removed.`,
      });
    } catch (err) {
      // if there are any errors, notify the user with a danger snackbar.
      openSnackbar({
        severity: INTENT.Danger,
        message: `${title} could not be removed.
        Please try again`,
      });
    }
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
          avatar={
            // if loading return a skeleton of the potential product
            isLoading ? (
              <Skeleton
                animation="wave"
                variant="circle"
                style={{ marginLeft: -10 }}
                width={40}
                height={40}
              />
            ) : type === "Cake" ? (
              <CakeOutlined />
            ) : (
              <BrushOutlined />
            )
          }
          action={
            // if loading return a skeleton of the potential product
            admin && (
              <IconButton
                aria-label="extra options"
                onClick={(e): void => {
                  e.stopPropagation();
                  setMenuOpen(true);
                }}
              >
                <MoreVert ref={anchorRef} />
              </IconButton>
            )
          }
          title={
            // if loading return a skeleton of the potential product
            isLoading ? <Skeleton animation="wave" style={{ marginRight: 14 }} /> : title
          }
          subheader={isLoading ? <Skeleton animation="wave" /> : tagline || ""}
          style={{ textAlign: "center" }}
        >
          {isLoading ? (
            <div style={{ margin: "30px 0" }}>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ margin: "auto" }}
              />
            </div>
          ) : (
            <>
              <p className={classes.price}>
                {price > 0
                  ? `£${price.toFixed(2)} + £${shippingCost.toFixed(2)} postage`
                  : "Variable price - request a quote."}
              </p>
              {tags && <ChipContainer type={type} tags={tags} />}
            </>
          )}
        </CardHeader>
        <CardContent classes={{ root: classes.root }}>
          {isLoading ? (
            <div style={{ margin: "30px 0" }}>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ margin: "auto" }}
              />
            </div>
          ) : (
            <>
              <p className={classes.price}>
                {price > 0
                  ? `£${price.toFixed(2)} + £${shippingCost.toFixed(2)} postage`
                  : "Variable price - request a quote."}
              </p>
              {tags && (
                <div style={{ marginBottom: 10 }}>
                  <ChipContainer type={type} tags={tags} />
                </div>
              )}
            </>
          )}
          <CardMedia className={classes.media} title={title}>
            <S3Image
              imgKey={image[0]?.key}
              theme={{
                photoImg: isLoading
                  ? { display: "none" }
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
                style={{ width: "100%", height: 400 }}
              />
            )}
          </CardMedia>
          <Tooltip title="Add to Shopping Basket" arrow placement="top">
            <Fab
              aria-label="Add to shopping basket"
              onClick={(e): void => {
                e.stopPropagation();
                try {
                  dispatch(
                    actions.addToBasket({
                      ...product,
                      image: image[0],
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
              style={{
                position: "absolute",
                bottom: 4,
                right: 4,
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
            <DialogTitle>Delete &quot;{title}&quot;?</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete &quot;{title}&quot;?</p>
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
