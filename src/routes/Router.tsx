import React, { useEffect, useState } from "react";
import { Router, Route, Switch, Redirect, RouteComponentProps } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Hub, Auth, API, graphqlOperation } from "aws-amplify";
import { connect, useDispatch } from "react-redux";
import { CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js";
import { Dispatch } from "redux";
import Landing from "../pages/home/Landing";
import NavBar from "../pages/navigation/NavBar";
import ViewProduct from "../pages/products/components/ViewProduct";
import { getUser } from "../graphql/queries";
import { registerUser } from "../graphql/mutations";
import {
  RouterState,
  SignInUserData,
  HubCapsule,
  RouterProps,
} from "./interfaces/Router.i";
import { attributesToObject } from "../utils/index";
import Loading from "../common/Loading";
import UpdateProduct from "../pages/products/components/UpdateProduct";
import Basket from "../pages/payment/Basket";
import * as userActions from "../actions/user.actions";
import AccountsPage from "../pages/accounts/AccountsPage";
import background from "../img/pinkbg.jpg";
import Footer from "../pages/navigation/Footer";
import PrivacyPolicy from "../pages/policies/components/PrivacyPolicy";
import TermsOfService from "../pages/policies/components/TermsOfService";
import FAQ from "../pages/policies/components/FAQ";
import NotFoundPage from "../common/containers/NotFoundPage";
import ScrollToTop from "../hooks/ScrollToTop";
import Contact from "../pages/policies/components/Contact";
import Themes from "../pages/products/components/Themes";
import Creations from "../pages/products/components/Creations";
import Cakes from "../pages/products/components/Cakes";
import { UserAttributeProps } from "../pages/accounts/interfaces/Accounts.i";
import { SetUserAction } from "../interfaces/user.redux.i";

export const history = createBrowserHistory();

/**
 * TODO
 * [ ] Check & fix loading spinner off centre
 */

class AppRouter extends React.Component<RouterProps> {
  public readonly state: RouterState = {
    user: null,
    userAttributes: null,
    isLoading: true,
  };
  // set the property to be false to begin with, so no user can accidentally be an admin.
  public admin = false;

  public async componentDidMount(): Promise<void> {
    // @ts-ignore
    Hub.listen("auth", this.onHubCapsule);

    const { user } = this.state;
    // listener for auth changes such as signIn, signOut, signUp etc.
    if (!user) await this.getUserData();
  }

  /**
   * A method to register a new user, and save it into the database by using the registerUser
   * graphQL mutation.
   * @param {SignInUserData} signInData - Object containing the current authenticated
   * users' data
   */
  private registerNewUser = async (signInData: SignInUserData): Promise<void> => {
    console.log("REGISTER");
    /**
     * Get the id from signInData - it's in different locations based on what provider user
     * logged in with. This will be used to check if the user is already a part of the database
     * by checking the id against the getUser query.
     */
    const id =
      signInData?.attributes?.sub ??
      signInData?.id ??
      signInData.signInUserSession?.idToken?.payload?.sub;
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
      }
    } catch (err) {
      // log any errors
      console.error(err);
    }
  };

  /**
   * Method which converts an object of auth data into a readable object which can be
   * set into state to get the current authenticated users' attributes, which can then
   * be set into state to be used in the application.
   * @param {CognitoUser} authUserData - An object containing the data for the current
   * auth user which can be used for getting the users attributes.
   */
  public getUserAttributes = async (
    authUserData: CognitoUser,
  ): Promise<UserAttributeProps | null> => {
    try {
      // get the array of user attributes from Auth.userAttributes().
      const attributesArr: CognitoUserAttribute[] = await Auth.userAttributes(
        authUserData,
      );
      // convert the array to an object with the help of utils' attributesToObject function.
      const userAttributes = attributesToObject(attributesArr);
      // set the current users' sub to redux reducer.
      return userAttributes;
    } catch (err) {
      /**
       * if there are any errors, set userAttributes to null, and remove the loading UI
       * effects by setting isLoading to false
       */
      return null;
    }
  };

  /**
   * A method to retrieve the current authenticated users data, and set it into state. It also
   * checks to see whether or not the user is an admin or not, and will set it into memory in
   * this.admin variable.
   * @param {boolean = false} retry - optional boolean value to signal if there has been a retry in
   * calling the function - this can only be done once so if it's set to true then there will not be
   * another retry attempt if there is a fail.
   */
  public getUserData = async (): Promise<void> => {
    const { setUser } = this.props;
    const user = await Auth.currentAuthenticatedUser();
    if (user) {
      /**
       * if the current user is part of the Admin group in the cognito groups array, then set
       * this.admin to true, otherwise set it to false.
       */
      this.admin =
        user.signInUserSession?.idToken?.payload["cognito:groups"]?.includes("Admin") ??
        false;

      /**
       * if there is a user object, set it into state and set isLoading to false to stop any
       * loading UI effects. Then call getUserAttributes() as the callback function.
       */
      const userAttributes = await this.getUserAttributes(user);
      if (userAttributes?.sub) {
        setUser(userAttributes.sub, this.admin);
      }
      this.setState({
        user,
        userAttributes,
        isLoading: false,
      });
    } else {
      /**
       * If there is no user object from Auth.currentAuthUser then set this.admin to be false, and
       * set the user object to null, and remove loading UI effects by setting isLoading to false.
       */
      this.admin = false;
      this.setState({
        user: null,
        isLoading: false,
      });
    }
  };

  /**
   * A method to control the flow of the hub's different auth states, such
   * as signing in, signing out and signing up.
   * @param {HubCapsule} capsule - data which is sent to the hub when a
   * certain action occurs - i.e registering users sends data related to
   * registering a user.
   */
  public onHubCapsule = async (capsule: HubCapsule): Promise<void> => {
    switch (capsule.payload.event) {
      // if the user is signing in, get the users' data.
      case "signIn":
        console.log("signed in");
        await this.getUserData();
        await this.registerNewUser(capsule.payload.data);
        break;
      // if the user is signing up, register the user
      case "signUp":
        console.log("user signed up");
        break;
      // if the user is signing out, remove the user object from state.
      case "signOut":
        this.setState({
          user: null,
          isLoading: false,
        });
        break;
      default:
        break;
    }
  };

  public render() {
    const { userAttributes, isLoading, user } = this.state;
    return (
      <Router history={history}>
        <div
          style={{
            background: `url(${background}) no-repeat center center fixed`,
            minHeight: "100vh",
            height: "100%",
            backgroundSize: "cover",
          }}
        >
          <NavBar admin={this.admin} />
          {isLoading ? (
            <Loading size={100} />
          ) : (
            <>
              <ScrollToTop />
              <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/creates" exact component={Creations} />
                <Route path="/basket" history={history} component={Basket} />
                <Route
                  path="/creates/:id"
                  component={(_: {
                    match: {
                      params: {
                        id: string;
                      };
                    };
                  }): JSX.Element => (
                    <div className="content-container">
                      <ViewProduct id={_.match.params.id} type="Creates" />
                    </div>
                  )}
                />
                <Route path="/themes" component={Themes} />
                <Route path="/cakes" exact component={Cakes} />
                <Route
                  path="/cakes/:id"
                  component={(_: {
                    match: {
                      params: {
                        id: string;
                      };
                    };
                  }): JSX.Element => (
                    <div className="content-container">
                      <ViewProduct id={_.match.params.id} type="Cake" />
                    </div>
                  )}
                />
                <Route
                  path="/account"
                  exact
                  component={(): JSX.Element =>
                    user ? (
                      <AccountsPage
                        admin={this.admin}
                        userAttributes={userAttributes}
                        user={user}
                      />
                    ) : (
                      <Redirect to="/" />
                    )
                  }
                />
                <Route
                  path="/account/:id"
                  component={(
                    matchParams: RouteComponentProps<{
                      id: string;
                    }>,
                  ): JSX.Element =>
                    this.admin ? (
                      <div className="content-container">
                        <UpdateProduct
                          history={history}
                          update
                          id={matchParams.match.params.id}
                        />
                      </div>
                    ) : (
                      <Redirect to="/" />
                    )
                  }
                />
                <Route path="/privacy-policy" component={PrivacyPolicy} />
                <Route path="/terms-of-service" component={TermsOfService} />
                <Route path="/faq" component={FAQ} />
                <Route path="/contact" component={Contact} />
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUser: (id: string, admin: boolean): SetUserAction =>
    dispatch(userActions.setUser(id, admin)),
});

export default connect(null, mapDispatchToProps)(AppRouter);
