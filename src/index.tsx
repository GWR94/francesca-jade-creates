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
import "@fortawesome/fontawesome-free/css/all.css";
import configureStore from "./store/store";
import { COLORS, rootTheme } from "./themes";
import Notifier from "./utils/Notifier";
import { isLocalhost, hasLocalhost, hasHostname, hasAmplifyApp } from "./utils";

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
    if (hasHostname(e) && hasAmplifyApp(e)) {
      oauth.redirectSignIn = e; // will be staging.xxxxxx.amplifyapp.com
    } else {
      oauth.redirectSignIn = e; // will be francescajadecreates.co.uk
    }
  });
  urlsOut.forEach((e: string): void => {
    if (hasHostname(e) && hasAmplifyApp(e)) {
      oauth.redirectSignOut = e; // will be staging.xxxxxx.amplifyapp.com
    } else {
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
          <div id="app" style={{ background: COLORS.PalePink }}>
            <AppRouter />
          </div>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </>
);

ReactDOM.render(<App />, document.getElementById("app"));
