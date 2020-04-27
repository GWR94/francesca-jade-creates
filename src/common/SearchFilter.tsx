import React, { FormEvent } from "react";

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
  ClickAwayListener,
  withStyles,
  ThemeProvider,
  FormGroup,
  Checkbox,
  FormHelperText,
  InputLabel,
} from "@material-ui/core";
import { SearchRounded } from "@material-ui/icons";
import { ControlGroup } from "@blueprintjs/core";
import { styles, searchFilterTheme } from "../themes";

interface Props {
  type?: string;
  setQuery: (query, filters) => void;
  admin?: boolean;
}

interface State {
  adminFilters: {
    cake: boolean;
    creates: boolean;
  };
  searchQuery: string;
  query: string;
  sortBy: string;
}

/**
 * TODO
 * [ ] Fix radio buttons on smaller devices (don't do inline)
 */

class SearchFilter extends React.Component<Props, State> {
  public readonly state = {
    adminFilters: {
      cake: true,
      creates: true,
    },
    searchQuery: "all",
    query: "",
    sortBy: "createdAt",
  };

  private handleSelect = (e: React.ChangeEvent<{ value: unknown }>): void => {
    this.setState({
      searchQuery: e.target.value as string,
    });
  };

  public render(): JSX.Element {
    const { adminFilters, searchQuery, query, sortBy } = this.state;
    const { setQuery, admin } = this.props;

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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    this.setState({ query: e.target.value })
                  }
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
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <FormLabel style={{ marginTop: 12 }}>Include</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={adminFilters.cake}
                              onChange={(): void =>
                                this.setState({
                                  adminFilters: {
                                    ...adminFilters,
                                    cake: !adminFilters.cake,
                                  },
                                })
                              }
                              name="Cakes"
                            />
                          }
                          label="Cakes"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={adminFilters.creates}
                              onChange={(): void =>
                                this.setState({
                                  adminFilters: {
                                    ...adminFilters,
                                    creates: !adminFilters.creates,
                                  },
                                })
                              }
                              name="Creations"
                            />
                          }
                          label="Creations"
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      component="fieldset"
                      className="new-product__radio-container"
                    >
                      <FormLabel style={{ marginTop: 12 }}>Sorting Method</FormLabel>
                      <RadioGroup
                        aria-label="Sort by filters"
                        name="Sort By"
                        value={sortBy}
                        onChange={(e): void =>
                          this.setState({ sortBy: e.currentTarget.value })
                        }
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
