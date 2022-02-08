import React, { useState } from "react";
import { Auth } from "aws-amplify";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function signIn() {
    try {
      Auth.signIn({ username, password })
        .then((user) => {
          // Handle case where New Password is Required.
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
  return (
    <div>
      <form>
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
          name="username"
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <button type="submit" onClick={handleFormSubmission}>
        Login
      </button>

      <div>{errorMessage}</div>
    </div>
  );
}

export default SignIn;