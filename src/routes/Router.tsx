import React, { FC } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
/**
 * import { Provider } from "react-redux";
 * Optional react-redux import
 */
import Home from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import CreatesPage from "../pages/CreatesPage";
import AccountsPage from "../pages/AccountsPage";
import NavBar from "../components/NavBar";
/**
 * import other components...
 */

export const history = createBrowserHistory();

const AppRouter: FC = (): JSX.Element => (
  <Router history={history}>
    <NavBar />
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/creates" component={CreatesPage} />
      <Route path="/account" component={AccountsPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

export default AppRouter;
