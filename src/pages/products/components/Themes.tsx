import { makeStyles, Paper, Tab, Tabs, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { breakpoints } from "../../../themes";
import PopularThemes from "./PopularThemes";
import SearchThemes from "./SearchThemes";

interface ThemesProps {
  admin: boolean;
}

type ThemeTabs = "popular" | "search";

const Themes: React.FC<ThemesProps> = ({ admin }) => {
  const useStyles = makeStyles({
    tabContainer: {
      width: "90%",
      margin: "20px auto 0",
      padding: "0 20px 20px 20px",
      boxSizing: "border-box",
      [breakpoints.down("sm")]: {
        width: "100%",
      },
    },
  });
  const classes = useStyles();

  const [currentTab, setCurrentTab] = useState<ThemeTabs>("popular");
  const [theme, setTheme] = useState<string>("");

  const renderCurrentTab = (): JSX.Element | null => {
    let renderedTab: JSX.Element | null = null;
    switch (currentTab) {
      case "popular":
        renderedTab = (
          <PopularThemes
            handleSelectTheme={(theme): void => {
              setTheme(theme);
              setCurrentTab("search");
            }}
          />
        );
        break;
      case "search":
        renderedTab = <SearchThemes selectedTheme={theme} admin={admin} />;
        break;
    }
    return renderedTab;
  };

  return (
    <div className="content-container">
      <Typography variant="h4" style={{ paddingTop: 12 }} gutterBottom>
        Themes
      </Typography>
      <Typography variant="subtitle1">
        Pick one of the most popular themes below, or select the "Search Themes" tab to
        filter to a specific theme.
      </Typography>
      <Paper elevation={3} className={classes.tabContainer}>
        <Tabs
          value={currentTab}
          onChange={(_event: React.ChangeEvent<{}>, currentTab: string): void => {
            setCurrentTab(currentTab as ThemeTabs);
          }}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab value="popular" label="Popular Themes" />
          <Tab value="search" label="Search Themes" />
        </Tabs>
        {renderCurrentTab()}
      </Paper>
    </div>
  );
};

export default Themes;
