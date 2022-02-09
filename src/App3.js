import React, { useState, useEffect, useRef } from 'react';
import Amplify, { Auth, Hub } from "aws-amplify";
import {
  BrowserRouter as Router, Route, Routes,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./screens/Home";
//import SignIn from "./pages/SignIn";
import UserList from "./screens/UserList";
import UserDetail from "./screens/UserDetail"


Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: "ap-northeast-2",

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "ap-northeast-2_AgcnvVG8m",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "14li1lf5k2807vf2ik9dearid1",
  },
});

const App = () => {

  useEffect(() => {

  }, []);


  return (
<>
<Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          
          <Route path="/users" element={<UserList />}/>
           <Route path="/users/:id" element={<UserDetail />} />
        </Route>
      </Routes>
    </Router>
</>
  );
}

export default App;