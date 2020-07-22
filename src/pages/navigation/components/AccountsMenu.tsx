import React, { RefObject } from "react";
import { Menu, MenuItem, Divider, makeStyles } from "@material-ui/core";
import {
  FaceRounded,
  ShoppingCartRounded,
  AddShoppingCartRounded,
  MailOutlineRounded,
  ExitToAppOutlined,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";

interface AccountMenuProps {
  closeNav: () => void;
  accountRef: RefObject<HTMLDivElement>;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  admin: boolean;
  signOut: () => void;
}

const AccountsMenu = ({
  closeNav,
  accountRef,
  menuOpen,
  setMenuOpen,
  admin,
  signOut,
}: AccountMenuProps): JSX.Element => {
  const history = useHistory();
  const useStyles = makeStyles({
    menu: {
      minWidth: 200,
      padding: "4px 8px",
      position: "relative",
      "&:before": {
        content: "''",
        position: "absolute",
        top: -23,
        right: 18,
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
        right: 18,
        top: -22,
        width: 0,
        height: 0,
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        borderBottom: "15px solid #fff",
        clear: "both",
      },
    },
  });
  const classes = useStyles();
  return (
    <Menu
      open={menuOpen}
      getContentAnchorEl={null}
      anchorEl={accountRef.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      style={{
        overflowX: "inherit",
        overflowY: "inherit",
        marginTop: 6,
      }}
      onClose={(): void => setMenuOpen(false)}
    >
      <div className={classes.menu}>
        <MenuItem
          onClick={(): void => {
            closeNav();
            setMenuOpen(false);
            history.push("/profile");
          }}
        >
          <FaceRounded style={{ marginRight: 8 }} /> Profile
        </MenuItem>
        {admin ? (
          <>
            <MenuItem
              onClick={(): void => {
                closeNav();
                setMenuOpen(false);
                history.push("/products");
              }}
            >
              <ShoppingCartRounded style={{ marginRight: 8 }} /> Products
            </MenuItem>
            <MenuItem
              onClick={(): void => {
                closeNav();
                setMenuOpen(false);
                history.push("/create");
              }}
            >
              <AddShoppingCartRounded style={{ marginRight: 8 }} /> Create Product
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={(): void => {
              closeNav();
              setMenuOpen(false);
              history.push("/orders");
            }}
          >
            <MailOutlineRounded style={{ marginRight: 8 }} />
            Orders
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          className="nav__logout"
          onClick={(): void => {
            closeNav();
            setMenuOpen(false);
            signOut();
          }}
        >
          <ExitToAppOutlined style={{ marginRight: 8 }} /> Logout
        </MenuItem>
      </div>
    </Menu>
  );
};

export default AccountsMenu;
