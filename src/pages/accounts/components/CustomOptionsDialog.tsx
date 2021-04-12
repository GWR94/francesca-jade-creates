import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { S3Image } from "aws-amplify-react";
import React from "react";
import { breakpoints } from "../../../themes";
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
  const fullscreen = useMediaQuery(breakpoints.down("xs"));

  const customOptions = product.customOptions
    .map((option) => JSON.parse(option))
    .filter((item) => item !== null);
  const images = Object.values(
    customOptions.filter((item) => Object.keys(item)[0] === "Images")[0],
  )[0] as S3ImageProps[];
  return (
    <Dialog open={open && product !== null} fullScreen={fullscreen} onClose={onClose}>
      <DialogTitle>{product!.title}</DialogTitle>
      <DialogContent>
        {customOptions
          .filter((item) => Object.keys(item)[0] !== "Images")
          .map((options, i) => {
            console.log(options);
            const key = Object.keys(options)[0];
            const values = Object.values(options)[0] as string | string[];
            return (
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
        {images !== null && (
          <div className={classes.imagesContainer}>
            <Typography className={classes.details} gutterBottom>
              Custom Images:
            </Typography>
            <div className={classes.imageContainer}>
              <Splide
                options={{
                  width: 300,
                  arrows: images.length > 1,
                }}
              >
                {images.map((image, i) => (
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
                ))}
              </Splide>
            </div>
          </div>
        )}
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
