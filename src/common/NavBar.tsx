import React, { createRef } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarToggler, Collapse, Nav } from "reactstrap";
import { Popover, Menu, MenuItem, Divider, Button, Badge } from "@material-ui/core";
import Headroom from "react-headroom";
import { connect } from "react-redux";
import {
  AccountBoxRounded,
  FaceRounded,
  AddShoppingCartRounded,
  ShoppingCartRounded,
  MailOutlineRounded,
  ExitToAppOutlined,
  ShoppingBasket,
} from "@material-ui/icons";
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
    basketOpen: false,
    mobile: null,
  };

  private accountRef = createRef<HTMLDivElement>();
  private basketRef = createRef<HTMLDivElement>();

  public componentDidMount(): void {
    window.addEventListener("resize", (e: Event): void => {
      this.setState({ mobile: (e.target as Window).innerWidth < 768 });
    });
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", (e: Event): void => {
      this.setState({ mobile: (e.target as Window).innerWidth < 768 });
    });
  }

  public render(): JSX.Element {
    const { navOpen, menuOpen, basketOpen, mobile } = this.state;
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
            {!navOpen && mobile ? (
              <Badge badgeContent={items.length} color="primary">
                <NavbarToggler
                  onClick={(): void => this.setState({ navOpen: !navOpen })}
                />
              </Badge>
            ) : (
              <NavbarToggler onClick={(): void => this.setState({ navOpen: !navOpen })} />
            )}
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
                  <>
                    <div
                      onClick={(): void => this.setState({ menuOpen: !menuOpen })}
                      role="button"
                      tabIndex={0}
                      ref={this.accountRef}
                      className={
                        window.location.href.split("/").includes("account")
                          ? "nav__link--active"
                          : "nav__link"
                      }
                    >
                      <AccountBoxRounded />
                      Account
                    </div>
                    <Menu
                      open={menuOpen}
                      getContentAnchorEl={null}
                      anchorEl={this.accountRef.current}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      onClose={(): void => this.setState({ menuOpen: false })}
                    >
                      <div className="nav__menu">
                        <MenuItem
                          onClick={(): void => {
                            this.setState({ navOpen: false, menuOpen: false });
                            setAccountsTab("profile");
                            history.push("/account");
                          }}
                        >
                          <FaceRounded style={{ marginRight: 8 }} /> Profile
                        </MenuItem>
                        {admin ? (
                          <>
                            <MenuItem
                              onClick={(): void => {
                                this.setState({ navOpen: false, menuOpen: false });
                                setAccountsTab("products");
                                history.push("/account");
                              }}
                            >
                              <ShoppingCartRounded style={{ marginRight: 8 }} /> Products
                            </MenuItem>
                            <MenuItem
                              onClick={(): void => {
                                this.setState({ navOpen: false, menuOpen: false });
                                history.push("/account");
                                setAccountsTab("create");
                              }}
                            >
                              <AddShoppingCartRounded style={{ marginRight: 8 }} /> Create
                              Product
                            </MenuItem>
                          </>
                        ) : (
                          <MenuItem
                            onClick={(): void => {
                              this.setState({ navOpen: false, menuOpen: false });
                              history.push("/account");
                              setAccountsTab("orders");
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
                            this.setState({ navOpen: false, menuOpen: false });
                            signOut();
                          }}
                        >
                          <ExitToAppOutlined style={{ marginRight: 8 }} /> Logout
                        </MenuItem>
                      </div>
                    </Menu>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={(): void => this.setState({ navOpen: false })}
                    activeClassName="/login"
                    className={
                      window.location.href.split("/").includes("account")
                        ? "nav__link--active"
                        : "nav__link"
                    }
                  >
                    <AccountBoxRounded />
                    Account
                  </NavLink>
                )}
                <div
                  role="button"
                  tabIndex={0}
                  ref={this.basketRef}
                  onClick={(): void => this.setState({ basketOpen: !basketOpen })}
                  className={
                    window.location.href.includes("basket")
                      ? "nav__link--active"
                      : "nav__link"
                  }
                >
                  <Badge badgeContent={items.length} color="primary" showZero>
                    <ShoppingBasket style={{ marginRight: 8 }} />
                  </Badge>
                  Basket
                </div>
                <Popover
                  open={basketOpen}
                  getContentAnchorEl={null}
                  anchorEl={this.basketRef.current}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  onClose={(): void => this.setState({ basketOpen: false })}
                >
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
                        size="small"
                        color="secondary"
                        onClick={(): void => {
                          history.push("/basket");
                          this.setState({ basketOpen: false, navOpen: false });
                        }}
                      >
                        View Basket
                      </Button>
                      {/* // FIXME */}
                      <Button size="small" color="primary">
                        Checkout
                      </Button>
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
