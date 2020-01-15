import React, { FC } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
/**
 * import { Provider } from "react-redux";
 * Optional react-redux import
 */
import Home from "../pages/home/components/Home";
import NotFoundPage from "../pages/_misc/components/NotFoundPage";
/**
 * import other components...
 */

export const history = createBrowserHistory();

const AppRouter: FC = (): JSX.Element => (
  <Router history={history}>
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

export default AppRouter;
