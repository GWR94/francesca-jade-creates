import React, { Component } from "react";
import { Router, Route, Switch, Redirect, RouteComponentProps } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Hub, Auth, API, graphqlOperation } from "aws-amplify";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Landing from "../pages/home/Landing";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import ProductTypePage from "../common/containers/ProductTypePage";
import NavBar from "../pages/navigation/NavBar";
import ViewProduct from "../pages/accounts/components/ViewProduct";
import { getUser, listProducts } from "../graphql/queries";
import { registerUser } from "../graphql/mutations";
import {
  RouterState,
  RouterDispatchProps,
  SignInUserData,
  HubCapsule,
} from "./interfaces/Router.i";
import { attributesToObject } from "../utils/index";
import { openSnackbar } from "../utils/Notifier";
import Loading from "../common/Loading";
import Login from "../pages/home/Login";
import background from "../img/pinkbg.jpg";
import UpdateProduct from "../pages/accounts/components/UpdateProduct";
import Basket from "../pages/payment/Basket";
import { ClearBasketAction } from "../interfaces/basket.redux.i";
import * as basketActions from "../actions/basket.actions";
import * as userActions from "../actions/user.actions";
import { SetUserAction, ClearUserAction } from "../interfaces/user.redux.i";
import Checkout from "../pages/payment/components/Checkout";
import { MatchParams } from "../pages/accounts/interfaces/UpdateProduct.i";
import { CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js";
import { INTENT } from "../themes";
import Profile from "../pages/accounts/components/Profile";
import {
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
} from "../graphql/subscriptions";
import AdminProducts from "../pages/accounts/components/AdminProducts";

export const history = createBrowserHistory();

/**
 * TODO
 * [ ] Check redirects work when not admin.
 * [ ] Clear basket on logout
 */

class AppRouter extends Component<RouterDispatchProps, RouterState> {
  public readonly state: RouterState = {
    user: null,
    userAttributes: null,
    isLoading: true,
    accountsTab: "profile",
    products: [],
  };

  private createProductListener: PushSubscription;
  private deleteProductListener: PushSubscription;
  private updateProductListener: PushSubscription;

  // set the property to be false to begin with, so no user can accidentally be an admin.
  private admin = false;

  public componentDidMount(): void {
    // get the current users information
    this.getUserData();
    // listener for auth changes such as signIn, signOut, signUp etc.
    // @ts-ignore
    Hub.listen("auth", this.onHubCapsule);
    this.handleGetProducts();
    if (this.admin) this.handleSubscriptions();
  }

  public componentWillUnmount(): void {
    this.createProductListener?.unsubscribe();
    this.deleteProductListener?.unsubscribe();
    this.updateProductListener?.unsubscribe();
  }

  private handleGetProducts = async (): Promise<void> => {
    /**
     * destructure the data property from the listProduct graphql query so it
     * can be used to retrieve the products
     */
    const { data } = await API.graphql(graphqlOperation(listProducts, { limit: 200 }));
    // save the products into a variable
    const products = data?.listProducts?.items ?? [];
    // set the products into state and remove UI loading effects by setting isLoading to false
    this.setState({ products, isLoading: false });
  };

  private handleSubscriptions = async (): Promise<void> => {
    const { user } = this.state;
    const {
      attributes: { sub },
    } = user;

    this.createProductListener = API.graphql(
      graphqlOperation(onCreateProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const { products } = this.state;
        const createdProduct = productData.value.data.onCreateCakeProduct;
        const prevProducts = products
          ? products.filter((item): boolean => item.id !== createdProduct.id)
          : [];
        const updatedProducts = [createdProduct, ...prevProducts];
        return this.setState({ products: updatedProducts });
      },
    });

    this.updateProductListener = API.graphql(
      graphqlOperation(onUpdateProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const { products } = this.state;
        const updatedProduct = productData.value.data.onUpdateProduct;
        const updatedProductIdx = products.findIndex(
          (item): boolean => item.id === updatedProduct.id,
        );
        const updatedProducts = [
          ...products.slice(0, updatedProductIdx),
          updatedProduct,
          ...products.slice(updatedProductIdx + 1),
        ];
        return this.setState({ products: updatedProducts });
      },
    });

    this.deleteProductListener = API.graphql(
      graphqlOperation(onDeleteProduct, { owner: sub }),
    ).subscribe({
      next: (productData): void => {
        const { products } = this.state;
        const deletedProduct = productData.value.data.onDeleteProduct;
        const updatedProducts = products
          ? products.filter((item): boolean => item.id !== deletedProduct.id)
          : [];
        return this.setState({ products: updatedProducts });
      },
    });
  };

  /**
   * A method to retrieve the current authenticated users data, and set it into state. It also
   * checks to see whether or not the user is an admin or not, and will set it into memory in
   * this.admin variable.
   * @param {boolean = false} retry - optional boolean value to signal if there has been a retry in
   * calling the function - this can only be done once so if it's set to true then there will not be
   * another retry attempt if there is a fail.
   */
  private getUserData = async (): Promise<void> => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        /**
         * if the current user is part of the Admin group in the cognito groups array, then set
         * this.admin to true, otherwise set it to false.
         */
        this.admin =
          user?.signInUserSession?.idToken?.payload["cognito:groups"]?.includes(
            "Admin",
          ) ?? false;

        /**
         * if there is a user object, set it into state and set isLoading to false to stop any
         * loading UI effects. Then call getUserAttributes() as the callback function.
         */
        this.setState(
          { user, isLoading: false },
          (): Promise<void> => this.getUserAttributes(user),
        );
      } else {
        /**
         * If there is no user object from Auth.currentAuthUser then set this.admin to be false, and
         * set the user object to null, and remove loading UI effects by setting isLoading to false.
         */
        this.admin = false;
        this.setState({ user: null, isLoading: false });
      }
    } catch (err) {
      /**
       * If there are any errors anywhere in the function, then catch the error, set this.admin to false,
       * set user state to null and remove loading UI effects by settings isLoading state to false.
       */
      this.admin = false;
      this.setState({ user: null, isLoading: false });
    }
  };

  /**
   * Method to sign out the current authenticated user, and remove all of their properties from
   * state. It will also clear the basket/user from redux stores so all user information is wiped
   * from the system.
   */
  private handleSignOut = async (): Promise<void> => {
    // destructure relevant props
    const { clearBasket, clearUser } = this.props;
    try {
      // try to sign out
      await Auth.signOut();
      // clear basket reducer
      clearBasket();
      // clear user reducer
      clearUser();
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

  /**
   * Method which converts an object of auth data into a readable object which can be
   * set into state to get the current authenticated users' attributes, which can then
   * be set into state to be used in the application.
   * @param {CognitoUser} authUserData - An object containing the data for the current
   * auth user which can be used for getting the users attributes.
   */
  private getUserAttributes = async (authUserData: CognitoUser): Promise<void> => {
    try {
      const { setUser } = this.props;
      // get the array of user attributes from Auth.userAttributes().
      const attributesArr: CognitoUserAttribute[] = await Auth.userAttributes(
        authUserData,
      );
      // convert the array to an object with the help of utils' attributesToObject function.
      const userAttributes = attributesToObject(attributesArr);
      // set the current users' sub to redux reducer.
      setUser(userAttributes.sub);
      /**
       * Set userAttributes into sub so it can be used in the application, and stop ui loading
       * effects by setting isLoading to false
       */
      this.setState({ userAttributes, isLoading: false });
    } catch (err) {
      /**
       * if there are any errors, set userAttributes to null, and remove the loading UI
       * effects by setting isLoading to false
       */
      this.setState({ isLoading: false, userAttributes: null });
    }
  };

  /**
   * A method to register a new user, and save it into the database by using the registerUser
   * graphQL mutation.
   * @param {SignInUserData} signInData - Object containing the current authenticated
   * users' data
   */
  private registerNewUser = async (signInData: SignInUserData): Promise<void> => {
    /**
     * Get the id from signInData - it's in different locations based on what provider user
     * logged in with. This will be used to check if the user is already a part of the database
     * by checking the id against the getUser query.
     */
    const getUserInput = {
      id: signInData.id || signInData.signInUserSession.idToken.payload.sub,
    };
    // check to see if the user is in the database
    const { data } = await API.graphql(
      graphqlOperation(getUser, {
        input: getUserInput,
      }),
    );
    try {
      // if there is no data.getUser, then the user is not in the database
      if (!data.getUser) {
        /**
         * spread the getUserInput object into a new variable, and add the username and email
         * from signInData to it. Then set registered to true so the database holds valid
         * information.
         */
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          email: signInData.email || signInData.signInUserSession.idToken.payload.email,
          registered: true,
        };
        // execute the registerUser mutation to add the user to the database.
        await API.graphql(
          graphqlOperation(registerUser, {
            input: registerUserInput,
          }),
        );
        // notify the user of success
        openSnackbar({
          severity: INTENT.Success,
          message: "Successfully registered new user.",
        });
      }
    } catch (err) {
      // log any errors
      console.error("error registering new user");
    }
  };

  /**
   * A method to control the flow of the hub's different auth states, such
   * as signing in, signing out and signing up.
   * @param {HubCapsule} capsule - data which is sent to the hub when a
   * certain action occurs - i.e registering users sends data related to
   * registering a user.
   */
  private onHubCapsule = async (capsule: HubCapsule): Promise<void> => {
    switch (capsule.payload.event) {
      // if the user is signing in, get the users' data.
      case "signIn":
        console.log("Signing in");
        await this.getUserData();
        await this.registerNewUser(capsule.payload.data);
        break;
      // if the user is signing up, register the user
      case "signUp":
        this.registerNewUser(capsule.payload.data);
        break;
      // if the user is signing out, remove the user object from state.
      case "signOut":
        this.setState({ user: null });
        break;
      default:
        break;
    }
  };

  public render(): JSX.Element {
    const { user, userAttributes, isLoading, accountsTab, products } = this.state;
    return (
      <Router history={history}>
        <div
          className="landing__background"
          style={{ background: `url(${background}) center 100% fixed` }}
        >
          <NavBar
            signOut={this.handleSignOut}
            user={user}
            admin={this.admin}
            userAttributes={userAttributes}
            history={history}
            setAccountsTab={(tab): void => {
              if (tab !== accountsTab) this.setState({ accountsTab: tab });
            }}
          />
          {isLoading ? (
            <Loading size={100} />
          ) : (
            <Switch>
              <Route
                path="/"
                exact
                component={(): JSX.Element => <Landing history={history} />}
              />
              <Route
                path="/creates"
                exact
                user={user}
                history={history}
                component={(): JSX.Element => (
                  <div className="content-container">
                    <ProductTypePage
                      type="Creates"
                      history={history}
                      admin={this.admin}
                    />
                  </div>
                )}
              />
              <Route
                path="/basket"
                user={user}
                history={history}
                component={(): JSX.Element => (
                  <div className="content-container">
                    <Basket userAttributes={userAttributes} />
                  </div>
                )}
              />
              <Route
                path="/creates/:id"
                component={(_: { match: { params: { id: string } } }): JSX.Element => (
                  <div className="content-container">
                    <ViewProduct
                      id={_.match.params.id}
                      userAttributes={userAttributes}
                      type="Creates"
                    />
                  </div>
                )}
              />
              <Route
                path="/cakes"
                exact
                user={user}
                history={history}
                component={(): JSX.Element => (
                  <div className="content-container">
                    <ProductTypePage type="Cake" history={history} admin={this.admin} />
                  </div>
                )}
              />
              <Route
                path="/cakes/:id"
                component={(_: { match: { params: { id: string } } }): JSX.Element => (
                  <div className="content-container">
                    <ViewProduct
                      userAttributes={userAttributes}
                      id={_.match.params.id}
                      type="Cake"
                    />
                  </div>
                )}
              />
              <Route path="/login" history={history} user={user} component={Login} />
              <Route
                path="/profile"
                exact
                component={(): JSX.Element =>
                  user ? (
                    <div className="content-container">
                      <Profile
                        user={user}
                        userAttributes={userAttributes}
                        accountsTab={accountsTab}
                        admin={this.admin}
                        history={history}
                      />
                    </div>
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                path="/products"
                exact
                component={(): JSX.Element =>
                  this.admin ? (
                    <div className="content-container">
                      <AdminProducts
                        admin={this.admin}
                        history={history}
                        products={products}
                      />
                    </div>
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/create"
                exact
                component={(matchParams: RouteComponentProps<MatchParams>): JSX.Element =>
                  this.admin ? (
                    <div className="content-container">
                      <UpdateProduct {...matchParams} admin={this.admin} />
                    </div>
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/account/:id"
                component={(matchParams: RouteComponentProps<MatchParams>): JSX.Element =>
                  this.admin ? (
                    <div className="content-container">
                      <UpdateProduct update {...matchParams} admin={this.admin} />
                    </div>
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/checkout"
                component={(): JSX.Element => (
                  <div className="content-container">
                    <Checkout userAttributes={userAttributes} />
                  </div>
                )}
              />
              <Route component={NotFoundPage} />
            </Switch>
          )}
        </div>
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): RouterDispatchProps => ({
  clearBasket: (): ClearBasketAction => dispatch(basketActions.clearBasket()),
  setUser: (id): SetUserAction => dispatch(userActions.setUser(id)),
  clearUser: (): ClearUserAction => dispatch(userActions.clearUser()),
});

export default connect(null, mapDispatchToProps)(AppRouter);
