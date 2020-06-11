import React from "react";
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
} from "@material-ui/core";
import { SearchRounded } from "@material-ui/icons";
import { searchFilterTheme } from "../themes";
import { SearchFilterProps, SearchFilterState } from "./interfaces/SearchFilter.i";
import { sortMethod } from "../pages/accounts/interfaces/ProductList.i";

/**
 * TODO
 * [ ] Fix radio buttons on smaller devices (don't do inline)
 */

class SearchFilter extends React.Component<SearchFilterProps, SearchFilterState> {
  public readonly state: SearchFilterState = {
    adminFilters: {
      cake: true,
      creates: true,
    },
    searchQuery: "all",
    query: "",
    sortBy: "createdAt",
  };

  /**
   * The function which sets the value of the selected Dropdown/Select value
   * and sets it into state as the searchQuery.
   */
  private handleSelect = (e: React.ChangeEvent<{ value: unknown }>): void => {
    const { setQuery } = this.props;
    const { query, adminFilters, sortBy } = this.state;
    const searchQuery = e.target.value as string;
    this.setState({ searchQuery });
    setQuery(query, { adminFilters, searchQuery, sortBy });
  };

  public render(): JSX.Element {
    const { adminFilters, searchQuery, query, sortBy } = this.state;
    const { setQuery, admin, type } = this.props;
    console.log(sortBy);

    return (
      <>
        <ThemeProvider theme={searchFilterTheme}>
          <div className="filter__container">
            <Grid container spacing={0}>
              <Grid item xs={7}>
                <TextField
                  type="text"
                  value={query}
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
                    this.setState({ query: e.target.value });
                    setQuery(query, { adminFilters, searchQuery, sortBy });
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>From</InputLabel>
                  <Select
                    variant="outlined"
                    value={searchQuery}
                    onChange={this.handleSelect}
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
                                  this.setState({
                                    adminFilters: filters,
                                  });
                                  setQuery(query, {
                                    adminFilters: filters,
                                    searchQuery,
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
                                  this.setState({
                                    adminFilters: filters,
                                  });
                                  setQuery(query, {
                                    adminFilters: filters,
                                    searchQuery,
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
                          const sort = e.currentTarget.value as sortMethod;
                          this.setState({ sortBy: sort });
                          setQuery(query, {
                            adminFilters,
                            searchQuery,
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
  }
}

export default SearchFilter;
