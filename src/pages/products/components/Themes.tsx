import {
  Container,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { breakpoints } from "../../../themes";
import PopularThemes from "./PopularThemes";
import SearchThemes from "./SearchThemes";

interface ThemesProps {
  admin: boolean;
  switchToSearch: (theme: string) => void;
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
      margin: "0 auto",
      padding: "0 20px 20px 20px",
      userSelect: "none",
      boxSizing: "border-box",
      [breakpoints.down("sm")]: {
        width: "100%",
      },
    },
    text: {
      fontSize: "1rem",
      lineHeight: 1.2,
      textAlign: "justify",
      margin: "10px auto 20px",
      width: 800,
      [breakpoints.down("md")]: {
        width: 620,
      },
      [breakpoints.down("sm")]: {
        width: "90%",
      },
    },
    selectText: {
      color: "rgba(0,0,0,0.6)",
      fontSize: "0.9rem",
      textAlign: "center",
      lineHeight: 1.1,
      margin: "10px auto",
    },
  });
  const classes = useStyles();

  const [state, setState] = useState<ThemesState>({
    currentTab: "popular",
    theme: "",
  });

  /**
   * Retrieve theme from url if it exists, and set it into state and switch
   * to search
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get("current");
    if (theme) {
      setState({ theme, currentTab: "search" });
      urlParams.delete("current");
    }
  }, []);

  const isSmallMobile = useMediaQuery("(max-width: 340px");

  const { currentTab, theme } = state;

  return (
    <div className="content-container">
      <Container>
        <Typography variant="h4" style={{ paddingTop: 12 }} gutterBottom>
          Themes
        </Typography>
        <div>
          <Typography variant="subtitle1" className={classes.text}>
            Whether it&apos;s a Minion themed cake for the kids, a beautiful bespoke frame
            for a wedding, or some cupcakes for a birthday party - we&apos;ve got you
            covered!
          </Typography>
          <Typography variant="subtitle2" className={classes.selectText}>
            Click on any of the popular themes below to view the products, or
            alternatively search through all the themes by clicking the &apos;Search
            Themes&apos; tab below.
          </Typography>
        </div>
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
            <Tab value="popular" label={isSmallMobile ? "Popular" : "Popular Themes"} />
            <Tab value="search" label={isSmallMobile ? "Search" : "Search Themes"} />
          </Tabs>
          {currentTab === "search" ? (
            <SearchThemes selectedTheme={theme} admin={admin} />
          ) : (
            <PopularThemes
              switchToSearch={(theme): void =>
                setState({ ...state, currentTab: "search", theme })
              }
            />
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Themes;
