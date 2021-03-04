/* eslint-disable import/prefer-default-export */
import "core-js/stable";
import "regenerator-runtime/runtime";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import React, { FC } from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import { ThemeProvider } from "@material-ui/core";
import config from "./aws-exports";
import AppRouter from "./routes/Router";
import "remove-focus-outline";
import "normalize.css";
import "animate.css/animate.min.css";
import "@stripe/stripe-js";
import configureStore from "./store/store";
import { rootTheme } from "./themes";
import Notifier from "./utils/Notifier";
import { isLocalhost, hasLocalhost, hasHostname } from "./utils";
import "./themes/styles.css";

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line global-require
  require("dotenv").config();
}

const persist = configureStore();

const urlsIn = config.oauth.redirectSignIn.split(",");
const urlsOut = config.oauth.redirectSignOut.split(",");

const oauth = {
  domain: config.oauth.domain,
  scope: config.oauth.scope,
  redirectSignIn: config.oauth.redirectSignIn,
  redirectSignOut: config.oauth.redirectSignOut,
  responseType: config.oauth.responseType,
};

/**
 * Sets the correct oauth redirect sign-in/sign-out variables depending on
 * if the user is accessing from the localhost or production.
 */
if (isLocalhost) {
  urlsIn.forEach((e: string): void => {
    if (hasLocalhost(e)) {
      oauth.redirectSignIn = e; // will be localhost
    }
  });
  urlsOut.forEach((e: string): void => {
    if (hasLocalhost(e)) {
      oauth.redirectSignOut = e; // will be localhost
    }
  });
} else {
  urlsIn.forEach((e: string): void => {
    if (hasHostname(e)) {
      oauth.redirectSignIn = e; // will be francescajadecreates.co.uk
    }
  });
  urlsOut.forEach((e: string): void => {
    if (hasHostname(e)) {
      oauth.redirectSignOut = e; // will be francescajadecreates.co.uk
    }
  });
}
const configUpdate = config;
configUpdate.oauth = oauth;
Amplify.configure({
  ...configUpdate,
  Auth: {
    mandatorySignIn: false,
  },
});

export const App: FC = (): JSX.Element => (
  <>
    <Notifier />
    <Provider store={persist.store}>
      <PersistGate loading={null} persistor={persist.persistor}>
        <ThemeProvider theme={rootTheme}>
          <div
            id="app"
            style={{
              background: "#F2B7D0",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "stretch",
              position: "relative",
            }}
          >
            <AppRouter />
          </div>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </>
);

ReactDOM.render(<App />, document.getElementById("app"));
