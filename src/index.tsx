import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { FC } from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import AppRouter from "./routes/Router";
import "./scss/styles.scss";

/**
 * ? Optional Redux DevTools ?
 * declare global {
 * interface Window {
 *  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
 *   }
 * }
 */

Amplify.configure(awsExports);

const App: FC = (): JSX.Element => (
  <div id="app">
    <AppRouter />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
