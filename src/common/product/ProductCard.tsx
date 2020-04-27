import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  CardHeader,
  Avatar,
  IconButton,
  makeStyles,
  CardMedia,
  CardContent,
  IconButtonTypeMap,
  MenuList,
  MenuItem,
  Menu,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { MoreVert, BrushOutlined, CakeOutlined } from "@material-ui/icons";
import { S3Image } from "aws-amplify-react";
import { Amplify } from "@aws-amplify/ui-react";
import { ProductCardProps } from "../interfaces/Product.i";
import { deleteProduct } from "../../graphql/mutations";
import { Toaster } from "../../utils/index";
import TagsInput from "../TagsInput";

const useStyles = makeStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  media: {
    overflow: "hidden",
    width: "100%",
  },
});

const Product: React.FC<ProductCardProps> = ({
  product,
  admin = false,
  history,
}): JSX.Element => {
  const classes = useStyles();
  const { id, image, title, price, shippingCost, type, tags } = product;

  const [deleteAlertOpen, setDeleteAlert] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const anchorRef = React.useRef<SVGSVGElement>(null);

  const handleDeleteProduct = async (): Promise<void> => {
    try {
      await API.graphql(graphqlOperation(deleteProduct, { input: { id } }));
      setDeleteAlert(false);
      Toaster.show({
        intent: "success",
        message: `${title} has been successfully removed.`,
      });
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
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
            !isLoading &&
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
            isLoading ? <Skeleton animation="wave" style={{ marginRight: 14 }} /> : title
          }
        />
        <CardContent>
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
              <p className="product__price">
                {price > 0
                  ? `£${price.toFixed(2)} + £${shippingCost.toFixed(2)} postage`
                  : "Variable price - request a quote."}
              </p>
              {tags && <TagsInput type={type} tags={tags} />}
            </>
          )}
        </CardContent>
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
          {isLoading && (
            <Skeleton
              animation="wave"
              variant="rect"
              style={{ width: "100%", height: 400 }}
            />
          )}
        </CardMedia>
        {/* {admin && (
          <div className="new-product__button-container">
            <Button
              onClick={(e): void => {
                e.stopPropagation();
                setDeleteAlert(true);
              }}
              style={{ margin: "8px 4px 0", background: "#fd4ef2", color: "#fff" }}
            >
              Delete
            </Button>
            <Button
              onClick={(e): void => {
                e.stopPropagation();
                history.push(`/account/${product.id}`);
              }}
              style={{ margin: "8px 4px 0", background: "#ff80f7", color: "#fff" }}
            >
              Edit
            </Button>
          </div>
        )} */}
      </Card>
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
  );
};

export default Product;
