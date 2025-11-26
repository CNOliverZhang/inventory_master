import React from 'react';
import {
  Redirect, Route, Switch, useRouteMatch,
} from 'react-router-dom';

import useUser from '@/Contexts/User';
import { PotatofieldRouteConfig } from '@/routes';

const routerView: React.FC<{ route: PotatofieldRouteConfig }> = ({ route }) => {
  const match = useRouteMatch(String(route.path));
  const { user } = useUser();
  if (match) {
    if (!user && route.showIfAuthenticated) {
      return <Redirect key={String(route.path)} to="/user/auth/login" />;
    }
    if (user && route.hideIfAuthenticated) {
      return <Redirect key={String(route.path)} to="/user/dashboard" />;
    }
    if (!user?.isAdmin && route.showIfIsAdmin) {
      return <Redirect key={String(route.path)} to="/" />;
    }
  }
  if (route.routes) {
    const Component = route.component as React.FC;
    return (
      <Route
        key={String(route.path)}
        path={route.path}
        exact={route.exact}
      >
        <Component>
          <Switch>
            {route.routes?.map((childRoute) => routerView({ route: childRoute }))}
            <Route key={String(route.path)} path="*" component={() => <Redirect to="/" />} />
          </Switch>
        </Component>
      </Route>
    );
  }
  return (
    <Route
      key={String(route.path)}
      path={route.path}
      exact={route.exact}
      component={route.component}
    />
  );
};

export default routerView;
