import React, { useEffect, useState } from "react";
import { Drawer, Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { MenuRounded, Warning } from "@material-ui/icons";
import ProductCard from "../../../common/containers/ProductCard";
import { ProductProps } from "../interfaces/Product.i";
import Pagination from "../../../common/Pagination";
import SearchFilter from "./SearchFilter";
import * as actions from "../../../actions/products.actions";
import { AppState } from "../../../store/store";
import { ProductListProps, ProductListState } from "../interfaces/ProductList.i";
import Loading from "../../../common/Loading";
import NonIdealState from "../../../common/containers/NonIdealState";
import styles from "../styles/productList.style";

/**
 * Component which allows the user to filter each of the products, and allow them
 * to sort based on their needs. Used in ProductTypePage and AccountsPage. The former
 * is used to show all of their relevant product types - i.e Cakes or Creations, whereas
 * the AccountsPage gives admins the ability to view, change, filter and delete all
 * of the products available on the site.
 * @param type - The type of product that will be rendered - i.e Cake or Creates.
 * @param admin - Boolean value to determine if the user is an admin or not.
 */
const ProductsList: React.FC<ProductListProps> = ({ type, admin }): JSX.Element => {
  // create a variable for the useDispatch hook to be executed within the component
  const dispatch = useDispatch();
  // make styles using the styles and store it into a variable that can be executed.
  const useStyles = makeStyles(styles);
  // execute useStyles to create the classes object - which will contain all styles
  const classes = useStyles();
  // set initial state for component
  const [state, setState] = useState<ProductListState>({
    filterOpen: false,
    searchResults: null,
    isLoading: true,
    page: {
      min: 0,
      max: window.innerWidth > 600 ? 12 : 6,
    },
  });

  let isMounted = false;

  useEffect(() => {
    // isMounted is used for suppressing react error of updating unmounted component
    isMounted = true;
    if (type) {
      /**
       * if there is a type prop that was passed down from the parent, dispatch the
       * getProducts action with the type passed as the parameter. This will return
       * all of the products which are of that type.
       */
      dispatch(actions.getProducts(type));
    } else {
      /**
       * If there is no type prop, then dispatch the getProducts action with no
       * parameters. This will return all of the products no matter what the type.
       */
      dispatch(actions.getProducts());
    }
    setTimeout(() => {
      /**
       * if the component is mounted and actions are completed, set isLoading to
       * false to remove UI loading effects.
       */
      if (isMounted) setState({ ...state, isLoading: false });
    }, 500);

    return (): void => {
      // set isMounted to false when the component is unmounted.
      isMounted = false;
    };
  }, []);

  // destructure relevant data from state
  const {
    filterOpen,
    searchResults,
    isLoading,
    page: { min, max },
  } = state;
  /**
   * Retrieve the items from the products store by destructuring it and renaming
   * it to products for clarity's sake.
   */
  const { items: products } = useSelector(({ products }: AppState) => products);
  /**
   * if there are any products (searchResults) passed from the SearchFilter component,
   * use them. If there aren't, then use the products from the products store (which
   * were retrieved from the useSelector hook).
   */
  const results = searchResults || products;

  return (
    <>
      <div
        className={classes.filterContainer}
        onClick={(e): void => {
          e.stopPropagation();
          // open the search filter when clicking on the div
          setState({ ...state, filterOpen: true });
        }}
        role="button"
        tabIndex={0}
      >
        {/* Show an animated pulsing menu icon to the user */}
        <MenuRounded className={`${classes.filterIcon} animated infinite pulse`} />
      </div>
      {isLoading ? (
        // if isLoading is true, show a loading UI spinner.
        <Loading small />
      ) : results.length > 0 ? (
        <Grid container spacing={2}>
          {/* 
            Map the results to a Grid item to control the responsive layout,
            and render a ProductCard component with the mapped product data
            passed through as props (and admin if the user is an admin).
          */}
          {results.slice(min, max).map(
            (product: ProductProps): JSX.Element => (
              <Grid item md={4} sm={6} xs={12} key={product.id}>
                <ProductCard admin={admin} product={product} />
              </Grid>
            ),
          )}
        </Grid>
      ) : (
        // If there are no products, show the NonIdealState component to notify the user
        <NonIdealState
          title="No Results Found!"
          Icon={<Warning />}
          subtext="Please edit your search to return results."
        />
      )}
      {/* 
        If there are any results, and the size of array is 12 larger than 12, render 
        the Pagination component to control pages of products
      */}
      {results && results.length > 12 && (
        <Pagination
          dataLength={results.length}
          numPerPage={12}
          setPageValues={({ min, max }): void =>
            setState({ ...state, page: { min, max } })
          }
        />
      )}
      {/* 
        Render the drawer component with the SearchFilter component inside if
        the filterOpen boolean is true 
      */}
      <Drawer
        open={filterOpen}
        anchor="top"
        ModalProps={{
          // If the user clicks outside the drawer, it will close
          onBackdropClick: (): void => setState({ ...state, filterOpen: false }),
          // disable the default scroll lock so the user can still scroll while open
          disableScrollLock: true,
        }}
        SlideProps={{
          unmountOnExit: false,
        }}
      >
        {/* Render the SearchFilter component */}
        <SearchFilter
          admin={admin}
          type={type}
          setSearchResults={(searchResults): void =>
            setState({ ...state, searchResults })
          }
        />
      </Drawer>
    </>
  );
};

export default ProductsList;
