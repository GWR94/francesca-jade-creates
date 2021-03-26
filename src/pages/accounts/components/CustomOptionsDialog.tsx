import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  makeStyles,
} from "@material-ui/core";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { S3Image } from "aws-amplify-react";
import React from "react";
import { getReadableStringFromArray } from "../../../utils";
import { GraphQlProduct } from "../interfaces/Orders.i";
import { S3ImageProps } from "../interfaces/Product.i";
import styles from "../styles/orders.style";

interface CustomOptionsDialog {
  open: boolean;
  product: GraphQlProduct;
  onClose: () => void;
}

const CustomOptionsDialog = ({
  open,
  product,
  onClose,
}: CustomOptionsDialog): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <Dialog open={open && product !== null} onClose={onClose}>
      <DialogTitle>{product!.title} Custom Options</DialogTitle>
      <DialogContent>
        {product.customOptions
          .filter((item) => item !== null)
          .map((option, i) => {
            const data: { [key: string]: string[] | S3ImageProps[] } = JSON.parse(option);
            const key = Object.keys(data)[0];
            const values = Object.values(data)[0];
            return key === "Images" ? (
              values.length > 0 && (
                <div key={i}>
                  <Typography className={classes.details} gutterBottom>
                    Custom Images:
                  </Typography>
                  <div className={classes.imageContainer}>
                    <Splide
                      options={{
                        width: 300,
                        arrows: values.length > 1,
                      }}
                    >
                      {(values as S3ImageProps[]).map((image, i) => {
                        return (
                          <SplideSlide key={i} style={{ width: "100%" }}>
                            <S3Image
                              imgKey={image.key}
                              theme={{
                                photoImg: {
                                  width: 300,
                                },
                              }}
                              // level="private"
                            />
                          </SplideSlide>
                        );
                      })}
                    </Splide>
                  </div>
                </div>
              )
            ) : (
              <Typography className={classes.details} gutterBottom key={i}>
                {key}:
                <span className={classes.data}>
                  {Array.isArray(values)
                    ? getReadableStringFromArray(values as string[])
                    : values}
                </span>
              </Typography>
            );
          })}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" size="small" variant="text" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomOptionsDialog;
