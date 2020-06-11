import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, makeStyles } from "@material-ui/core";
import navStyles from "../styles/links.style";
import { AppState } from "../../../store/store";
import { BasketItemProps } from "../../payment/interfaces/Basket.i";
import AccountsMenu from "./AccountsMenu";
import MiniBasketMenu from "./MiniBasketMenu";
import { LinksProps } from "../interfaces/Links.i";
import { AccountTabTypes } from "../../accounts/interfaces/Accounts.i";

const Links: React.FC<LinksProps> = ({
  mobile = false,
  admin,
  closeNav,
  user,
  setAccountsTab,
  signOut,
}): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);
  const items = useSelector(({ basket }: AppState): BasketItemProps[] => basket.items);

  const useStyles = makeStyles(navStyles);
  const classes = useStyles();
  const basketRef = React.useRef<HTMLDivElement>(null);
  const accountRef = React.useRef<HTMLDivElement>(null);

  console.log(user);

  return (
    <div className={mobile ? classes.mobileLinks : classes.links}>
      <div className={mobile ? classes.navMobile : classes.navLeft}>
        <NavLink
          to="/"
          exact
          activeClassName={classes.linkActive}
          className={classes.link}
          onClick={closeNav}
        >
          <i className={`fas fa-home ${classes.navIcon}`} />
          Home
        </NavLink>
        <NavLink
          to="/cakes"
          activeClassName={classes.linkActive}
          className={classes.link}
          onClick={closeNav}
        >
          <i className={`fas fa-birthday-cake ${classes.navIcon}`} />
          Cakes
        </NavLink>
        <NavLink
          to="/creates"
          activeClassName={classes.linkActive}
          className={classes.link}
          onClick={closeNav}
        >
          <i className={`fas fa-paint-brush ${classes.navIcon}`} />
          Creates
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
              className={
                window.location.href.split("/").includes("account")
                  ? classes.linkActive
                  : classes.link
              }
            >
              <i className={`fas fa-user-alt ${classes.navIcon}`} />
              Account
            </div>
            <AccountsMenu
              closeNav={closeNav}
              accountRef={accountRef}
              menuOpen={menuOpen}
              setMenuOpen={(value): void => setMenuOpen(value)}
              setAccountsTab={(value: AccountTabTypes): void => setAccountsTab(value)}
              signOut={signOut}
              admin={admin}
            />
          </>
        ) : (
          <NavLink
            to="/login"
            onClick={closeNav}
            activeClassName="/login"
            className={
              window.location.href.split("/").includes("account")
                ? classes.linkActive
                : classes.link
            }
          >
            <i className={`fas fa-user-alt ${classes.navIcon}`} />
            Account
          </NavLink>
        )}
        <div
          role="button"
          tabIndex={0}
          ref={basketRef}
          onClick={(): void => setBasketOpen(!basketOpen)}
          className={
            window.location.href.includes("basket") ? classes.linkActive : classes.link
          }
        >
          <Badge
            badgeContent={items.length}
            color="primary"
            classes={{ root: classes.badgeRoot }}
          >
            <i className={`fas fa-shopping-basket ${classes.navIcon}`} />
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
