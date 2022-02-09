import React from 'react';

import {
  Link,Outlet
} from "react-router-dom";

function Layout() {
  return (<div>

    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/users">users</Link>
      </li>
      <li>
        <Link to="/login">login</Link>
      </li>
    </ul>
    <Outlet />
  </div>);
}

export default Layout;