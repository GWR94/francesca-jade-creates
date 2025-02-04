import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, makeStyles } from "@material-ui/core";
import {
  AccountBoxRounded,
  BrushRounded,
  CakeRounded,
  HomeRounded,
  LocalOfferRounded,
  ShoppingCartRounded,
} from "@material-ui/icons";
import navStyles from "../styles/links.style";
import { AppState } from "../../../store/store";
import { BasketItemProps } from "../../payment/interfaces/Basket.i";
import AccountsMenu from "./AccountsMenu";
import MiniBasketMenu from "./MiniBasketMenu";
import { LinksProps } from "../interfaces/Links.i";
import Login from "../../home/Login";

/**
 * Component containing all of the links to navigate around the site.
 * @param {boolean} [mobile = false] - Boolean value to say if the user is on a mobile device
 * @param {boolean} [admin = false] - Boolean value which says if the current user is an admin.
 * @param {() => void} closeNav - Function to close the navigation menu if it's open
 * @param {UserAttributesProps} - Object containing  user data.
 * @param {(tab: string) => void} setAccountsTab - Function to change the current tab in Account component
 * @param {() => void} signOut - Function to sign out the current user.
 */
const Links: React.FC<LinksProps> = ({
  mobile = false,
  admin = false,
  closeNav,
  signOut,
  navOpen,
}): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false); // open/close navigation menu for mobile
  const [basketOpen, setBasketOpen] = useState(false); // open/close basket menu
  const [isAccountsPage, setAccountsPage] = useState(false); // set accounts page link as active or not

  useEffect(() => {
    if (location.href.split("/").includes("account")) {
      setAccountsPage(true);
    }
  }, [location.href]);

  /**
   * Find all of the items (if any) in the basket by using useSelector and returning just
   * the basket items.
   */
  const items = useSelector(({ basket }: AppState): BasketItemProps[] => basket.items);
  const user = useSelector(({ user }: AppState): string => user.id as string);
  // create styles for component
  const useStyles = makeStyles(navStyles);
  // use styles
  const classes = useStyles();
  // useHistory hook allows navigation to other pages.
  const history = useHistory();
  // create refs for anchor points
  const basketRef = React.useRef<HTMLDivElement>(null);
  const accountRef = React.useRef<HTMLDivElement>(null);

  const handleLinkClick = (): void => {
    setAccountsPage(false);
    closeNav();
  };

  return (
    <div className={mobile ? classes.mobileLinks : classes.links}>
      <div className={mobile ? classes.navMobile : classes.navLeft}>
        <NavLink
          to="/cakes"
          activeClassName={classes.linkActive}
          className={classes.link}
          onClick={handleLinkClick}
        >
          <CakeRounded className={classes.navIcon} />
          Cakes
        </NavLink>
        <NavLink
          to="/creates"
          activeClassName={classes.linkActive}
          className={classes.link}
          onClick={handleLinkClick}
        >
          <BrushRounded className={classes.navIcon} />
          Creations
        </NavLink>
        <NavLink
          to="/themes"
          activeClassName={classes.linkActive}
          className={classes.link}
          onClick={handleLinkClick}
        >
          <LocalOfferRounded className={classes.navIcon} />
          Themes
        </NavLink>
      </div>
      <div className={mobile ? classes.navMobile : classes.navRight}>
        {user ? (
          <>
            <div
              onClick={(): void => setMenuOpen(!menuOpen)}
              role="button"
              tabIndex={0}
              ref={accountRef}
              className={!isAccountsPage ? classes.link : classes.linkActiveDiv}
            >
              <AccountBoxRounded className={classes.navIcon} />
              Account
            </div>
            <AccountsMenu
              closeNav={closeNav}
              accountRef={accountRef}
              menuOpen={menuOpen}
              setMenuOpen={(value): void => setMenuOpen(value)}
              signOut={signOut}
              admin={admin}
            />
          </>
        ) : (
          <Login
            props={{
              classOverride: navOpen ? classes.linkActiveDiv : classes.link,
              text: "Sign in",
              color: "inherit",
              variant: "text",
              Icon: <AccountBoxRounded className={classes.navIcon} />,
            }}
            closeNav={closeNav}
          />
        )}
        <div
          role="button"
          tabIndex={0}
          ref={basketRef}
          onClick={(): void => {
            if (mobile) {
              history.push("/basket");
              closeNav();
            } else {
              setBasketOpen(!basketOpen);
            }
          }}
          className={
            window.location.href.includes("basket") ? classes.linkActiveDiv : classes.link
          }
        >
          <Badge
            badgeContent={items.length}
            classes={{ root: classes.badgeRoot, badge: classes.badge }}
          >
            <ShoppingCartRounded className={classes.navIcon} />
          </Badge>
          Basket
        </div>
        <MiniBasketMenu
          basketOpen={basketOpen}
          basketRef={basketRef}
          setBasketOpen={(value): void => setBasketOpen(value)}
          items={items}
          setMenuOpen={(value): void => setMenuOpen(value)}
          closeNav={closeNav}
        />
      </div>
    </div>
  );
};

export default Links;
