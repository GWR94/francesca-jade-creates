import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Hub, Auth, API, graphqlOperation } from "aws-amplify";
import { Authenticator, NavBar as Nav } from "aws-amplify-react";
import Home from "../pages/home/HomePage";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import CreatesPage from "../pages/creates/CreatesPage";
import AccountsPage from "../pages/accounts/AccountsPage";
import NavBar from "../components/NavBar";
import { getUser } from "../graphql/queries";
import { registerUser } from "../graphql/mutations";
import { RouterState } from "../interfaces/Router.i";
import CakesPage from "../pages/cakes/CakesPage";
import { attributesToObject, Toaster } from "../utils/index";
import Loading from "../components/Loading";

export const history = createBrowserHistory();
export const UserContext = React.createContext(null);

class AppRouter extends Component {
  public readonly state: RouterState = {
    user: null,
    admin: false,
    userAttributes: null,
    isLoading: true,
    accountsTab: "profile",
  };

  public async componentDidMount(): Promise<void> {
    await this.getUserData();
    Hub.listen("auth", this.onHubCapsule);
  }

  private getUserData = async (): Promise<void> => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      const { data } = await API.graphql(
        graphqlOperation(getUser, { id: authUser.attributes.sub }),
      );
      authUser
        ? this.setState(
            { user: authUser, admin: data.getUser?.admin ?? false },
            (): Promise<void> => this.getUserAttributes(authUser),
          )
        : this.setState({ user: null, isLoading: false });
    } catch (err) {
      console.error(err);
      this.setState({ user: null, isLoading: false });
    }
  };

  private handleSignOut = async (): Promise<void> => {
    try {
      await Auth.signOut();
      Toaster.show({
        intent: "success",
        message: "Successfully signed out.",
      });
    } catch (err) {
      console.error("Error signing out", err);
      Toaster.show({
        intent: "danger",
        message: "Error signing out. Please try again.",
      });
    }
    history.push("/");
  };

  private getUserAttributes = async (authUserData): Promise<void> => {
    try {
      const attributesArr = await Auth.userAttributes(authUserData);
      const userAttributes = attributesToObject(attributesArr);
      this.setState({ userAttributes, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false, userAttributes: null });
    }
  };

  private registerNewUser = async ({ signInUserSession, username }): Promise<void> => {
    const getUserInput = {
      id: signInUserSession.idToken.payload.sub,
    };
    console.log(getUserInput);
    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput));
    if (!data.getUser) {
      try {
        const registerUserInput = {
          ...getUserInput,
          username,
          email: signInUserSession.idToken.payload.email,
          registered: true,
        };
        const newUser = await API.graphql(
          graphqlOperation(registerUser, {
            input: registerUserInput,
          }),
        );
        console.log(newUser);
      } catch (err) {
        console.error("error registering new user", err);
      }
    }
  };

  private onHubCapsule = async (capsule): Promise<void> => {
    switch (capsule.payload.event) {
      case "signIn":
        await this.getUserData();
        this.registerNewUser(capsule.payload.data);
        break;
      case "signUp":
        console.log("Signed up");
        break;
      case "signOut":
        console.log("Signed out");
        this.setState({ user: null });
        break;
      default:
        break;
    }
  };

  public render(): JSX.Element {
    const { user, admin, userAttributes, isLoading, accountsTab } = this.state;
    return (
      <Router history={history}>
        <NavBar
          signOut={this.handleSignOut}
          user={user}
          admin={admin}
          setAccountsTab={(tab): void => {
            if (tab !== accountsTab) this.setState({ accountsTab: tab });
          }}
        />
        {isLoading ? (
          <Loading size={100} />
        ) : (
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/creates" component={CreatesPage} />
            <Route path="/cakes" component={CakesPage} />
            <Route
              path="/account"
              component={(): JSX.Element =>
                user ? (
                  <AccountsPage
                    user={user}
                    userAttributes={userAttributes}
                    admin={admin}
                    accountsTab={accountsTab}
                  />
                ) : (
                  <Authenticator hide={[Nav]} />
                )
              }
            />
            <Route component={NotFoundPage} />
          </Switch>
        )}
      </Router>
    );
  }
}

export default AppRouter;
