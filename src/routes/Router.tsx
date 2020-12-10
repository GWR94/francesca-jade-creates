import React, { Component } from "react";
import { Router, Route, Switch, Redirect, RouteComponentProps } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Hub, Auth, API, graphqlOperation } from "aws-amplify";
import { Container, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js";
import Landing from "../pages/home/Landing";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import NavBar from "../pages/navigation/NavBar";
import ViewProduct from "../pages/accounts/components/ViewProduct";
import { getUser } from "../graphql/queries";
import { registerUser } from "../graphql/mutations";
import {
  RouterState,
  RouterDispatchProps,
  SignInUserData,
  HubCapsule,
  RouterProps,
} from "./interfaces/Router.i";
import { attributesToObject } from "../utils/index";
import { openSnackbar } from "../utils/Notifier";
import Loading from "../common/Loading";
import Login from "../pages/home/Login";
import UpdateProduct from "../pages/accounts/components/UpdateProduct";
import Basket from "../pages/payment/Basket";
import { ClearBasketAction } from "../interfaces/basket.redux.i";
import * as basketActions from "../actions/basket.actions";
import * as userActions from "../actions/user.actions";
import * as productsActions from "../actions/products.actions";
import { SetUserAction, ClearUserAction } from "../interfaces/user.redux.i";
import { INTENT } from "../themes";
import { FetchProductsSuccessAction } from "../interfaces/products.redux.i";
import { AppState } from "../store/store";
import ProductsList from "../pages/accounts/components/ProductsList";
import { ProductProps } from "../pages/accounts/interfaces/Product.i";
import AccountsPage from "../pages/accounts/AccountsPage";
import background from "../img/pinkbg2.png";
import Footer from "../pages/navigation/Footer";

export const history = createBrowserHistory();

/**
 * TODO
 * [ ] Check & fix loading spinner off centre
 */

class AppRouter extends Component<RouterProps, RouterState> {
  public readonly state: RouterState = {
    user: null,
    userAttributes: null,
    isLoading: true,
  };

  // set the property to be false to begin with, so no user can accidentally be an admin.
  private _admin = false;

  public async componentDidMount(): Promise<void> {
    const { user } = this.state;
    try {
      // listener for auth changes such as signIn, signOut, signUp etc.
      // @ts-ignore
      Hub.listen("auth", this.onHubCapsule);
      // get the current users information
      if (!user) await this.getUserData();
      const data = await Auth.currentUserCredentials();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

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
        this._admin =
          user?.signInUserSession?.idToken?.payload["cognito:groups"]?.includes(
            "Admin",
          ) ?? false;

        /**
         * if there is a user object, set it into state and set isLoading to false to stop any
         * loading UI effects. Then call getUserAttributes() as the callback function.
         */
        this.setState({ user }, (): Promise<void> => this.getUserAttributes(user));
      } else {
        /**
         * If there is no user object from Auth.currentAuthUser then set this.admin to be false, and
         * set the user object to null, and remove loading UI effects by setting isLoading to false.
         */
        this._admin = false;
        this.setState({ user: null });
      }
      this.setState({ isLoading: false });
    } catch (err) {
      /**
       * If there are any errors anywhere in the function, then catch the error, set this.admin to false,
       * set user state to null and remove loading UI effects by settings isLoading state to false.
       */
      this._admin = false;
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
      // set user state to null,
      this.setState({ user: null });
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
      const { user } = this.state;
      const { setUser } = this.props;
      // get the array of user attributes from Auth.userAttributes().
      const attributesArr: CognitoUserAttribute[] = await Auth.userAttributes(
        authUserData,
      );
      // convert the array to an object with the help of utils' attributesToObject function.
      const userAttributes = attributesToObject(attributesArr);
      // set the current users' sub to redux reducer.
      if (userAttributes.sub && user?.username) {
        setUser(
          userAttributes.sub,
          user.username,
          this._admin,
          userAttributes.email,
          userAttributes.email_verified,
        );
      }
      /**
       * Set userAttributes into sub so it can be used in the application, and stop ui loading
       * effects by setting isLoading to false
       */
      this.setState({ userAttributes });
    } catch (err) {
      /**
       * if there are any errors, set userAttributes to null, and remove the loading UI
       * effects by setting isLoading to false
       */
      this.setState({ userAttributes: null });
    }
  };

  /**
   * A method to register a new user, and save it into the database by using the registerUser
   * graphQL mutation.
   * @param {SignInUserData} signInData - Object containing the current authenticated
   * users' data
   */
  private registerNewUser = async (signInData: SignInUserData): Promise<void> => {
    console.log(signInData);
    /**
     * Get the id from signInData - it's in different locations based on what provider user
     * logged in with. This will be used to check if the user is already a part of the database
     * by checking the id against the getUser query.
     */

    const id =
      signInData?.attributes?.sub ??
      signInData?.id ??
      signInData.signInUserSession?.idToken?.payload?.sub;

    console.log(id);
    // check to see if the user is in the database
    try {
      const { data } = await API.graphql(graphqlOperation(getUser, { id }));
      // if there is no data.getUser, then the user is not in the database
      if (!data.getUser) {
        /**
         * spread the getUserInput object into a new variable, and add the username and email
         * from signInData to it. Then set registered to true so the database holds valid
         * information.
         */
        const registerUserInput = {
          id,
          username: signInData.username,
          email: signInData?.email ?? signInData.signInUserSession.idToken.payload.email,
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
      console.error(err);
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
        await this.getUserData();
        await this.registerNewUser(capsule.payload.data);
        break;
      // if the user is signing up, register the user
      case "signUp":
        console.log("user signed up");
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
    const { userAttributes, isLoading, user } = this.state;
    return (
      <Router history={history}>
        <div
          className="landing__background"
          style={{ background: `url(${background}) no-repeat center center fixed` }}
        >
          <NavBar signOut={this.handleSignOut} admin={this._admin} />
          {isLoading ? (
            <Loading size={100} />
          ) : (
            <>
              <Switch>
                <Route path="/" exact component={Landing} />
                <Route
                  path="/creates"
                  exact
                  component={(): JSX.Element => (
                    <div className="content-container">
                      <Container>
                        <Typography
                          variant="h4"
                          style={{
                            paddingTop: 12,
                          }}
                        >
                          Creations
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          style={{
                            margin: "10px 0",
                          }}
                        >
                          -- Placeholder --
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          style={{
                            margin: "10px 0 20px",
                          }}
                        >
                          To filter the products please click the pink button on the left
                          hand side, and filter the results to your preferences.
                        </Typography>
                        <ProductsList type="Creates" admin={this._admin} />
                      </Container>
                    </div>
                  )}
                />
                <Route
                  path="/basket"
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
                      <ViewProduct id={_.match.params.id} type="Creates" />
                    </div>
                  )}
                />
                <Route
                  path="/cakes"
                  exact
                  component={(): JSX.Element => (
                    <div className="content-container">
                      <Container>
                        <Typography
                          variant="h4"
                          style={{
                            paddingTop: 12,
                          }}
                        >
                          Cakes
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          style={{
                            margin: "10px 0",
                          }}
                        >
                          -- Placeholder --
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          style={{
                            margin: "10px 0 20px",
                          }}
                        >
                          To filter the products please click the pink button on the left
                          hand side, and filter the results to your preferences.
                        </Typography>
                        <ProductsList type="Cake" admin={this._admin} />
                      </Container>
                    </div>
                  )}
                />
                <Route
                  path="/cakes/:id"
                  component={(_: { match: { params: { id: string } } }): JSX.Element => (
                    <div className="content-container">
                      <ViewProduct id={_.match.params.id} type="Cake" />
                    </div>
                  )}
                />
                <Route path="/login" history={history} component={Login} />
                <Route
                  path="/account"
                  exact
                  component={(): JSX.Element =>
                    user ? (
                      <div className="content-container">
                        <AccountsPage
                          admin={this._admin}
                          history={history}
                          user={user}
                          userAttributes={userAttributes}
                        />
                      </div>
                    ) : (
                      <Redirect to="/" />
                    )
                  }
                />
                <Route
                  path="/account/:id"
                  component={(
                    matchParams: RouteComponentProps<{ id: string }>,
                  ): JSX.Element =>
                    this._admin ? (
                      <div className="content-container">
                        <UpdateProduct
                          history={history}
                          update
                          id={matchParams.match.params.id}
                          admin={this._admin}
                        />
                      </div>
                    ) : (
                      <Redirect to="/" />
                    )
                  }
                />
                <Route component={NotFoundPage} />
              </Switch>
              <Footer />
            </>
          )}
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state: AppState): { sub: string | null } => ({
  sub: state.user.id,
});

const mapDispatchToProps = (dispatch: Dispatch): RouterDispatchProps => ({
  clearBasket: (): ClearBasketAction => dispatch(basketActions.clearBasket()),
  setUser: (
    id: string,
    username: string,
    admin: boolean,
    email: string,
    emailVerified: boolean,
  ): SetUserAction =>
    dispatch(userActions.setUser(id, username, admin, email, emailVerified)),
  clearUser: (): ClearUserAction => dispatch(userActions.clearUser()),
  fetchProductsSuccess: (products: ProductProps[]): FetchProductsSuccessAction =>
    dispatch(productsActions.fetchProductsSuccess(products)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
