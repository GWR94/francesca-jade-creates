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
import { SearchRounded, RefreshRounded, TrendingDown } from "@material-ui/icons";
import { searchFilterTheme, FONTS } from "../../../themes";
import {
  SearchFilterProps,
  AdminFilters,
  SortMethod,
} from "../interfaces/SearchFilter.i";
import { SearchType, FilterProps, SortDirection } from "../interfaces/ProductList.i";
import { searchProducts } from "../../../graphql/queries";
import { ProductProps } from "../interfaces/Product.i";
import { Variant } from "../interfaces/Variants.i";

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
 * [ ] Add filters
 * [ ] Add
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
  const [adminFilters, setAdminFilters] = useState<AdminFilters>({
    cake: type === "Cake" ? true : false,
    creates: type ? (type === "Creates" ? true : false) : true,
  });
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [sortDirection, setSortDirection] = useState<"DESC" | "ASC">("DESC");
  const [updateWithNoQuery, setUpdateNoQuery] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [searchResults, setSearch] = useState<ProductProps[]>([]);
  const [disabledPrice, setDisablePrice] = useState<boolean>(false);

  const getMin = (variants: Variant[]): number => {
    let min = Infinity;
    variants.forEach((variant) => {
      min = Math.min(min, variant.price.item + variant.price.postage);
    });
    console.log(min);
    return min;
  };

  const sortSearchResults = (products = searchResults): void => {
    let sorted: ProductProps[] = [];
    if (sortBy === "price") {
      sorted = products.sort((a: ProductProps, b: ProductProps) => {
        if (getMin(a.variants) === Infinity || getMin(b.variants) === Infinity)
          return sortDirection === "DESC" ? -1 : 1;
        return getMin(a.variants) < getMin(b.variants)
          ? sortDirection === "DESC"
            ? 1
            : -1
          : sortDirection === "DESC"
          ? -1
          : 1;
      });
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
    console.log(sorted);
    setSearchResults(sorted);
  };

  // TODO
  // [ ] disable price when selected cakes

  useEffect(() => {
    const handleSearchProducts = async (): Promise<void> => {
      const filter: FilterProps = {};
      if (!searchQuery.length && !updateWithNoQuery) return setSearchResults(null);
      /**
       * This filter allows the user to find all products where the products tags, title, tagline or
       * description matches that of a product.
       */
      if (!updateWithNoQuery) {
        filter.or = [
          { tags: { matchPhrasePrefix: searchQuery } },
          { title: { matchPhrasePrefix: searchQuery } },
          { description: { matchPhrasePrefix: searchQuery } },
        ];
      } else {
        if (searchType === "all") {
          filter.or = [
            {
              type: { eq: "Cake" },
            },
            {
              type: { eq: "Creates" },
            },
          ];
        }
      }

      if (type) {
        filter.and = [{ type: { eq: type } }];
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
      }

      try {
        const { data } = await API.graphql({
          query: searchProducts,
          variables: {
            filter,
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
  }, [adminFilters, searchType, searchQuery, sortBy, sortDirection]);

  // useEffect(() => {
  //   sortSearchResults();
  // }, [searchResults, sortBy, sortDirection]);

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
                          setUpdateNoQuery(false);
                          setSearchQuery("");
                          setSearchResults(null);
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  setUpdateNoQuery(false);
                  const query = e.target.value;
                  setSearchQuery(query);
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
                    setUpdateNoQuery(false);
                    const searchType = e.target.value;
                    setSearchType(searchType as SearchType);
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
          {admin && (
            <Grid container>
              {!type && (
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <FormLabel style={{ marginTop: 12, textAlign: "left" }}>
                      Include
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={adminFilters.cake}
                            onChange={(): void => {
                              const updatedCake = !adminFilters.cake;
                              const filters = {
                                ...adminFilters,
                                cake: updatedCake,
                              };
                              if (updatedCake) {
                                setDisablePrice(true);
                                setSortBy("createdAt");
                              } else {
                                setDisablePrice(false);
                              }
                              setUpdateNoQuery(true);
                              setAdminFilters(filters);
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
                              const filters = {
                                ...adminFilters,
                                creates: !adminFilters.creates,
                              };
                              setUpdateNoQuery(true);
                              setAdminFilters(filters);
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
              <Grid item xs={type ? 6 : 4}>
                <FormControl fullWidth>
                  <FormLabel style={{ marginTop: 12, textAlign: "left" }}>
                    Sort By
                  </FormLabel>
                  <RadioGroup
                    aria-label="Sort By"
                    name="SortBy"
                    value={sortBy}
                    onChange={(e): void => {
                      setUpdateNoQuery(true);
                      setSortBy(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="createdAt"
                      control={<Radio />}
                      label="Date"
                    />
                    <FormControlLabel
                      value="price"
                      control={<Radio />}
                      disabled={disabledPrice}
                      label="Price"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={type ? 6 : 4}>
                <FormControl fullWidth>
                  <FormLabel style={{ marginTop: 12, textAlign: "left" }}>
                    Sort Direction
                  </FormLabel>
                  <RadioGroup
                    aria-label="sort by ascending"
                    name="sortAscending"
                    value={sortDirection}
                    onChange={(e): void => {
                      setUpdateNoQuery(true);
                      setSortDirection(e.target.value as SortDirection);
                    }}
                  >
                    <FormControlLabel
                      value="DESC"
                      control={<Radio />}
                      label="Descending"
                    />
                    <FormControlLabel value="ASC" control={<Radio />} label="Ascending" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </div>
      </ThemeProvider>
    </>
  );
};

export default SearchFilter;
