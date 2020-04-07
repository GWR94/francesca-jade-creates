import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarToggler, Collapse, Nav } from "reactstrap";
import { Popover, Menu, MenuDivider, MenuItem, Button } from "@blueprintjs/core";
import Headroom from "react-headroom";
import { connect } from "react-redux";
import logo from "../img/logo.png";
import {
  NavBarProps,
  NavBarState,
  NavBarDispatchProps,
  NavBarStateProps,
} from "./interfaces/NavBar.i";
import { RemoveItemAction } from "../interfaces/basket.redux.i";
import * as actions from "../actions/basket.actions";
import { AppState } from "../store/store";

export class NavBar extends React.Component<NavBarProps, NavBarState> {
  public readonly state: NavBarState = {
    navOpen: false,
    menuOpen: false,
    accountOpen: false,
  };

  public componentDidMount(): void {
    this.setState({ accountOpen: window.location.href.split("/").includes("account") });
  }

  public render(): JSX.Element {
    const { navOpen, menuOpen, accountOpen } = this.state;
    const {
      user,
      admin,
      items,
      history,
      setAccountsTab,
      signOut,
      removeFromBasket,
    } = this.props;
    return (
      <>
        <Headroom wrapperStyle={{ position: "relative", zIndex: 3, height: "50px" }}>
          <Navbar className="nav__bar animated slideInDown" light expand="md">
            <img src={logo} alt="Francesca Jade Creates" className="navbar__logo" />
            <NavbarToggler onClick={(): void => this.setState({ navOpen: !navOpen })} />
            <Collapse isOpen={navOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavLink
                  to="/"
                  exact
                  activeClassName="nav__link--active"
                  className="nav__link"
                  onClick={(): void => this.setState({ navOpen: false })}
                >
                  <i className="fas fa-home nav__icon" />
                  Home
                </NavLink>
                <NavLink
                  to="/cakes"
                  activeClassName="nav__link--active"
                  className="nav__link"
                  onClick={(): void => this.setState({ navOpen: false })}
                >
                  <i className="fas fa-birthday-cake nav__icon" />
                  Cakes
                </NavLink>
                <NavLink
                  to="/creates"
                  activeClassName="nav__link--active"
                  className="nav__link"
                  onClick={(): void => this.setState({ navOpen: false })}
                >
                  <i className="fas fa-camera nav__icon" />
                  Creates
                </NavLink>
              </Nav>
              <Nav navbar>
                {user ? (
                  <Popover position="bottom-right">
                    <div
                      onClick={(): void => this.setState({ menuOpen: !menuOpen })}
                      role="button"
                      tabIndex={0}
                      className={accountOpen ? "nav__link--active" : "nav__link"}
                    >
                      <i className="fas fa-user nav__icon" />
                      Account
                    </div>
                    <Menu className="nav__menu">
                      <MenuItem
                        icon={<i className="fas fa-id-badge nav__dropdown-icon" />}
                        text="Profile"
                        onClick={(): void => {
                          this.setState({ navOpen: false });
                          setAccountsTab("profile");
                          history.push("/account");
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
                              this.setState({ navOpen: false });
                              setAccountsTab("products");
                              history.push("/account");
                            }}
                          />
                          <MenuItem
                            icon={<i className="fas fa-plus-square nav__dropdown-icon" />}
                            text="Create Product"
                            onClick={(): void => {
                              this.setState({ navOpen: false });
                              history.push("/account");
                              setAccountsTab("create");
                            }}
                          />
                        </>
                      ) : (
                        <MenuItem
                          icon={<i className="fas fa-envelope-open nav__dropdown-icon" />}
                          text="Orders"
                          onClick={(): void => {
                            this.setState({ navOpen: false });
                            history.push("/account");
                            setAccountsTab("orders");
                          }}
                        />
                      )}
                      <MenuDivider />
                      <MenuItem
                        icon={<i className="fas fa-sign-out-alt nav__dropdown-icon" />}
                        text="Logout"
                        className="nav__logout"
                        onClick={(): void => {
                          this.setState({ navOpen: false });
                          signOut();
                        }}
                      />
                    </Menu>
                  </Popover>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={(): void => this.setState({ navOpen: false })}
                    activeClassName="/login"
                    className={accountOpen ? "nav__link--active" : "nav__link"}
                  >
                    <i className="fas fa-user nav__icon" />
                    Account
                  </NavLink>
                )}
                <Popover interactionKind="click" position="bottom">
                  <div
                    role="button"
                    tabIndex={0}
                    className={
                      window.location.href.includes("basket")
                        ? "nav__link--active"
                        : "nav__link"
                    }
                  >
                    <i className="fas fa-shopping-basket nav__icon" />
                    Basket ({items.length})
                  </div>
                  <div className="nav__basket">
                    <h5 className="nav__basket-title">Basket</h5>
                    {items.length > 0 ? (
                      items.map((item, i) => (
                        <div key={i} className="nav__basket-item">
                          <p className="nav__basket-number">{i + 1}.</p>
                          <p className="nav__basket-details">
                            {item.title} - £{item.price.toFixed(2)} + £
                            {item.shippingCost.toFixed(2)}
                          </p>
                          <i
                            className="fas fa-times nav__basket-delete"
                            onClick={(): void => removeFromBasket(item.id)}
                            role="button"
                            tabIndex={0}
                          />
                        </div>
                      ))
                    ) : (
                      <p>Basket is empty.</p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: 8,
                      }}
                    >
                      <Button
                        minimal
                        small
                        intent="primary"
                        text="View Basket"
                        onClick={(): void => history.push("/basket")}
                      />
                      {/* // FIXME */}
                      <Button small intent="success" text="Checkout" />
                    </div>
                  </div>
                </Popover>
              </Nav>
            </Collapse>
          </Navbar>
        </Headroom>
      </>
    );
  }
}

const mapStateToProps = ({ basket }: AppState): NavBarStateProps => ({
  items: basket.items,
});

const mapDispatchToProps = (dispatch): NavBarDispatchProps => ({
  removeFromBasket: (itemID: string): RemoveItemAction =>
    dispatch(actions.removeFromBasket(itemID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
