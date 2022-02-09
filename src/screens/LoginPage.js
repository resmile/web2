import React, { useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import Amplify, { Auth, Hub } from "aws-amplify";

var AuthContext = React.createContext(null);

function useAuth() {
  return React.useContext(AuthContext);
}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let from = location.state?.from?.pathname || "/";  
  
  async function signIn() {
    try {
      Auth.signIn({ username, password })
        .then((user) => {
          // Handle case where New Password is Required.
          navigate(from, { replace: true });
          console.log(user);
        })
        .catch((e) => {
          setErrorMessage(e.message);
        });
    } catch (e) {}
  }
  const handleFormSubmission = (e) => {
    e.preventDefault();
    signIn();
  };

  function handleSubmit(event) {
        event.preventDefault();
        let formData = new FormData(event.currentTarget);
        let username = formData.get("username");
        let password = formData.get("password");
        auth.signin(username, password, function () {
            navigate(from, { replace: true });
        });
    }
    return (<div>
      <p>You must log in to view the page at {from}</p>

      <form onSubmit={handleSubmit}>
        <label>
          아이디: <input name="username" type="text"/>
        </label>{" "}
        <label>
          비밀번호: <input name="password" type="password"/>
        </label>{" "}
        <button type="submit">Login</button>

        <br/>

        <label>Username</label>
        <input
          value={username}
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
      </form>
      <button type="submit" onClick={handleFormSubmission}>
        Login
      </button>
      <div>{errorMessage}</div>
    </div>);
}

export default LoginPage;