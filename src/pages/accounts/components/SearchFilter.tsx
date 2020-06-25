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
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { SearchRounded } from "@material-ui/icons";
import { searchFilterTheme, FONTS } from "../../../themes";
import { SearchFilterProps } from "../interfaces/SearchFilter.i";
import { SortMethod, SearchType } from "../interfaces/ProductList.i";

const breakpoints = createBreakpoints({});

const useStyles = makeStyles({
  container: {
    background: "#fff",
    padding: " 24px 24px 12px",
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
 * Component which allows the user to filter out products to fit their needs.
 * @param {(query: string, filters: ProductFilters) => void} setQuery - Function to set the
 * filters and searchQuery into the parent where the search/filter process will begin.
 * @param {boolean} [admin = false] - Boolean value to show if the current authenticated user
 * is an admin.
 * @param {"Cake" | "Creates"} [type = null] - Optional type of product (if any) page where
 * the user has come from (i.e /cake or /creates)
 */
const SearchFilter: React.FC<SearchFilterProps> = ({
  type = null,
  setQuery,
  admin = false,
}): JSX.Element => {
  const [adminFilters, setAdminFilters] = useState({ cake: true, creates: true });
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortMethod>("createdAt");

  const classes = useStyles();

  /**
   * The function which sets the value of the selected Dropdown/Select value
   * and sets it into state as the searchQuery.
   */
  const handleSelect = (e: React.ChangeEvent<{ value: unknown }>): void => {
    // retrieve the type
    const type = e.target.value as SearchType;
    // set the searchType in state so it's not lost after passing the values to parent
    setSearchType(type);
    // pass values to parent so searching/filtering can begin.
    setQuery(searchQuery, { adminFilters, searchType: type, sortBy });
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
                placeholder="Enter a search query..."
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded />
                    </InputAdornment>
                  ),
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  setSearchQuery(e.target.value);
                  setQuery(searchQuery, { adminFilters, searchType, sortBy });
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>From</InputLabel>
                <Select
                  variant="outlined"
                  value={searchType}
                  onChange={handleSelect}
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
              <Grid container spacing={1}>
                {!type && (
                  <Grid item xs={6}>
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
                                setQuery(searchQuery, {
                                  adminFilters: filters,
                                  searchType,
                                  sortBy,
                                });
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
                                setQuery(searchQuery, {
                                  adminFilters: filters,
                                  searchType,
                                  sortBy,
                                });
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
                <Grid item xs={type ? 12 : 6}>
                  <FormControl
                    component="fieldset"
                    className="new-product__radio-container"
                  >
                    <FormLabel style={{ marginTop: 12 }}>Sorting Method</FormLabel>
                    <RadioGroup
                      aria-label="Sort by filters"
                      name="Sort By"
                      value={sortBy}
                      row={!!type}
                      onChange={(e): void => {
                        const sort = e.currentTarget.value as SortMethod;
                        setSortBy(sort);
                        setQuery(searchQuery, {
                          adminFilters,
                          searchType,
                          sortBy: sort,
                        });
                      }}
                      style={{ justifyContent: type ? "center" : undefined }}
                    >
                      <FormControlLabel
                        value="createdAt"
                        control={<Radio />}
                        label="Last Created"
                      />
                      <FormControlLabel
                        value="updatedAt"
                        control={<Radio />}
                        label="Last Updated"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
        </div>
      </ThemeProvider>
    </>
  );
};

export default SearchFilter;
