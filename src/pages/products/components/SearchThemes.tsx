import { makeStyles, TextField } from "@material-ui/core";
import { SearchRounded } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import NonIdealState from "../../../common/containers/NonIdealState";
import { themes } from "../../../utils/data";
import ProductsList from "./ProductsList";
import * as actions from "../../../actions/products.actions";

interface SearchThemesProps {
  selectedTheme: string;
  admin: boolean;
}

const SearchThemes: React.FC<SearchThemesProps> = ({
  selectedTheme,
  admin,
}): JSX.Element => {
  const [theme, setTheme] = useState<string>(selectedTheme || "");
  const dispatch = useDispatch();

  const handleSetTheme = (theme: string): void => {
    dispatch(
      actions.setSearchFilters({
        tags: {
          contains: theme,
        },
      }),
    );
    dispatch(actions.getProducts());
    setTheme(theme);
  };

  useEffect(() => {
    handleSetTheme(theme);
  }, []);

  const useStyles = makeStyles({
    input: {
      width: 220,
      margin: "0 auto",
    },
  });
  const classes = useStyles();

  const handleThemeChange = (
    _event: React.ChangeEvent<{}>,
    theme: string | null,
  ): void => {
    handleSetTheme(theme as string);
  };

  return (
    <div>
      <Autocomplete
        options={themes}
        className={classes.input}
        value={theme}
        onChange={handleThemeChange}
        renderInput={(params): JSX.Element => (
          <TextField
            {...params}
            label="Search Themes"
            margin="normal"
            variant="outlined"
          />
        )}
      />
      {theme ? (
        <ProductsList admin={admin} theme={theme} />
      ) : (
        <NonIdealState
          title="Please enter a theme to begin the search"
          Icon={<SearchRounded style={{ height: 40, width: 40 }} />}
          subtext="Or view other products below"
        />
      )}
    </div>
  );
};

export default SearchThemes;
