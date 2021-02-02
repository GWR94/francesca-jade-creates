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
import { Auth } from "aws-amplify";
import Headroom from "react-headroom";
import { useDispatch, useSelector } from "react-redux";
import { MenuRounded } from "@material-ui/icons";
import { useHistory, useLocation } from "react-router-dom";
import logo from "../../img/logo.png";
import styles from "./styles/nav.style";
import Links from "./components/Links";
import { AppState } from "../../store/store";
import { COLORS } from "../../themes";
import { openSnackbar } from "../../utils/Notifier";
import * as userActions from "../../actions/user.actions";
import * as basketActions from "../../actions/basket.actions";

/**
 * NavBar component which renders relevant links and features to navigate around the
 * site efficiently.
 */
const NavBar: React.FC = (): JSX.Element => {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const location = useLocation();

  const { admin } = useSelector(({ user }: AppState) => user);

  const mobile = useMediaQuery("(max-width: 767px)");
  const centerImage = useMediaQuery("(max-width: 979px)");

  const dispatch = useDispatch();
  const history = useHistory();

  /**
   * Function to sign out the current authenticated user, and remove all of their properties from
   * state. It will also clear the basket/user from redux stores so all user information is wiped
   * from the system.
   */
  const handleSignOut = async (): Promise<void> => {
    try {
      // try to sign out
      await Auth.signOut();
      // clear basket reducer
      dispatch(basketActions.clearBasket());
      // clear user reducer
      dispatch(userActions.clearUser());
      // notify the user of success
      openSnackbar({
        severity: "success",
        message: "Successfully signed out.",
      });
    } catch (err) {
      // notify the user of error signing out
      openSnackbar({
        severity: "error",
        message: "Error signing out. Please try again.",
      });
    }
    // push to home page
    history.push("/");
  };

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
            className={`${classes.nav} animate__animated animate__slideInDown`}
            position="relative"
            style={{
              background: location.pathname.length <= 1 ? "transparent" : "#fff",
            }}
            elevation={location.pathname.length <= 1 ? 0 : 4}
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
                    onClick={(): void => {
                      location.pathname.length <= 1
                        ? history.push("/cakes")
                        : setNavOpen(!navOpen);
                    }}
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
                  signOut={handleSignOut}
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
                  signOut={handleSignOut}
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
