import { API, Auth, graphqlOperation } from "aws-amplify";
import React, { AnchorHTMLAttributes, useEffect, useState } from "react";
import AWS from "aws-sdk";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ExpandMoreRounded } from "@material-ui/icons";
import { listOrders } from "../../../graphql/queries";
import { S3ImageProps } from "../interfaces/Product.i";
import { GraphQlProduct, OrderProps } from "../interfaces/Orders.i";
import useScreenWidth from "../../../hooks/useScreenWidth";
import styles from "../styles/orders.style";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminOrders = (): JSX.Element => {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const getOrders = async (): Promise<void> => {
    const { data } = await API.graphql(graphqlOperation(listOrders));
    setOrders(data.listOrders.items);
  };

  const [expanded, setExpanded] = useState<string | boolean>(false);
  const [links, setLinks] = useState([]);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  useEffect(() => {
    getOrders();
  }, []);

  dayjs.extend(localizedFormat);

  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_KEY_AWS,
  });

  // make and use styles for use in the component
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  /**
   * useScreenWidth hook is used to change styles based on whether screen
   * is smaller/larger than input parameter
   */
  const desktop = useScreenWidth(600);

  /**
   * Function to open/close a panel inside the Accordion component.
   * @param {string} panel - The panel which is expected to be opened/closed
   */
  const handlePanelChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ): void => {
    // Opens panel if its closed, or closes it if it's open.
    setExpanded(isExpanded ? panel : false);
  };

  /**
   * Function which returns the full price of all the products in the order.
   * @param products - Array of products to retrieve the accumulative price from
   */
  const getOrderPrice = (products: GraphQlProduct[]): string => {
    let price = 0;
    products.map((product) => {
      price += product.price + product.shippingCost;
    });
    return `£${price.toFixed(2)}`;
  };

  const getSignedDownloadURL = (s3Image: S3ImageProps): string => {
    const { key, bucket } = s3Image;
    const s3 = new AWS.S3({
      signatureVersion: "v4",
      region: "eu-west-2",
      accessKeyId: process.env.ACCESS_KEY_AWS,
      secretAccessKey: process.env.SECRET_KEY_AWS,
    });
    const expiry = 60 * 60; // 1 hour (60 seconds * 60 mins)

    const url = s3.getSignedUrl("getObject", {
      Bucket: bucket,
      Key: `public/${key}`,
      Expires: expiry,
    });
    return url;
  };

  const downloadProductImages = (product: GraphQlProduct) => {
    const { customOptions } = product;
    const options = [];
    for (const option of customOptions) {
      options.push(JSON.parse(option));
    }
    const urls: string[] = [];
    for (const option of options) {
      if (Object.keys(option)[0] === "Images") {
        (Object.values(option)[0] as S3ImageProps[]).forEach((s3) =>
          urls.push(getSignedDownloadURL(s3)),
        );
      }
    }
    setLinks(urls);
  };

  const download = (url: string, name?: string): void => {
    if (!url) throw new Error("Resource URL not provided");
    setFetching(true);
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        setFetching(false);
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", blobURL);
        a.setAttribute("style", "display: none");

        if (name && name.length) a.download = name;
        document.body.appendChild(a);
        a.click();
      })
      .catch(() => setError(true));
  };

  return (
    <div>
      {orders.map((order, i) => {
        return (
          <Accordion
            expanded={expanded === `panel${i}`}
            key={i}
            onChange={handlePanelChange(`panel${i}`)}
            TransitionProps={{
              unmountOnExit: true,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRounded />}
              aria-controls={`panel${i}-content`}
              id={`panel${i}-header`}
              style={{ alignItems: "center" }}
            >
              <Typography className={classes.heading}>
                {dayjs(order.createdAt).format(desktop ? "llll" : "l")}
              </Typography>
              <div className={classes.secondaryHeading}>
                <Typography className={classes.heading}>
                  {getOrderPrice(order.products)}
                </Typography>
                {order.paymentStatus === "paid" ? (
                  <Chip
                    className={classes.paidTag}
                    size="small"
                    color="primary"
                    label="Paid"
                  />
                ) : (
                  <Chip
                    className={classes.unpaidTag}
                    size="small"
                    color="secondary"
                    label="Unpaid"
                  />
                )}
              </div>
            </AccordionSummary>
            <div className={classes.detailsText}>
              <Typography className={classes.orderId}>
                Order ID:
                <span className={classes.data}>{order.id}</span>
              </Typography>
            </div>
            <AccordionDetails>
              <Grid container spacing={1}>
                {order.products.map((product, i) => {
                  const { title, price, shippingCost, variant } = product;
                  return (
                    <Grid item xs={12} sm={6}>
                      <div
                        key={i}
                        style={{
                          marginBottom: 8,
                        }}
                      >
                        <Typography className={classes.details}>{title}</Typography>
                        <Typography className={classes.details}>
                          Cost:{" "}
                          <span className={classes.data}>
                            £{price.toFixed(2)} + £{shippingCost.toFixed(2)} P&P
                          </span>
                        </Typography>
                        <Typography className={classes.details}>
                          {variant.dimensions}
                        </Typography>
                        <Typography className={classes.details}>
                          Dimensions:{" "}
                          <span className={classes.data}>{variant.dimensions}</span>
                        </Typography>
                        <div className={classes.buttonContainer}>
                          <Button
                            variant="outlined"
                            onClick={(): void => {
                              downloadProductImages(product);
                            }}
                            size="small"
                            color="primary"
                          >
                            View Custom Options
                          </Button>
                          <div id="test">
                            {links?.map((link, i) => (
                              <Button
                                disabled={isFetching}
                                onClick={(): void => download(link)}
                              >
                                Download Image {i}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default AdminOrders;
