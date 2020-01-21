import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarToggler, Collapse, Nav } from "reactstrap";
import Headroom from "react-headroom";
import logo from "../img/logo.png";

const NavBar = (): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Headroom wrapperStyle={{ position: "relative", zIndex: 3, height: "57px" }}>
        <Navbar className="nav__bar animated slideInDown" light expand="md">
          <img src={logo} alt="Francesca Jade Creates" className="navbar__logo" />
          <NavbarToggler onClick={(): void => setOpen(!open)} />
          <Collapse isOpen={open} navbar>
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
              <NavLink
                to="/account"
                activeClassName="nav__link--active"
                className="nav__link"
              >
                <i className="fas fa-user nav__icon" />
                Account
              </NavLink>
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
