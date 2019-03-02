import React from 'react'
import Redirect from 'react-router-dom/Redirect';
import { Route } from 'react-router-dom';

export default ({ isLogged, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => isLogged
      ? <Component {...props} />
      : <Redirect
        to={{
          pathname: "/login",
          state: { from: props.location }
        }}
      />
    }
  />
);