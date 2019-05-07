import React from 'react'
import { Route, Redirect} from 'react-router-dom'

export function PrivateRoute({ user, path, component: Component, ...rest }) {
  return (
    <Route
      path={path}
      render={props =>
        user.isAuthenticated ? (
          <Component user={user} {...rest} {...props}/>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
