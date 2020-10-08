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
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { useDispatch, useSelector } from "react-redux";
import _ from "underscore";
import { SearchRounded, RefreshRounded } from "@material-ui/icons";
import { SearchType, FilterProps, SortDirection } from "../interfaces/ProductList.i";
import { searchFilterTheme, FONTS } from "../../../themes";
import { SearchFilterProps } from "../interfaces/SearchFilter.i";
import { searchProducts } from "../../../graphql/queries";
import { ProductProps } from "../interfaces/Product.i";
import { Variant } from "../interfaces/Variants.i";
import { AppState } from "../../../store/store";
import { FilterActionProps, SortBy } from "../../../interfaces/products.redux.i";
import * as actions from "../../../actions/products.actions";

const breakpoints = createBreakpoints({});

const useStyles = makeStyles({
  container: {
    background: "#fff",
    padding: 24,
    boxSizing: "border-box",
    width: "400px",
    margin: "0 auto",
    fontFamily: FONTS.Title,
    borderRadius: 6,
    WebkitBorderRadius: 6,
    MozBorderRadius: 6,
    [breakpoints.down("xs")]: {
      width: "100%",
    },
  },
});

/**
 * TODO
 * [x] disable price when selected cakes - no longer needed (fixed)
 * [ ] Sort out success page
 * [ ] Sort out basket
 * [x] Test filter properly
 * [x] Fix hamburger icon
 * [x] Put nav links in container, and center logo
 */

/**
 * Component which allows the user to filter out products to fit their needs.
 * @param {(query: string, filters: ProductFilters) => void} setQuery - Function to set the
 * filters and searchQuery into the parent where the search/filter process will begin.
 * @param {boolean} [admin = false] - Boolean value to show if the current authenticated user
 * is an admin.
 * @param {"Cake" | "Creates"} [type = null] - Optional type of product (if any) page where
 * the user has come from (i.e /cake or /creates)
 */
const SearchFilter: React.FC<SearchFilterProps> = ({
  admin,
  type = null,
  setSearchResults,
}): JSX.Element => {
  const classes = useStyles();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearch] = useState<ProductProps[] | null>([]);

  const dispatch = useDispatch();

  const filters: FilterActionProps = useSelector(
    ({ products }: AppState) => products.filters,
  );

  const getMinPriceFromVariants = (variants: Variant[]): number => {
    let min = Infinity;
    variants.forEach((variant) => {
      min = Math.min(min, variant.price.item + variant.price.postage);
    });
    return min;
  };

  const sortSearchResults = (products = searchResults): void => {
    const { sortBy, sortDirection } = filters;
    let sorted: ProductProps[] = [];
    if (!products) return setSearchResults(null);
    if (sortBy === "price") {
      const cakes = products.filter((product) => product.type === "Cake");
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
       * place cakes after creates because cakes do not have a set price so they
       * should be placed after.
       */

      sortDirection === "DESC"
        ? (sorted = [...creates, ...cakes])
        : (sorted = [...cakes, ...creates]);
    } else {
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

  useEffect(() => {
    const { searchType, adminFilters, shouldUpdateWithNoQuery } = filters;

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
        if (type) {
          filter.and = [{ type: { eq: type } }];
        }
      }

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
        sortSearchResults(products);
      } catch (err) {
        setSearch(null);
        setSearchResults(null);
        console.error(err);
      }
    };

    handleSearchProducts();
  }, [filters, searchQuery]);

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
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderLeft: "none",
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    marginLeft: -1,
                  }}
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
                <FormLabel style={{ marginTop: 12, textAlign: "center" }}>
                  Sort By
                </FormLabel>
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
                <FormLabel style={{ marginTop: 12, textAlign: "center" }}>
                  Sort Direction
                </FormLabel>
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
