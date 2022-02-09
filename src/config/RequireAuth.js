import React from 'react';
import {
  BrowserRouter as Router, Route, Routes,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";

var AuthContext = React.createContext(null);

function useAuth() {
  return React.useContext(AuthContext);
}

function RequireAuth(_a) {
  var children = _a.children;
  var auth = useAuth();
  var location = (0, useLocation)();
  if (!auth.user) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} replace/>;
  }
  return children;
}

export default RequireAuth;