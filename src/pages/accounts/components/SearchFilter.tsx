import React, { useState } from "react";
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
import { SearchRounded, RefreshRounded } from "@material-ui/icons";
import { searchFilterTheme, FONTS } from "../../../themes";
import {
  SearchFilterProps,
  AdminFilters,
  SortMethod,
} from "../interfaces/SearchFilter.i";
import { SearchType, FilterProps } from "../interfaces/ProductList.i";
import { searchProducts } from "../../../graphql/queries";

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

  const handleSearchProducts = async (updateWithNoQuery?: boolean): Promise<void> => {
    const filter: FilterProps = {};
    if (!searchQuery.length && !updateWithNoQuery) return setSearchResults(null);
    // if (!searchQuery || (!searchQuery && !adminFilters)) return dispatch(searchProductsFailure());
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
          limit: 12,
        },
        // @ts-ignore
        authMode: "API_KEY",
      });
      console.log(data);
      setSearchResults(data.searchProducts.items);
    } catch (err) {
      setSearchResults(null);
      console.error(err);
    }
  };

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
                  handleSearchProducts();
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
                    const searchType = e.target.value;
                    setSearchType(searchType as SearchType);
                    handleSearchProducts();
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
            <>
              {!type && (
                <FormControl fullWidth>
                  <FormLabel style={{ marginTop: 12 }}>Include</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={adminFilters.cake}
                          onChange={(): void => {
                            const filters = {
                              ...adminFilters,
                              cake: !adminFilters.cake,
                            };
                            setAdminFilters(filters);
                            handleSearchProducts(true);
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
                            setAdminFilters(filters);
                            handleSearchProducts(true);
                          }}
                          name="Creations"
                        />
                      }
                      label="Creations"
                    />
                  </FormGroup>
                </FormControl>
              )}
            </>
          )}
        </div>
      </ThemeProvider>
    </>
  );
};

export default SearchFilter;
