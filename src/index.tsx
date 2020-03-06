import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { FC } from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import config from "./aws-exports";
import AppRouter from "./routes/Router";
import "./scss/styles.scss";
import "remove-focus-outline";
import "animate.css/animate.min.css";

const urlsIn = config.oauth.redirectSignIn.split(",");
const urlsOut = config.oauth.redirectSignOut.split(",");

const oauth = {
  domain: config.oauth.domain,
  scope: config.oauth.scope,
  redirectSignIn: config.oauth.redirectSignIn,
  redirectSignOut: config.oauth.redirectSignOut,
  responseType: config.oauth.responseType,
};

const hasLocalhost = (hostname): boolean =>
  Boolean(
    hostname.match(/localhost/) ||
      hostname.match(/127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/),
  );

const hasHostname = (hostname): boolean =>
  Boolean(hostname.includes(window.location.hostname));

const isLocalhost = hasLocalhost(window.location.hostname);

if (isLocalhost) {
  urlsIn.forEach((e): void => {
    if (hasLocalhost(e)) {
      oauth.redirectSignIn = e;
    }
  });
  urlsOut.forEach((e): void => {
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

const App: FC = (): JSX.Element => (
  <div id="app">
    <AppRouter />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
