import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Hub, Auth, API, graphqlOperation } from "aws-amplify";
import { Authenticator } from "aws-amplify-react";
import Home from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import CreatesPage from "../pages/CreatesPage";
import AccountsPage from "../pages/AccountsPage";
import NavBar from "../components/NavBar";
import { getUser } from "../graphql/queries";
import { registerUser } from "../graphql/mutations";
import { RouterState } from "../interfaces/Router.i";
import CakesPage from "../pages/CakesPage";

export const history = createBrowserHistory();
export const UserContext = React.createContext(null);

class AppRouter extends Component {
  public readonly state: RouterState = {
    user: null,
    admin: false,
  };

  public componentDidMount(): void {
    this.getUserData();
    Hub.listen("auth", this.onHubCapsule);
  }

  private getUserData = async (): Promise<void> => {
    const authUser = await Auth.currentAuthenticatedUser();
    const { data } = await API.graphql(
      graphqlOperation(getUser, { id: authUser.attributes.sub }),
    );
    authUser
      ? this.setState({ user: authUser, admin: data.getUser.admin })
      : this.setState({ user: null });
  };

  private registerNewUser = async (signInData): Promise<void> => {
    const getUserInput = {
      id: signInData.signInUserSession.idToken.payload.sub,
    };
    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput));
    if (!data.getUser) {
      try {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          email: signInData.signInUserSession.idToken.payload.email,
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

  private onHubCapsule = (capsule): void => {
    switch (capsule.payload.event) {
      case "signIn":
        console.log("Signed in");
        this.getUserData();
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
    const { user, admin } = this.state;
    return (
      <Router history={history}>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/creates" component={CreatesPage} />
          <Route path="/cakes" component={CakesPage} />
          <Route
            path="/account"
            component={(): JSX.Element =>
              user ? <AccountsPage user={user} admin={admin} /> : <Authenticator />
            }
          />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
