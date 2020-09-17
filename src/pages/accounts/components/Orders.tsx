import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  makeStyles,
  Typography,
} from "@material-ui/core";
import dayjs from "dayjs";
import { ExpandMoreRounded } from "@material-ui/icons";
import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Loading from "../../../common/Loading";
import Pagination from "../../../common/Pagination";
import { getUser } from "../../../graphql/queries";
import { AppState } from "../../../store/store";
import { UserAttributeProps } from "../interfaces/Accounts.i";
import { CheckoutProductProps } from "../../payment/interfaces/Basket.i";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import useScreenWidth from "../../../hooks/useScreenWidth";

interface OrderProps {
  id: string;
  createdAt: string;
  paymentStatus: string;
  products: CheckoutProductProps[];
  shippingAddress: { [key: string]: string };
  stripePaymentIntent: string;
  user: UserAttributeProps;
}

const Orders = (): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [pages, setPages] = useState({
    min: 0,
    max: 10,
  });

  const breakpoints = createBreakpoints({});
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "70%",
      margin: "0 auto",
      [breakpoints.down("sm")]: {
        width: "90%",
      },
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "50%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
      display: "inline-flex",
      alignItems: "center",
    },
    content: {
      alignItems: "center",
    },
    detailsRoot: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
    },
  }));

  dayjs.extend(localizedFormat);
  const classes = useStyles();
  const sub = useSelector(({ user }: AppState) => user.id);
  const [expanded, setExpanded] = useState<string | boolean>(false);

  const getOrders = async (): Promise<void> => {
    try {
      const { data } = await API.graphql(graphqlOperation(getUser, { id: sub }));
      setOrders(data.getUser.orders.items);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const desktop = useScreenWidth(600);

  const handlePanelChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ): void => {
    setExpanded(isExpanded ? panel : false);
  };

  const getOrderPrice = (products: CheckoutProductProps[]): string => {
    console.log(products);
    let price = 0;
    products.map((product) => {
      price += product.price + product.shippingCost;
    });
    return `£${price.toFixed(2)}`;
  };

  const { min, max } = pages;

  return isLoading ? (
    <Loading />
  ) : (
    <div className={classes.root}>
      {orders.slice(min, max).map((order, i) => {
        return (
          <Accordion
            expanded={expanded === `order${i}`}
            key={uuidv4()}
            onChange={handlePanelChange(`order${i}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRounded />}
              aria-controls={`order${i}bh-content`}
              id={`order${i}bh-header`}
              classes={{ content: classes.content }}
              style={{ alignItems: "center" }}
            >
              <Typography className={classes.heading}>
                {dayjs(order.createdAt).format(desktop ? "llll" : "l")}
              </Typography>
              <div className={classes.secondaryHeading}>
                <Typography style={{ marginRight: 5 }}>
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
            <AccordionDetails classes={{ root: classes.detailsRoot }}>
              <Typography>{order.id}</Typography>
              {order.products.map((product) => {
                return (
                  <>
                    <Typography>{product.title}</Typography>
                    <Typography>
                      {product.price} + {product.shippingCost}
                    </Typography>
                    <Typography>{product.variant.dimensions}</Typography>
                  </>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
      <Pagination
        dataLength={orders.length}
        numPerPage={10}
        setPageValues={({ min, max }): void => setPages({ min, max })}
      />
    </div>
  );
};

export default Orders;
