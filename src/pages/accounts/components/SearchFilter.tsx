import React, { useEffect, useState } from "react";
import {
  Select,
  Radio,
  FormControl,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  TextField,
  InputAdornment,
  Grid,
  MenuItem,
  ThemeProvider,
  FormGroup,
  Checkbox,
  InputLabel,
  makeStyles,
} from "@material-ui/core";
import { API } from "aws-amplify";
import { useDebounce } from "use-debounce";
import { useDispatch, useSelector } from "react-redux";
import _ from "underscore";
import { SearchRounded, RefreshRounded } from "@material-ui/icons";
import { SearchType, FilterProps, SortDirection } from "../interfaces/ProductList.i";
import { searchFilterTheme } from "../../../themes";
import { SearchFilterProps } from "../interfaces/SearchFilter.i";
import { searchProducts } from "../../../graphql/queries";
import { ProductProps } from "../interfaces/Product.i";
import { Variant } from "../interfaces/Variants.i";
import { AppState } from "../../../store/store";
import { FilterActionProps, SortBy } from "../../../interfaces/products.redux.i";
import * as actions from "../../../actions/products.actions";
import styles from "../styles/searchFilter.style";

/**
 * TODO
 * [x] Sort out success page
 * [ ] Sort out basket
 * [ ] Fix errors for cakes ViewProduct
 * [ ] Fix landing page styles on mobile
 */

/**
 * Component which allows the user to filter out products to fit their needs.
 * @param setQuery - Function to set the
 * filters and searchQuery into the parent where the search/filter process will begin.
 * @param admin = false - Boolean value to show if the current authenticated user
 * is an admin.
 * @param type = null - Optional type of product (if any) page where
 * the user has come from (i.e /cake or /creates)
 */
const SearchFilter: React.FC<SearchFilterProps> = ({
  admin,
  type = null,
  setSearchResults,
}): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [searchQuery, setSearchQuery] = useState<string>("");
  /**
   * the debounced search query will only change its value 500 milliseconds
   * after the user has finished typing
   */
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [searchResults, setSearch] = useState<ProductProps[] | null>([]);

  const dispatch = useDispatch();

  // retrieve the filters set in the store with redux's useSelector
  const filters: FilterActionProps = useSelector(
    ({ products }: AppState) => products.filters,
  );

  /**
   * Function to find the minimum price from an array of variants and return
   * it.
   * @param variants - Array of variants which will be iterated
   * through to find the minimum price out of all of the elements.
   */
  const getMinPriceFromVariants = (variants: Variant[]): number => {
    // set min to infinity so any number which runs with Math.min() will change value
    let min = Infinity;
    /**
     * iterate through each variant and check to see if the current variants prices
     * are less than the current min, and overwrite it if it is.
     */
    variants.forEach((variant) => {
      min = Math.min(min, variant.price.item + variant.price.postage);
    });
    return min;
  };

  /**
   * Function to sort the input array of products, based on the sorting method that the user
   * has set (createdAt or price), and the sort direction that the user has set (Descending/
   * Ascending), and then return it.
   * @param { ProductProps[] | null = searchResults} products - An unsorted array
   * of products, which will be sorted and returned. If there is no parameter set for
   * products, use the searchResults array as a default value.
   */
  const sortSearchResults = (products: ProductProps[] | null = searchResults): void => {
    const { sortBy, sortDirection } = filters;
    // initialise an array to hold the values of the sorted products.
    let sorted: ProductProps[] = [];
    if (!products) return setSearchResults(null);
    if (sortBy === "price") {
      /**
       * create a variable for the cake - no need to filter as there are no set
       * prices for them.
       */
      const cakes = products.filter((product) => product.type === "Cake");
      /**
       * create a variable for the creations, and sort it based on the price, using the
       * getMinPriceFromVariants function.
       */
      const creates = products
        .filter((product) => product.type === "Creates")
        .sort((a: ProductProps, b: ProductProps) => {
          return getMinPriceFromVariants(a.variants) < getMinPriceFromVariants(b.variants)
            ? sortDirection === "DESC"
              ? 1
              : -1
            : sortDirection === "DESC"
            ? -1
            : 1;
        });
      /**
       * If the sortDirection is descending, place cakes after creates because cakes do not
       * have a set price so they should be placed after. If it's ascending, reverse this.
       */
      sortDirection === "DESC"
        ? (sorted = [...creates, ...cakes])
        : (sorted = [...cakes, ...creates]);
    } else {
      // sort the products based on the createdAt prop.
      sorted = products.sort((a, b) =>
        //@ts-expect-error
        a.createdAt > b.createdAt
          ? sortDirection === "DESC"
            ? 1
            : -1
          : sortDirection === "ASC"
          ? -1
          : 1,
      );
    }
    setSearchResults(sorted);
  };

  /**
   * If the user is an admin, and there are no adminFilters set into state, set them
   * into state when the component mounts.
   */
  useEffect(() => {
    const { adminFilters } = filters;
    if (admin && adminFilters === null) {
      dispatch(
        actions.setSearchFilters({
          ...filters,
          adminFilters: {
            cake: true,
            creates: true,
          },
        }),
      );
    }
  }, []);

  /**
   * Function to filter the products based on the users' input, which will be
   * executed every time the searchQuery state or filters object (from redux)
   * is changed.
   */
  useEffect(() => {
    const { searchType, adminFilters, shouldUpdateWithNoQuery } = filters;

    /**
     * Function to transform the user input filters into a filters that can be
     * used in the graphQL searchProducts query.
     */
    const handleSearchProducts = async (): Promise<void> => {
      //@ts-expect-error
      const filter: FilterProps = {};
      if (!searchQuery.length && !shouldUpdateWithNoQuery) return setSearchResults(null);
      /**
       * This filter allows the user to find all products where the products tags, title, tagline or
       * description matches that of a product.
       */
      if (searchQuery.length > 0) {
        if (searchType === "all") {
          filter.or = [
            { tags: { matchPhrasePrefix: searchQuery } },
            { title: { matchPhrasePrefix: searchQuery } },
            { description: { matchPhrasePrefix: searchQuery } },
          ];
        } else {
          filter.or = [{ [searchType]: { matchPhrasePrefix: searchQuery } }];
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
          filter.and = [{ type: { eq: "Cake" } }];
        } else if (!cake && creates) {
          filter.and = [{ type: { eq: "Creates" } }];
        }
      } else {
        /**
         * if there are no admin filters and there is a type, set the filter to return only
         * that type.
         */
        if (type) {
          filter.and = [{ type: { eq: type } }];
        }
      }
      // execute the searchProducts query, with any filters if there are any
      try {
        const { data } = await API.graphql({
          query: searchProducts,
          variables: {
            filter: !_.isEmpty(filter) ? filter : undefined,
            limit: 1000,
          },
          // @ts-ignore
          authMode: "API_KEY",
        });

        const products = data.searchProducts.items;
        // sort the products, so they can be sorted and set into state inside that function.
        sortSearchResults(products);
      } catch (err) {
        setSearch(null);
        setSearchResults(null);
        console.error(err);
      }
    };
    // execute the function
    handleSearchProducts();
  }, [filters, debouncedSearchQuery]);

  const {
    searchType,
    adminFilters,
    sortBy,
    sortDirection,
    shouldUpdateWithNoQuery,
  } = filters;

  return (
    <>
      <ThemeProvider theme={searchFilterTheme}>
        <div className={classes.container}>
          <Grid container spacing={0}>
            <Grid item xs={7}>
              <TextField
                type="text"
                value={searchQuery}
                label="Search Query"
                placeholder="Enter a query..."
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <RefreshRounded
                        style={{ cursor: "pointer" }}
                        onClick={(): void => {
                          dispatch(
                            actions.setSearchFilters({
                              ...filters,
                              shouldUpdateWithNoQuery: false,
                            }),
                          );
                          setSearchQuery("");
                          setSearchResults(null);
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  if (shouldUpdateWithNoQuery) {
                    dispatch(
                      actions.setSearchFilters({
                        ...filters,
                        shouldUpdateWithNoQuery: false,
                      }),
                    );
                  }
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>From</InputLabel>
                <Select
                  variant="outlined"
                  value={searchType}
                  onChange={(e): void => {
                    if (shouldUpdateWithNoQuery) {
                      dispatch(
                        actions.setSearchFilters({
                          ...filters,
                          shouldUpdateWithNoQuery: false,
                        }),
                      );
                    }
                    const searchType = e.target.value;
                    dispatch(
                      actions.setSearchFilters({
                        ...filters,
                        searchType: searchType as SearchType,
                      }),
                    );
                  }}
                  fullWidth
                  margin="dense"
                  label="From"
                  className={classes.select}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="tags">Tags</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container>
            {adminFilters && (
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <FormLabel style={{ marginTop: 12, textAlign: "center" }}>
                    Include
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={adminFilters.cake}
                          onChange={(): void => {
                            const updatedAdmin = {
                              ...adminFilters,
                              cake: !adminFilters.cake,
                            };
                            dispatch(
                              actions.setSearchFilters({
                                ...filters,
                                shouldUpdateWithNoQuery: true,
                                adminFilters: updatedAdmin,
                              }),
                            );
                          }}
                          name="Cakes"
                        />
                      }
                      label="Cakes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={adminFilters.creates}
                          onChange={(): void => {
                            const updatedAdmin = {
                              ...adminFilters,
                              creates: !adminFilters.creates,
                            };
                            dispatch(
                              actions.setSearchFilters({
                                ...filters,
                                shouldUpdateWithNoQuery: true,
                                adminFilters: updatedAdmin,
                              }),
                            );
                          }}
                          name="Creations"
                        />
                      }
                      label="Creations"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={adminFilters ? 4 : 6}>
              <FormControl fullWidth>
                <FormLabel className={classes.formLabel}>Sort By</FormLabel>
                <RadioGroup
                  aria-label="Sort By"
                  name="SortBy"
                  value={sortBy}
                  onChange={(e): void => {
                    dispatch(
                      actions.setSearchFilters({
                        ...filters,
                        shouldUpdateWithNoQuery: true,
                        sortBy: e.target.value as SortBy,
                      }),
                    );
                  }}
                >
                  <FormControlLabel value="createdAt" control={<Radio />} label="Date" />
                  <FormControlLabel value="price" control={<Radio />} label="Price" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={adminFilters ? 4 : 6}>
              <FormControl fullWidth>
                <FormLabel className={classes.formLabel}>Sort Direction</FormLabel>
                <RadioGroup
                  aria-label="sort by ascending"
                  name="sortAscending"
                  value={sortDirection}
                  onChange={(e): void => {
                    dispatch(
                      actions.setSearchFilters({
                        ...filters,
                        shouldUpdateWithNoQuery: true,
                        sortDirection: e.target.value as SortDirection,
                      }),
                    );
                  }}
                >
                  <FormControlLabel value="DESC" control={<Radio />} label="Descending" />
                  <FormControlLabel value="ASC" control={<Radio />} label="Ascending" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    </>
  );
};

export default SearchFilter;
