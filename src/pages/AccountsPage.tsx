import React, { Component } from "react";
import { API, graphqlOperation, Auth, Hub } from "aws-amplify";
import { Authenticator } from "aws-amplify-react";
import { Tabs, Tab } from "@blueprintjs/core";
import { getUser } from "../graphql/queries";
import { registerUser } from "../graphql/mutations";
import NewProduct from "../components/NewProduct";
import Profile from "../components/Profile";
import Products from "../components/Products";
import background from "../img/background.jpg";

interface State {
  user: any;
  admin: boolean;
  selectedTab: "profile" | "current" | "new";
}

export default class AccountsPage extends Component<{}, State> {
  public readonly state: State = {
    user: null,
    admin: false,
    selectedTab: "new", // ! CHANGE LATER
  };

  public componentDidMount(): void {
    this.getUserData();
    Hub.listen("auth", this.onHubCapsule);
  }

  public getUserData = async (): Promise<void> => {
    const authUser = await Auth.currentAuthenticatedUser();
    const { data } = await API.graphql(
      graphqlOperation(getUser, { id: authUser.attributes.sub }),
    );
    authUser
      ? this.setState({ user: authUser, admin: data.getUser.admin })
      : this.setState({ user: null });
  };

  public registerNewUser = async (signInData): Promise<void> => {
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

  public handleTabChange = (selectedTab): void => this.setState({ selectedTab });

  public render(): JSX.Element {
    const { user, admin, selectedTab } = this.state;
    return (
      <div
        style={{
          background: `url(${background}) no-repeat center center fixed`,
        }}
      >
        {!user ? (
          <Authenticator />
        ) : (
          <div className="content-container">
            <Tabs
              id="accountsTabs"
              className="account__tabs-container"
              onChange={this.handleTabChange}
              selectedTabId={selectedTab}
            >
              <Tab id="profile" title="Profile" panel={<Profile />} />

              {admin ? (
                <Tab id="current" title="Current Products" panel={<Products />} />
              ) : (
                <Tab id="orders" title="My Orders" panel={<Orders />} />
              )}
              {admin && (
                <Tab
                  id="new"
                  title="Create Product"
                  panel={
                    <NewProduct onCancel={(): void => this.handleTabChange("profile")} />
                  }
                />
              )}
            </Tabs>
          </div>
        )}
      </div>
    );
  }
}
