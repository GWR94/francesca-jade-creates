import {
  Accordion,
  AccordionSummary,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import dayjs from "dayjs";
import { ErrorOutline } from "@material-ui/icons";
import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Loading from "../../../common/Loading";
import Pagination from "../../../common/Pagination";
import { getUser } from "../../../graphql/queries";
import { AppState } from "../../../store/store";
import styles from "../styles/orders.style";
import { OrderProps } from "../interfaces/Orders.i";
import NonIdealState from "../../../common/containers/NonIdealState";
import OrderItem from "./OrderItem";

interface OrdersState {
  isLoading: boolean;
  pages: {
    min: number;
    max: number;
  };
  orders: OrderProps[];
  expanded: string | false;
}

/**
 * Functional component which renders all of the current authenticated
 * users orders if they have any.
 */
const Orders: React.FC = (): JSX.Element => {
  const [state, setState] = useState<OrdersState>({
    isLoading: true,
    pages: {
      min: 0,
      max: 12,
    },
    orders: [],
    expanded: false,
  });

  /**
   * Function to open/close a panel inside the Accordion component.
   * @param {string} panel - The panel which is expected to be opened/closed
   */
  const handlePanelChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ): void => {
    // Opens panel if its closed, or closes it if it's open.
    setState({
      ...state,
      expanded: isExpanded ? panel : false,
    });
  };

  // extend dayjs to have local formatting per users' location
  dayjs.extend(localizedFormat);

  // make and use styles for use in the component
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  // get the users sub for use in graphQL or AWS methods.
  const sub = useSelector(({ user }: AppState) => user.id);

  // get the users' orders as soon as the component mounts
  useEffect(() => {
    /**
     * Function to retrieve the users data, and then the users' orders based
     * on the current authenticated user.
     */
    const getOrders = async (): Promise<void> => {
      try {
        const { data } = await API.graphql(graphqlOperation(getUser, { id: sub }));
        const orders = data.getUser.orders.items;
        // set orders into state so it can be used throughout the component
        setState({ ...state, orders, isLoading: false });
      } catch (err) {
        console.error(err);
        // remove all loading UI effects.
        setState({ ...state, isLoading: false });
      }
    };

    getOrders();
  }, []);

  const {
    pages: { min, max },
    orders,
    expanded,
    isLoading,
  } = state;

  return isLoading ? (
    <Loading />
  ) : orders.length > 0 ? (
    <>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <div className={classes.root}>
        <Accordion expanded={false}>
          <AccordionSummary>
            <Grid
              container
              style={{
                marginRight: 30,
              }}
            >
              <Grid item xs={6}>
                <Typography className={classes.headingTitle}>Order Date</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.secondaryTitle}>Payment Status</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
        </Accordion>
        {orders
          // sort the orders by createdAt
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
          // slice the array to only show a maximum of 10 orders on a page
          .slice(min, max)
          .map((order, i) => (
            <OrderItem
              order={order}
              key={i}
              i={i}
              expanded={expanded}
              handlePanelChange={(
                panel: string,
              ): ((_event: React.ChangeEvent<{}>, isExpanded: boolean) => void) =>
                handlePanelChange(panel)
              }
            />
          ))}
        <Pagination
          dataLength={orders.length}
          numPerPage={12}
          setPageValues={({ min, max }): void =>
            setState({ ...state, pages: { min, max } })
          }
        />
      </div>
    </>
  ) : (
    <div>
      <Typography variant="h4">Orders</Typography>
      <div className={classes.nonIdealContainer}>
        <NonIdealState
          title="No Orders"
          Icon={<ErrorOutline style={{ height: 40, width: 40 }} />}
          subtext="You have not completed any orders. Place an order to see them here."
        />
      </div>
    </div>
  );
};

export default Orders;
