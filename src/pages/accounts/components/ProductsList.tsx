import React, { useEffect, useState } from "react";
import { Drawer, Grid, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { MenuRounded, Warning } from "@material-ui/icons";
// import { API, graphqlOperation } from "aws-amplify";
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
import useScreenWidth from "../../../hooks/useScreenWidth";

/**
 * Component which allows the user to filter each of the products, and allow them
 * to sort based on their needs. Used in ProductTypePage and AccountsPage. The former
 * is used to show all of their relevant product types - i.e Cakes or Creations, whereas
 * the AccountsPage gives admins the ability to view, change, filter and delete all
 * of the products available on the site.
 */
const ProductsList: React.FC<ProductListProps> = ({ type, admin }): JSX.Element => {
  const dispatch = useDispatch();
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const desktop = useScreenWidth(600);

  const [state, setState] = useState<ProductListState>({
    filterOpen: false,
    searchResults: null,
    isLoading: true,
    page: {
      min: 0,
      max: desktop ? 12 : 6,
    },
    // nextToken: undefined,
    // nextNextToken: undefined,
    // previousTokens: [],
    // sortDirection: SortDirection.DESC,
  });

  let isMounted = false;

  useEffect(() => {
    // isMounted is used for suppressing react error of updating unmounted component
    isMounted = true;
    // if there is a type from parent, use it to get those product's type
    if (type) {
      dispatch(actions.getProducts(type));
    } else {
      // otherwise get all products
      dispatch(actions.getProducts());
    }
    setTimeout(() => {
      if (isMounted) setState({ ...state, isLoading: false });
    }, 500);

    return (): void => {
      isMounted = false;
    };
  }, []);

  // useEffect(() => {
  //   const fetch = async (): Promise<void> => {
  //     const { data } = await API.graphql(
  //       graphqlOperation(listProducts, {
  //         nextToken: state.nextToken,
  //         filter: type && {
  //           type: {
  //             eq: type,
  //           },
  //         },
  //         limit: 12,
  //         sortDirection: state.sortDirection,
  //       }),
  //     );
  //     setState({
  //       ...state,
  //       nextNextToken: data.listProducts.nextToken,
  //       searchResults: data.listProducts.items,
  //     });
  //     console.log(data);
  //   };

  //   fetch();
  // }, [state.nextToken, state.sortDirection]);

  const {
    filterOpen,
    searchResults,
    isLoading,
    page: { min, max },
  } = state;
  const { items: products } = useSelector(({ products }: AppState) => products);
  const results = searchResults || products;

  return (
    <>
      <div
        className={classes.filterContainer}
        onClick={(e): void => {
          e.stopPropagation();
          setState({ ...state, filterOpen: true });
        }}
        role="button"
        tabIndex={0}
      >
        <MenuRounded className={`${classes.filterIcon} animated infinite pulse`} />
      </div>
      <Grid container spacing={4}>
        {isLoading ? (
          <Loading small />
        ) : results.length > 0 ? (
          results.slice(min, max).map(
            (product: ProductProps): JSX.Element => (
              <Grid
                item
                lg={4}
                sm={6}
                xs={12}
                key={product.id}
                className={classes.gridContainer}
              >
                <ProductCard admin={admin} product={product} />
              </Grid>
            ),
          )
        ) : (
          <NonIdealState
            title="No Results Found!"
            Icon={<Warning />}
            subtext="Please edit your search to return results."
          />
        )}
      </Grid>
      {results && results.length > 12 && (
        <Pagination
          dataLength={results.length}
          numPerPage={desktop ? 12 : 6}
          setPageValues={({ min, max }): void =>
            setState({ ...state, page: { min, max } })
          }
        />
      )}
      <Drawer
        open={filterOpen}
        anchor="top"
        ModalProps={{
          onBackdropClick: (): void => setState({ ...state, filterOpen: false }),
          disableScrollLock: true,
        }}
        SlideProps={{
          unmountOnExit: false,
        }}
      >
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
