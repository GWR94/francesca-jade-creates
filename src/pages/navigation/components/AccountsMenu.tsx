import React, { RefObject } from "react";
import { Menu, MenuItem, Divider, makeStyles, useMediaQuery } from "@material-ui/core";
import {
  FaceRounded,
  ShoppingCartRounded,
  AddShoppingCartRounded,
  MailOutlineRounded,
  ExitToAppOutlined,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as actions from "../../../actions/user.actions";
import { CurrentTabTypes } from "../../../interfaces/user.redux.i";

interface AccountMenuProps {
  closeNav: () => void; // function to close navbar if it's open
  accountRef: RefObject<HTMLDivElement>; // ref for accounts link
  menuOpen: boolean; // boolean to determine if menu is open
  setMenuOpen: (value: boolean) => void; // function to control menuOpen
  admin: boolean; // boolean to determine if current user is admin
  signOut: () => void; // function to sign out
}

const AccountsMenu = ({
  closeNav,
  accountRef,
  menuOpen,
  setMenuOpen,
  admin,
  signOut,
}: AccountMenuProps): JSX.Element => {
  // store the useHistory hook into a variable so it can be used within the component
  const history = useHistory();
  /**
   * use the useMediaQuery hook to determine if the current screen width matches the
   * parameters. E.g if the screen is less than 600px desktop will be false, and if
   * the screen is larger desktop will be true.
   */
  const desktop = useMediaQuery("(min-width: 600px)");
  // make styles using the styles and store it into a variable that can be executed.
  const useStyles = makeStyles({
    menu: {
      minWidth: 200,
      padding: "4px 8px",
      position: "relative",
      "&:before": {
        content: "''",
        position: "absolute",
        top: -23,
        right: desktop ? 23 : 0,
        // if desktop, show arrow to icon, if not centre it
        left: desktop ? "auto" : "calc(50% - 7.5px)",
        width: 0,
        height: 0,
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        borderBottom: "15px solid #eeeefa",
        clear: "both",
      },
      "&:after": {
        content: "''",
        position: "absolute",
        top: -22,
        right: desktop ? 23 : 0,
        // if desktop, show arrow to icon, if not centre it
        left: desktop ? "auto" : "calc(50% - 7.5px)",
        width: 0,
        height: 0,
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        borderBottom: "15px solid #fff",
        clear: "both",
      },
    },
    menuItem: {
      minHeight: 30,
    },
  });
  // execute useStyles to create the classes object - which will contain all styles
  const classes = useStyles();
  // store useDispatch hook into a variable so it can be used throughout component
  const dispatch = useDispatch();

  const handleClose = (tab: CurrentTabTypes): void => {
    // close nav via function passed from props
    closeNav();
    // close menu by changing boolean value
    setMenuOpen(false);
    /**
     * dispatch setCurrentTab action with the input tab parameter, so the correct
     * tab is displayed when going back to accounts page.
     */
    dispatch(actions.setCurrentTab(tab));
    // navigate to accounts page.
    history.push("/account");
  };
  return (
    <Menu
      // open only when menuOpen boolean is true
      open={menuOpen}
      getContentAnchorEl={null}
      anchorEl={accountRef.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={
        desktop
          ? {
              // if desktop, align side to right
              vertical: "top",
              horizontal: "right",
            }
          : {
              // if mobile, centre the transform origin.
              vertical: "top",
              horizontal: "center",
            }
      }
      style={{
        overflowX: "inherit",
        overflowY: "inherit",
        marginTop: 6,
      }}
      onClose={(): void => setMenuOpen(false)}
    >
      <div className={classes.menu}>
        <MenuItem
          onClick={(): void => handleClose("profile")}
          className={classes.menuItem}
        >
          <FaceRounded style={{ marginRight: 8 }} /> Profile
        </MenuItem>
        {admin ? (
          <>
            <MenuItem
              onClick={(): void => handleClose("products")}
              className={classes.menuItem}
            >
              <ShoppingCartRounded style={{ marginRight: 8 }} /> Products
            </MenuItem>
            <MenuItem
              onClick={(): void => handleClose("create")}
              className={classes.menuItem}
            >
              <AddShoppingCartRounded style={{ marginRight: 8 }} /> Create Product
            </MenuItem>
            <MenuItem
              onClick={(): void => handleClose("adminOrders")}
              className={classes.menuItem}
            >
              <MailOutlineRounded style={{ marginRight: 8 }} />
              Orders
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={(): void => handleClose("orders")}
            className={classes.menuItem}
          >
            <MailOutlineRounded style={{ marginRight: 8 }} />
            Orders
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          onClick={(): void => {
            closeNav();
            setMenuOpen(false);
            signOut();
          }}
          className={classes.menuItem}
        >
          <ExitToAppOutlined style={{ marginRight: 8 }} /> Logout
        </MenuItem>
      </div>
    </Menu>
  );
};

export default AccountsMenu;
