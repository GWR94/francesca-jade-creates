import React, { useState } from "react";
import {
  Badge,
  Collapse,
  AppBar,
  ClickAwayListener,
  Container,
  useMediaQuery,
  makeStyles,
} from "@material-ui/core";
import Headroom from "react-headroom";
import { useSelector } from "react-redux";
import { MenuRounded } from "@material-ui/icons";
import logo from "../../img/logo.png";
import styles from "./styles/nav.style";
import Links from "./components/Links";
import { AppState } from "../../store/store";
import { COLORS } from "../../themes";

interface NavBarProps {
  signOut: () => void;
  admin: boolean;
}

/**
 * NavBar component which renders relevant links and features to navigate around the
 * site efficiently.
 *
 * TODO
 * [ ] Change color of badge to match one in collapsed navbar (light pink)
 */
const NavBar: React.FC<NavBarProps> = ({ admin, signOut }): JSX.Element => {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const mobile = useMediaQuery("(max-width: 767px)");
  const centerImage = useMediaQuery("(max-width: 979px)");

  const items = useSelector(({ basket }: AppState) => basket.items);
  return (
    <>
      {/* ClickAwayListener closes the NavBar when clicking away from itself */}
      <ClickAwayListener onClickAway={(): void => setNavOpen(false)}>
        {/* 
            Headroom hides the NavBar when scrolling "down", and re-shows it when the
            user scrolls "up".
        */}
        <Headroom wrapperStyle={{ position: "relative", zIndex: 2, height: "50px" }}>
          <AppBar
            className={`${classes.nav} animated slideInDown`}
            position="relative"
            color="transparent"
          >
            <Container className={classes.main}>
              <img
                src={logo}
                alt="Francesca Jade Creates"
                className={centerImage ? classes.logo : classes.logoFixed}
              />
              {/* 
                  If there are any items in the shopping basket and the user is viewing the
                  site on a mobile, show the Badge component around the nav "hamburger" icon
                  with the number of items in the basket.
                 */}
              {mobile && (
                <Badge
                  badgeContent={items.length}
                  color="primary"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  style={{ marginTop: 6, color: COLORS.LightPink }}
                >
                  <MenuRounded
                    onClick={(): void => setNavOpen(!navOpen)}
                    className={classes.menuIcon}
                    style={{ marginTop: -6 }}
                  />
                </Badge>
              )}
              {/* 
                  If the user is not on a mobile device, then show the Links instead
                  of the hamburger icon.
                */}
              {!mobile && (
                <Links
                  closeNav={(): void => setNavOpen(false)}
                  admin={admin}
                  signOut={signOut}
                />
              )}
            </Container>
            {/* 
                If the user is on mobile and navOpen is true, then show the links. The links
                can be collapsed/shown by clicking the hamburger icon.
              */}
            {mobile && (
              <Collapse in={navOpen}>
                <Links
                  mobile
                  closeNav={(): void => setNavOpen(false)}
                  admin={admin}
                  signOut={signOut}
                />
              </Collapse>
            )}
          </AppBar>
        </Headroom>
      </ClickAwayListener>
    </>
  );
};

export default NavBar;
