import React, { useState } from 'react';
import {  } from "react-router-dom";
import {
  BrowserRouter as Router, Route, Routes,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";
import { fakeAuthProvider } from "./Auth";
import UserList from "./screens/UserList";
import UserDetail from "./screens/UserDetail"


import { signIn } from './config/Auth';
import AuthRoute from './config/AuthRoute';

import Home from './screens/Home';
import About from './screens/About';
import Profile from './screens/Profile';
import NotFound from './screens/NotFound';
import LoginForm from './screens/LoginForm';
import LogoutButton from './components/LogoutButton';









export default function App() {

  const [user, setUser] = useState(null);
  const authenticated = user != null;

  const login = ({ email, password }) => setUser(signIn({ email, password }));
  const logout = () => setUser(null);

    return (

      <Router>



<header>
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/about">
          <button>About</button>
        </Link>
        <Link to="/profile">
          <button>Profile</button>
        </Link>
        {authenticated ? (
          <LogoutButton logout={logout} />
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </header>
      <hr />
      <main>


      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            render={props => (
              <LoginForm authenticated={authenticated} login={login} {...props} />
            )}
          />
          <AuthRoute
            authenticated={authenticated}
            path="/profile"
            render={props => <Profile user={user} {...props} />}
          />

          <Route path="/users" element={<UserList />}/>
           <Route path="/users/:id" element={<UserDetail />} />

           <Route element={<NotFound />} />
        </Route>
      </Routes>
      </main>
    </Router>



    );
}