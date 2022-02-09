import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


function AuthRoute({ authenticated, component: Component, render, ...rest }) {
  return (
    <Routes>
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          render ? render(props) : <Component {...props} />
        ) : (
          <Navigate
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
    </Routes>
  );
}

export default AuthRoute;
