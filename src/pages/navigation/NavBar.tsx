import React from "react";
import {
  Badge,
  Collapse,
  withStyles,
  AppBar,
  ClickAwayListener,
  Container,
} from "@material-ui/core";
import Headroom from "react-headroom";
import { MenuRounded } from "@material-ui/icons";
import logo from "../../img/logo.png";
import { NavBarState, NavbarDispatchProps } from "./interfaces/NavBar.i";
import styles from "./styles/nav.style";
import Links from "./components/Links";

/**
 * NavBar component which renders relevant links and features to navigate around the
 * site efficiently.
 */
export class NavBar extends React.Component<NavbarDispatchProps, NavBarState> {
  public readonly state: NavBarState = {
    navOpen: false,
    mobile: window.innerWidth < 768,
    centerImage: window.innerWidth < 980,
  };

  /**
   * Add a resize event listener when the component mounts, so if the user changes
   * their screen size, mobile sizing can be present, or vice versa.
   */
  public componentDidMount(): void {
    window.addEventListener("resize", (e: Event): void => {
      this.setState({
        mobile: (e.target as Window).innerWidth < 768,
        centerImage: (e.target as Window).innerWidth < 980,
      });
    });
  }

  /**
   * Remove the resize event listener when the component unmounts to prevent memory
   * leaks.
   */
  public componentWillUnmount(): void {
    window.removeEventListener("resize", (e: Event): void => {
      this.setState({
        mobile: (e.target as Window).innerWidth < 768,
        centerImage: (e.target as Window).innerWidth < 980,
      });
    });
  }

  public render(): JSX.Element {
    const { navOpen, mobile, centerImage } = this.state;
    const { admin, items, signOut, classes } = this.props;
    return (
      <>
        {/* ClickAwayListener closes the NavBar when clicking away from itself */}
        <ClickAwayListener onClickAway={(): void => this.setState({ navOpen: false })}>
          {/* 
            Headroom hides the NavBar when scrolling "down", and re-shows it when the
            user scrolls "up".
           */}
          <Headroom wrapperStyle={{ position: "relative", zIndex: 3, height: "50px" }}>
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
                    badgeContent={items?.length ?? 0}
                    color="primary"
                    className={classes.badge}
                  >
                    <MenuRounded
                      onClick={(): void => this.setState({ navOpen: !navOpen })}
                      className={classes.menuIcon}
                    />
                  </Badge>
                )}
                {/* 
                  If the user is not on a mobile device, then show the Links instead
                  of the hamburger icon.
                */}
                {!mobile && (
                  <Links
                    closeNav={(): void => this.setState({ navOpen: false })}
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
                    closeNav={(): void => this.setState({ navOpen: false })}
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
  }
}

export default withStyles(styles)(NavBar);
