import { makeStyles, Paper, Tab, Tabs, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { breakpoints } from "../../../themes";
import PopularThemes from "./PopularThemes";
import SearchThemes from "./SearchThemes";

interface ThemesProps {
  admin: boolean;
}

type ThemeTabs = "popular" | "search";

interface ThemesState {
  theme: string;
  currentTab: ThemeTabs;
}
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
    text: {
      fontSize: "1.1rem",
      width: "70%",
      margin: "0 auto 10px",
    },
    selectText: {
      color: "rgba(0,0,0,0.6)",
      fontSize: "1rem",
      textAlign: "center",
      marginBottom: 0,
    },
  });
  const classes = useStyles();

  const [state, setState] = useState<ThemesState>({
    currentTab: "popular",
    theme: "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get("current");
    if (theme) {
      setState({
        ...state,
        theme,
        currentTab: "search",
      });
    }
  }, [window.location.search]);

  const renderCurrentTab = (): JSX.Element | null => {
    const { currentTab, theme } = state;
    let renderedTab: JSX.Element | null = null;
    switch (currentTab) {
      case "popular":
        renderedTab = <PopularThemes />;
        break;
      case "search":
        renderedTab = <SearchThemes selectedTheme={theme} admin={admin} />;
        break;
    }
    return renderedTab;
  };

  const { currentTab } = state;

  return (
    <div className="content-container">
      <Typography variant="h4" style={{ paddingTop: 12 }} gutterBottom>
        Themes
      </Typography>
      <Typography variant="subtitle1" className={classes.text}>
        Whether it&apos;s a Minion themed cake for the kids, a beautiful bespoke frame for
        a wedding, or some cupcakes for a birthday party - we&apos;ve got you covered!
      </Typography>
      <Typography className={classes.selectText}>
        Click on any of the popular themes below to view the products, or alternatively
        search through all the themes by clicking the &apos;Search Themes&apos; tab below.
      </Typography>
      <Paper elevation={3} className={classes.tabContainer}>
        <Tabs
          value={currentTab}
          onChange={(_event: React.ChangeEvent<{}>, currentTab: ThemeTabs): void => {
            setState({ ...state, currentTab });
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
