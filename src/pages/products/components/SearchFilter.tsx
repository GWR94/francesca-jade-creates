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
  Drawer,
} from "@material-ui/core";
import { useDebounce } from "use-debounce";
import { useDispatch, useSelector } from "react-redux";
import { SearchRounded, RefreshRounded } from "@material-ui/icons";
import _ from "underscore";
import { searchFilterTheme } from "../../../themes";
import { SearchFilterProps } from "../interfaces/SearchFilter.i";
import { AppState } from "../../../store/store";
import { SearchType, SortBy, SortDirection } from "../../../interfaces/products.redux.i";
import * as actions from "../../../actions/products.actions";
import styles from "../../accounts/styles/searchFilter.style";

interface SearchFilterState {
  searchType: SearchType;
  cakeSelected: boolean;
  createsSelected: boolean;
  sortDirection: SortDirection;
  sortBy: SortBy;
}

/**
 * Component which allows the user to filter out products to fit their needs.
 * @param admin = false - Boolean value to show if the current authenticated user
 * is an admin.
 * @param type = null - Optional type of product (if any) page where
 * the user has come from (i.e /cake or /creates)
 * @param setSearchResults - Function to update the search results into state inside
 * the parent component.
 */
const SearchFilter: React.FC<SearchFilterProps> = ({
  admin,
  type = null,
  filterOpen,
  closeDrawer,
}): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [state, setState] = useState<SearchFilterState>({
    searchType: "all",
    cakeSelected: true,
    createsSelected: true,
    sortDirection: "ASC",
    sortBy: "updatedAt",
  });

  const { searchType, cakeSelected, createsSelected } = state;

  // create state for searchQuery to be held within.
  const [searchQuery, setSearchQuery] = useState<string>("");
  /**
   * the debounced search query will only change its value 500 milliseconds
   * after the user has finished typing
   */
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const dispatch = useDispatch();

  const { filters, sortBy, sortDirection } = useSelector(
    ({ products }: AppState) => products,
  );

  useEffect(() => {
    if (!filterOpen) return;
    if (searchQuery.length > 0) {
      if (searchType === "all") {
        dispatch(
          actions.setSearchFilters({
            or: [
              {
                tags: {
                  contains:
                    debouncedSearchQuery.substring(0, 1).toUpperCase() +
                    debouncedSearchQuery.substring(1).toLowerCase(),
                },
              },
              {
                searchField: { contains: debouncedSearchQuery.toLowerCase() },
              },
            ],
            and: type ? [{ type: { eq: type } }] : null,
          }),
        );
      } else if (searchType === "themes") {
        dispatch(
          actions.setSearchFilters({
            tags: { contains: debouncedSearchQuery },
            and: type ? [{ type: { eq: type } }] : null,
          }),
        );
      } else {
        dispatch(
          actions.setSearchFilters({
            searchField: { contains: debouncedSearchQuery },
            and: type ? [{ type: { eq: type } }] : null,
          }),
        );
      }
    } else {
      dispatch(actions.resetSearchFilters());
    }
    dispatch(actions.getProducts());
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (!filterOpen) return;
    if ((cakeSelected && !createsSelected) || type === "Cake") {
      dispatch(
        actions.setSearchFilters({
          ...filters,
          and: [
            {
              type: { eq: "Cake" },
            },
          ],
        }),
      );
    } else if ((!cakeSelected && createsSelected) || type === "Creates") {
      dispatch(
        actions.setSearchFilters({
          ...filters,
          and: [
            {
              type: { eq: "Creates" },
            },
          ],
        }),
      );
    } else {
      // remove and as there is no need if cakes & creates are equal
      delete filters?.and;
      if (_.isEmpty(filters)) {
        dispatch(actions.resetSearchFilters);
      } else {
        dispatch(
          actions.setSearchFilters({
            ...filters,
          }),
        );
      }
    }
    dispatch(actions.getProducts());
  }, [cakeSelected, createsSelected, type]);

  return (
    <Drawer
      open={filterOpen}
      anchor="top"
      ModalProps={{
        // If the user clicks outside the drawer, it will close
        onBackdropClick: closeDrawer,
        // disable the default scroll lock so the user can still scroll while open
        disableScrollLock: true,
      }}
      SlideProps={{
        unmountOnExit: false,
      }}
    >
      <ThemeProvider theme={searchFilterTheme}>
        <div className={classes.container}>
          <Grid container spacing={0}>
            <Grid item xs={7}>
              {/* create searchQuery text input */}
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
                    // show search icon at the start of input
                    <InputAdornment position="start">
                      <SearchRounded />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    // show refresh button at end of input
                    <InputAdornment position="end">
                      <RefreshRounded
                        style={{ cursor: "pointer" }}
                        // when clicking button, it resets all inputs and puts search results back to default
                        onClick={(): void => {
                          dispatch(actions.resetSearchFilters());
                          dispatch(actions.getProducts());
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  // retrieve user input
                  const query = e.target.value;
                  // set query into state
                  setSearchQuery(query);
                }}
              />
            </Grid>
            <Grid item xs={5}>
              {/* create Select input to choose searchType filter */}
              <FormControl variant="outlined" fullWidth>
                <InputLabel>From</InputLabel>
                <Select
                  variant="outlined"
                  value={searchType}
                  onChange={(e): void =>
                    setState({ ...state, searchType: e.target.value as SearchType })
                  }
                  fullWidth
                  margin="dense"
                  label="From"
                  className={classes.select}
                >
                  {/* create all MenuItem's for use inside the Select input */}
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="tags">Themes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container>
            {/* only show adminFilters checkboxes if admin boolean is true and adminFilters isn't null */}
            {!type && admin && (
              <Grid item xs={4}>
                {/* create Checkbox component for selecting adminFilters (cake/creates filters) */}
                <FormControl fullWidth>
                  <FormLabel style={{ marginTop: 12, textAlign: "center" }}>
                    Include
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        // create Checkbox for cake
                        <Checkbox
                          checked={cakeSelected}
                          onChange={(): void => {
                            // turn true to false and vice versa when changing
                            setState({ ...state, cakeSelected: !cakeSelected });
                            // update adminFilters and shouldUpdateWithNoQuery in redux store
                            if (cakeSelected === createsSelected) {
                              dispatch(actions.resetSearchFilters());
                            } else {
                              dispatch(
                                actions.setSearchFilters({
                                  ...filters,
                                  and: [
                                    {
                                      type: { eq: "Cake" },
                                    },
                                  ],
                                }),
                              );
                              dispatch(actions.getProducts());
                            }
                          }}
                          name="Cakes"
                        />
                      }
                      label="Cakes"
                    />
                    <FormControlLabel
                      control={
                        // create Checkbox for creates
                        <Checkbox
                          checked={createsSelected}
                          onChange={(): void => {
                            // turn true to false and vice versa when changing
                            setState({
                              ...state,
                              createsSelected: !createsSelected,
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
            {/* 
              If adminFilters is not null and admin is true, set the width to 4, otherwise 6 as
              it will need to fill rest of container.
             */}
            <Grid item xs={!type && admin ? 4 : 6}>
              {/* Create RadioGroup (radio buttons) for sort by filter */}
              <FormControl fullWidth>
                <FormLabel className={classes.formLabel}>Sort By</FormLabel>
                <RadioGroup
                  aria-label="Sort By"
                  name="SortBy"
                  value={sortBy}
                  onChange={(): void => {
                    dispatch(
                      actions.setSortBy(
                        sortDirection,
                        sortBy === "price" ? "updatedAt" : "price",
                      ),
                    );
                    dispatch(actions.getProducts());
                  }}
                >
                  {/* Create Radio buttons for each filter */}
                  <FormControlLabel
                    value="updatedAt"
                    control={<Radio />}
                    label={!type && admin ? "Date" : "Date Added"}
                  />
                  <FormControlLabel
                    value="price"
                    disabled={type === "Cake"}
                    control={<Radio />}
                    label="Price"
                    style={{
                      cursor: type === "Cake" ? "not-allowed" : "pointer",
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            {/* 
              If adminFilters is not null and admin is true, set the width to 4, otherwise 6 as
              it will need to fill rest of container.
             */}
            <Grid item xs={!type && admin ? 4 : 6}>
              {/* Create RadioGroup (radio buttons) for sort direction filter */}
              <FormControl fullWidth>
                <FormLabel className={classes.formLabel}>Sort Direction</FormLabel>
                <RadioGroup
                  aria-label="sort by ascending"
                  name="sortAscending"
                  value={sortDirection}
                  onChange={(): void => {
                    dispatch(
                      actions.setSortBy(sortDirection === "ASC" ? "DESC" : "ASC", sortBy),
                    );
                    dispatch(actions.getProducts());
                  }}
                >
                  {/* Create Radio buttons for each filter */}
                  <FormControlLabel value="DESC" control={<Radio />} label="Descending" />
                  <FormControlLabel value="ASC" control={<Radio />} label="Ascending" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    </Drawer>
  );
};

export default SearchFilter;
