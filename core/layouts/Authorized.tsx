import React from 'react';
import { Redirect, connect } from 'umi';
import pathToRegexp from 'path-to-regexp';
import Authorized from '../utils/Authorized';

const getRouteAuthority = (path: string, routeData) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathToRegexp(`${route.path}(.*)`).test(path)) {
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

const AuthComponent: React.FC = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  kz_login,
}) => {
  const { routes = [] } = route;
  const isLogin = kz_login && kz_login.data;
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ kz_login }) => ({
  kz_login,
}))(AuthComponent);
