import { makeStyles, TextField } from "@material-ui/core";
import { SearchRounded } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import NonIdealState from "../../../common/containers/NonIdealState";
import { themes } from "../../../utils/data";
import ProductsList from "./ProductsList";

interface SearchThemesProps {
  selectedTheme: string;
  admin: boolean;
}

const SearchThemes: React.FC<SearchThemesProps> = ({
  selectedTheme,
  admin,
}): JSX.Element => {
  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    setTheme(selectedTheme);
    return (): void => {
      setTheme("");
    };
  }, [selectedTheme]);

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
    setTheme(theme as string);
  };

  return (
    <div>
      <Autocomplete
        freeSolo
        options={themes}
        className={classes.input}
        value={selectedTheme}
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
          Icon={<SearchRounded />}
          subtext="Or view other products below"
        />
      )}
    </div>
  );
};

export default SearchThemes;
