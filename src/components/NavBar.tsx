import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Navbar, NavbarToggler, Collapse, Nav } from "reactstrap";
import { Popover, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import Headroom from "react-headroom";
import logo from "../img/logo.png";

const NavBar = ({ signOut, admin, setAccountsTab, user }): JSX.Element => {
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect((): void => {
    setAccountOpen(window.location.href.split("/").includes("account"));
  });

  const history = useHistory();
  return (
    <>
      <Headroom wrapperStyle={{ position: "relative", zIndex: 3, height: "50px" }}>
        <Navbar className="nav__bar animated slideInDown" light expand="md">
          <img src={logo} alt="Francesca Jade Creates" className="navbar__logo" />
          <NavbarToggler onClick={(): void => setNavOpen(!navOpen)} />
          <Collapse isOpen={navOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavLink
                to="/"
                exact
                activeClassName="nav__link--active"
                className="nav__link"
              >
                <i className="fas fa-home nav__icon" />
                Home
              </NavLink>
              <NavLink
                to="/cakes"
                activeClassName="nav__link--active"
                className="nav__link"
              >
                <i className="fas fa-birthday-cake nav__icon" />
                Cakes
              </NavLink>
              <NavLink
                to="/creates"
                activeClassName="nav__link--active"
                className="nav__link"
              >
                <i className="fas fa-camera nav__icon" />
                Creates
              </NavLink>
            </Nav>
            <Nav navbar>
              {!user ? (
                <div
                  onClick={(): void => history.push("/account")}
                  role="button"
                  tabIndex={0}
                  className={accountOpen ? "nav__link--active" : "nav__link"}
                >
                  <i className="fas fa-user nav__icon" />
                  Account
                </div>
              ) : (
                <Popover
                  content={
                    <Menu>
                      <MenuItem
                        icon={<i className="fas fa-id-badge nav__dropdown-icon" />}
                        text="Profile"
                        onClick={(): void => {
                          setAccountsTab("profile");
                          history.push("account");
                        }}
                      />
                      {admin ? (
                        <>
                          <MenuItem
                            icon={
                              <i className="fas fa-shopping-basket nav__dropdown-icon" />
                            }
                            text="Products"
                            onClick={(): void => {
                              setAccountsTab("products");
                              history.push("account");
                            }}
                          />
                          <MenuItem
                            icon={<i className="fas fa-plus-square nav__dropdown-icon" />}
                            text="Create Product"
                            onClick={(): void => {
                              setAccountsTab("create");
                              history.push("account");
                            }}
                          />
                        </>
                      ) : (
                        <MenuItem
                          icon={<i className="fas fa-envelope-open nav__dropdown-icon" />}
                          text="Orders"
                          onClick={(): void => {
                            setAccountsTab("orders");
                            history.push("account");
                          }}
                        />
                      )}
                      <MenuDivider />
                      <MenuItem
                        icon={<i className="fas fa-sign-out-alt nav__dropdown-icon" />}
                        text="Logout"
                        onClick={(): void => signOut()}
                      />
                    </Menu>
                  }
                  position="bottom-right"
                >
                  <div
                    onClick={(): void => setMenuOpen(!menuOpen)}
                    role="button"
                    tabIndex={0}
                    className={accountOpen ? "nav__link--active" : "nav__link"}
                  >
                    <i className="fas fa-user nav__icon" />
                    Account
                  </div>
                </Popover>
              )}
              <NavLink
                to="/contact"
                activeClassName="nav__link--active"
                className="nav__link"
              >
                <i className="fas fa-phone-alt nav__icon" />
                Contact Me
              </NavLink>
            </Nav>
          </Collapse>
        </Navbar>
      </Headroom>
    </>
  );
};

export default NavBar;
