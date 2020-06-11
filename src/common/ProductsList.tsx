import React from "react";
import { Drawer, Grid } from "@material-ui/core";
import _ from "underscore";
import { API } from "aws-amplify";
import ProductCard from "./product/ProductCard";
import { ProductProps } from "./interfaces/Product.i";
import { searchProducts } from "../graphql/queries";
import Pagination from "./Pagination";
import SearchFilter from "./SearchFilter";
import {
  ProductListProps,
  ProductListState,
  FilterProps,
  ProductFilters,
} from "../pages/accounts/interfaces/ProductList.i";
import { openSnackbar } from "../utils/Notifier";
import { INTENT } from "../themes";

/**
 * TODO
 * [ ] Tab that opens filters on mobile instead of always showing
 */

/**
 * Component which allows the user to filter each of the products, and allow them
 * to sort based on their needs. Used in ProductTypePage and AccountsPage. The former
 * is used to show all of their relevant product types - i.e Cakes or Creations, whereas
 * the AccountsPage gives admins the ability to view, change, filter and delete all
 * of the products available on the site.
 */
class ProductsList extends React.Component<ProductListProps, ProductListState> {
  public readonly state: ProductListState = {
    page: 1,
    queryResults: null,
    sortMethod: "createdAt",
    filterOpen: false,
  };

  /**
   * A method which handle the users input search query from the dropdown filters,
   * which can be accessed by clicking the pink hamburger icon on the screen.
   * @param query - the input which the user would like to query
   * @param filters - the active filters which the user has selected to filter out
   * unwanted products.
   */
  public handleSearchQuery = async (
    query: string,
    filters: ProductFilters,
  ): Promise<void> => {
    // get the type from props, which should be "Cake" or "Creates"
    const { type } = this.props;
    // destructure the filters, so they can be placed in the filtering object.
    const { searchQuery, adminFilters, sortBy } = filters;
    /**
     * if there is no userQuery and no admin filters, then set queryResults to null
     * so the original products can be viewed instead of a blank screen.
     */
    if (!query && !adminFilters) return this.setState({ queryResults: null });
    /**
     * initialise the filtering variable as an empty object so the relevant filters
     * can be added later.
     */
    let filtering: FilterProps = {};
    /**
     * set the sortBy filter in to state as sortMethod - which would either be
     * createdAt or updatedAt, based on the users input.
     */
    this.setState({ sortMethod: sortBy });
    // only process the query if the user has put a query into the search bar.
    if (query.length) {
      /**
       * if the searchQuery filter is set to be "all", then add the correct
       * filters to the filtering object. The "all" tag allows the user to
       * find all products where the products tags, title, tagline or
       * description matches that of a product.
       */
      if (searchQuery === "all") {
        /**
         * To make sure all of the possible properties are collected, the "or"
         * array should place all of the values in it.
         */
        filtering = {
          or: [
            { tags: { matchPhrasePrefix: query } },
            { title: { matchPhrasePrefix: query } },
            { description: { matchPhrasePrefix: query } },
          ],
        };
      } else {
        /**
         * If the searchQuery is a specific type (e.g. title/tags) then that
         * should be placed in the filtering object without an "or", as the user
         * clearly only wants that type to be filtered.
         */
        filtering = {
          [searchQuery]: {
            matchPhrasePrefix: query,
          },
        };
      }
    }

    /**
     * If there are any admin filters that have been passed through props, then they
     * need to be added to the filtering object.
     */
    if (adminFilters) {
      // destructure the adminFilters so they can be accessed easily.
      const { cake, creates } = adminFilters;
      /**
       * if the cake boolean value is true and creates boolean is false, then you only
       * want to show cakes. This means that the filtering.and needs to be set to equal
       * (eq) "Cake". If the opposite is true then filtering.and needs to be set to equal
       * "Creates". If cake & creates are both true/false then the type needs to be set
       * to be the type, which will come from props.
       */
      if (cake && !creates) {
        filtering.and = [{ type: { eq: "Cake" } }];
      } else if (!cake && creates) {
        filtering.and = [{ type: { eq: "Creates" } }];
      }
    } else {
      filtering.and = [{ type: { eq: type } }];
    }

    /**
     * If the filtering object is empty, then queryResults needs to be returned and
     * set into state, which will stop the execution of the function.
     */
    if (Object.keys(filtering).length === 0 && filtering.constructor === Object) {
      return this.setState({ queryResults: null });
    }

    try {
      /**
       * If the filtering object is not empty then the products table on the database
       * needs to be searched with the correct filters.
       */
      const { data } = await API.graphql({
        query: searchProducts,
        variables: {
          filter: filtering,
          limit: 100,
        },
        // @ts-ignore
        authMode: "API_KEY",
      });
      /**
       * remove duplicate products from search results which may occur from the query
       * being in tags/description/tagline etc, and store it in the queryResults variable
       * which will be set into state.
       */
      const queryResults = _.uniq(data.searchProducts.items, (x: ProductProps) => x.id);
      return this.setState({ queryResults });
    } catch (err) {
      /**
       * If there are any errors present, then notify the user with the snackbar error
       * component.
       */
      openSnackbar({
        message: "Unable to retrieve products. Please try again.",
        severity: INTENT.Danger,
      });
    }
  };

  public render(): JSX.Element {
    const { queryResults, sortMethod, page, filterOpen } = this.state;
    const { products, admin, history, type } = this.props;

    const results = queryResults || products;
    let maxPages = -1;
    if (products) {
      maxPages = Math.ceil(products.length / 12);
    }
    const productRange = {
      min: page === 1 ? 0 : (page - 1) * 12,
      max: page === 1 ? 12 : (page - 1) * 12 + 12,
    };

    return (
      <>
        <div
          className="product-list__filter-container"
          onClick={(e): void => {
            e.stopPropagation();
            this.setState({ filterOpen: true });
          }}
          role="button"
          tabIndex={0}
        >
          <i className="fas fa-bars product-list__filter-icon animated infinite pulse" />
        </div>
        <Grid container spacing={4}>
          {results && results.length ? (
            results
              .sort((a: ProductProps, b: ProductProps) =>
                // @ts-ignore //FIXME
                a[sortMethod] < b[sortMethod] ? 1 : -1,
              )
              .slice(productRange.min, productRange.max)
              .map(
                (product: ProductProps): JSX.Element => (
                  <Grid item lg={4} sm={6} xs={12} key={product.id}>
                    <ProductCard admin={admin} product={product} history={history} />
                  </Grid>
                ),
              )
          ) : (
            <div className="product-list__no-result-container">No Results</div>
          )}
        </Grid>
        {results && results.length > 12 && (
          <Pagination
            maxPages={maxPages}
            setPage={(page): void => this.setState({ page })}
            page={page}
          />
        )}
        <Drawer
          open={filterOpen}
          anchor="top"
          ModalProps={{
            onBackdropClick: (): void => this.setState({ filterOpen: false }),
            disableScrollLock: true,
          }}
        >
          <SearchFilter
            setQuery={(query, filters): Promise<void> =>
              this.handleSearchQuery(query, filters)
            }
            admin={admin}
            type={type}
          />
        </Drawer>
      </>
    );
  }
}

export default ProductsList;
