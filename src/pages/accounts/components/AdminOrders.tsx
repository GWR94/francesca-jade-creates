import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { listOrders } from "../../../graphql/queries";
import { OrderProps } from "../interfaces/Orders.i";
import styles from "../styles/orders.style";
import Pagination from "../../../common/Pagination";
import AdminOrderItem from "./AdminOrderItem";

/**
 * TODO
 * [ ] Fix shipping references title overflowing in dialog
 */

interface AdminOrdersState {
  currentOrder: OrderProps | null;
  inputError: string;
  isSending: boolean;
  isLoading: boolean;
  showPages: {
    min: number;
    max: number;
  };
}

/**
 * Functional component to render a table of all of the orders that have been
 * placed, but only if the user is an admin. The admin can see an overview of
 * all orders to quickly see if the orders have been paid, and if they have
 * been marked as shipped or not. The admin can also download all of the custom
 * images needed to create the order.
 */
const AdminOrders = (): JSX.Element => {
  // initialise state to store orders in as an empty array (which will be filled when component mounts)
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const [state, setState] = useState<AdminOrdersState>({
    currentOrder: null,
    inputError: "",
    isSending: false,
    isLoading: true,
    showPages: {
      min: 0,
      max: 12,
    },
  });

  /**
   * Function to retrieve all of the latest orders via the graphql query "listOrders".
   * This function will be executed when the component mounts
   */
  const getOrders = async (): Promise<void> => {
    // retrieve the orders data via the listOrders graphql query
    const { data } = await API.graphql(graphqlOperation(listOrders));
    // store the actual items into a variable
    const items: OrderProps[] = data.listOrders.items;
    // sort the items via their createdAt data (descending)
    const sorted = items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    // set orders into state
    setOrders(sorted);
    setState({ ...state, isLoading: false });
  };

  let isMounted = false;
  useEffect(() => {
    // isMounted is used for suppressing react error of updating unmounted component
    isMounted = true;
    // if the component is mounted, execute the getOrders function
    if (isMounted) getOrders();
    return (): void => {
      // set isMounted to false when the component is unmounted.
      isMounted = false;
    };
  }, []);

  // extend localizedFormat extension for dayjs to format dates correctly
  dayjs.extend(localizedFormat);

  // make and use styles for use in the component
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  // destructure values from state for use in component
  const {
    isLoading,
    showPages: { min, max },
  } = state;

  return (
    <Container>
      {/* Create accordion to show the accordions values */}
      <Accordion expanded={false}>
        <AccordionSummary>
          <Grid container style={{ marginRight: 30 }}>
            <Grid item xs={6}>
              <Typography className={classes.headingTitle}>Order Date</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.secondaryTitle}>Payment Status</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
      </Accordion>
      {/* If isLoading is true, show the loading spinner while data is retrieved */}
      {isLoading ? (
        <CircularProgress
          color="inherit"
          style={{
            color: "#000",
            display: "block",
            margin: "100px auto 80px",
          }}
          size={60}
        />
      ) : (
        // Map all of the orders into their own accordion component
        orders.slice(min, max).map((order, i) => <AdminOrderItem order={order} i={i} />)
      )}
      {/* Render the pagination if there is more than 6 orders in array */}
      {orders.length > 6 && (
        <Pagination
          dataLength={orders.length}
          numPerPage={12}
          setPageValues={({ min, max }): void =>
            setState({
              ...state,
              showPages: {
                min,
                max,
              },
            })
          }
        />
      )}
    </Container>
  );
};

export default AdminOrders;
