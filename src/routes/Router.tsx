import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Hub, Auth, API, graphqlOperation } from "aws-amplify";
import Home from "../pages/home/HomePage";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import CreatesPage from "../pages/creates/CreatesPage";
import AccountsPage from "../pages/accounts/AccountsPage";
import NavBar from "../common/NavBar";
import { getUser } from "../graphql/queries";
import { registerUser } from "../graphql/mutations";
import { RouterState } from "../interfaces/Router.i";
import CakesPage from "../pages/cakes/CakesPage";
import { attributesToObject, Toaster } from "../utils/index";
import Loading from "../common/Loading";
import Login from "../pages/login/Login";

export const history = createBrowserHistory();

class AppRouter extends Component {
  public readonly state: RouterState = {
    user: null,
    userAttributes: null,
    isLoading: true,
    accountsTab: "profile",
  };

  public componentDidMount(): void {
    this.getUserData();
    Hub.listen("auth", this.onHubCapsule);
  }

  private getUserData = async (): Promise<void> => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        this.setState(
          { user, isLoading: false },
          (): Promise<void> => this.getUserAttributes(user),
        );
      }
    } catch (err) {
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

  private registerNewUser = async (signInData): Promise<void> => {
    const getUserInput = {
      id: signInData.id || signInData.signInUserSession.idToken.payload.sub,
    };
    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput));
    try {
      if (!data.getUser) {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          email: signInData.email || signInData.signInUserSession.idToken.payload.email,
          registered: true,
        };
        await API.graphql(
          graphqlOperation(registerUser, {
            input: registerUserInput,
          }),
        );
        console.log("user registered");
      }
    } catch (err) {
      console.error("error registering new user");
    }
  };

  private onHubCapsule = async (capsule): Promise<void> => {
    switch (capsule.payload.event) {
      case "signIn":
        await this.getUserData();
        this.registerNewUser(capsule.payload.data);
        break;
      case "signUp":
        this.registerNewUser(capsule.payload.data);
        break;
      case "signOut":
        this.setState({ user: null });
        break;
      default:
        break;
    }
  };

  public render(): JSX.Element {
    const { user, userAttributes, isLoading, accountsTab } = this.state;
    return (
      <Router history={history}>
        <NavBar
          signOut={this.handleSignOut}
          user={user}
          userAttributes={userAttributes}
          setAccountsTab={(tab): void => {
            if (tab !== accountsTab) this.setState({ accountsTab: tab });
          }}
        />
        {isLoading ? (
          <Loading size={100} />
        ) : (
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/creates" user={user} component={CreatesPage} />
            <Route path="/cakes" user={user} component={CakesPage} />
            <Route path="/login" history={history} user={user} component={Login} />
            <Route
              path="/account"
              component={(): JSX.Element =>
                user && (
                  <AccountsPage
                    user={user}
                    userAttributes={userAttributes}
                    accountsTab={accountsTab}
                  />
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
