import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { FC } from "react";
import ReactDOM from "react-dom";
import AppRouter from "./routes/Router";

/**
 * ? Optional Redux DevTools ?
 * declare global {
 * interface Window {
 *  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
 *   }
 * }
 */

const App: FC = (): JSX.Element => (
  <div id="app">
    <AppRouter />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
