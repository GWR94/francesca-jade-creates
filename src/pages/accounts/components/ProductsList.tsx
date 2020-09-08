import React, { useEffect, useState } from "react";
import { Drawer, Grid, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Warning } from "@material-ui/icons";
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
 * TODO
 * [ ] Change getProducts to only return each page (use next token for more)
 * [ ] Return less results on mobile
 */

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

  const [state, setState] = useState<ProductListState>({
    page: 1,
    filterOpen: false,
    searchResults: null,
    isLoading: true,
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

  const { page, filterOpen, searchResults, isLoading } = state;
  const { items: products } = useSelector(({ products }: AppState) => products);
  const results = searchResults || products;
  let maxPages = -1;
  if (results) {
    maxPages = Math.ceil(results.length / 12);
  }
  const productRange = {
    min: page === 1 ? 0 : (page - 1) * 12,
    max: page === 1 ? 12 : (page - 1) * 12 + 12,
  };

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
        <i className={`fas fa-bars ${classes.filterIcon} animated infinite pulse`} />
      </div>
      <Grid container spacing={4}>
        {isLoading ? (
          <Loading small />
        ) : results.length > 0 ? (
          results.slice(productRange.min, productRange.max).map(
            (product: ProductProps): JSX.Element => (
              <Grid item lg={4} sm={6} xs={12} key={product.id}>
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
          maxPages={maxPages}
          setPage={(page): void => setState({ ...state, page })}
          page={page}
        />
      )}
      <Drawer
        open={filterOpen}
        anchor="top"
        ModalProps={{
          onBackdropClick: (): void => setState({ ...state, filterOpen: false }),
          disableScrollLock: true,
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
