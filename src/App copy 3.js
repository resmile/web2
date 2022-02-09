import React, { useState } from 'react';
import {
  BrowserRouter as Router, Route, Routes,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";
import Home from "./screens/Home";

import UserList from "./screens/UserList";
import UserDetail from "./screens/UserDetail"

import Amplify, { Auth, Hub } from "aws-amplify";
//import config from './aws-exports';
import { useForm }  from 'react-hook-form';


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


export default function App() {
    return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/users" element={<RequireAuth><UserList /></RequireAuth>}/>
            <Route path="/users/:id" element={<RequireAuth><UserDetail /></RequireAuth>} />
          </Route>
          </Routes>
      </Router>
    </AuthProvider>
    );
}

function Layout() {
    return (
    <div>
      <AuthStatus />
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/users">회원목록</Link>
        </li>
        <li>
          <Link to="/login">로그인</Link>
        </li>
      </ul>
      <Outlet />
    </div>
    );
}
var AuthContext = React.createContext(null);

function AuthProvider({children}) {
    let [user, setUser] = useState();
  
    let signin = function (newUser, password, callback) {
      try {
        Auth.signIn(newUser,password)
          .then((user) => {
            console.log(newUser);
            // Handle case where New Password is Required.
            setUser(newUser);
            callback(newUser);
            console.log(user);
          })
          .catch((e) => {
            console.log(e.message);
          });
      } catch (e) { console.error(e); }
    };
    let signup = function (newUser, password, email,callback) {
      try {
        Auth.signUp({ newUser, password, attributes: { email } })
          .then((user) => {
            console.log(newUser);
            // Handle case where New Password is Required.
            setUser(newUser);
            callback(newUser);
            console.log(user);
          })
          .catch((e) => {
            console.log(e.message);
          });
      } catch (e) { console.error(e); }
    };


    let signout = function (callback) {
      Auth.signOut({ global: true });
            setUser(null);
            callback();
    };
    let value = { user, signin, signup, signout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
function useAuth() {
    return React.useContext(AuthContext);
}
function AuthStatus() {
    var auth = useAuth();
    var navigate = (0, useNavigate)();
    if (!auth.user) {
        return <p>미로그인</p>;
    }
    return (<p>
      Welcome {auth.user}!{" "}
      <button onClick={function () {
            auth.signout(function () { return navigate("/"); });
        }}>
        Sign out
      </button>
    </p>);
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
function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";  
  
  function handleSubmit(event) {
        event.preventDefault();
        let formData = new FormData(event.currentTarget);
        let username = formData.get("username");
        let password = formData.get("password");
        let email = "resmile@gmail.com";

        auth.signup(username, password, email,function () {
            navigate(from, { replace: true });
        });
    }
    return (<div>
      <p>로그인이 필요합니다. 접속경로 :  {from}</p>

      <form onSubmit={handleSubmit}>
        <label>
          아이디: <input name="username" type="text"/>
        </label>{" "}
        <label>
          비밀번호: <input name="password" type="password"/>
        </label>{" "}
        <button type="submit">로그인</button>

      </form>
    </div>);
}