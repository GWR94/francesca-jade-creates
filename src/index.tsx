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
import "animate.css/animate.min.css";
import "normalize.css";
import "./scss/styles.scss";
import "@stripe/stripe-js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import configureStore from "./store/store";
import { COLORS, rootTheme } from "./themes";
import Notifier from "./utils/Notifier";
import { isLocalhost, hasLocalhost, hasHostname } from "./utils";

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
      oauth.redirectSignIn = e;
    }
  });
  urlsOut.forEach((e: string): void => {
    if (hasLocalhost(e)) {
      oauth.redirectSignOut = e;
    }
  });
} else {
  urlsIn.forEach((e): void => {
    if (hasHostname(e)) {
      oauth.redirectSignIn = e;
    }
  });
  urlsOut.forEach((e): void => {
    if (hasHostname(e)) {
      oauth.redirectSignOut = e;
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
          <div id="app" style={{ background: COLORS.PalePink }}>
            <AppRouter />
          </div>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </>
);

ReactDOM.render(<App />, document.getElementById("app"));
