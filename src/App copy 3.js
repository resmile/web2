import React, { useState, useEffect, useRef } from 'react';
import Amplify, { Auth, Hub } from "aws-amplify";
import config from './aws-exports'
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

const initialFormState = {
  username: "",
  password: "",
  email: "",
  authCode: "",
  formType: "signIn",
};

const App = () => {
  const [formState, updateFormState] = useState(initialFormState);

  const [user, updateUser] = useState(null);

  const checkUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('user attributes: ', user.attributes);
      updateUser(user);

      console.log("got user", user);

      updateFormState(() => ({ ...formState, formType: "signedIn" }));
    } catch (err) {
      console.log("checkUser error", err);
      updateFormState(() => ({ ...formState, formType: "signIn" }));
    }
  };

  // Skip this if you're not using Hub. You can call updateFormState function right
  // after the Auth.signOut() call in the button.
  const setAuthListener = async () => {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signOut":
          console.log(data);

          updateFormState(() => ({
            ...formState,
            formType: "signIn",
          }));

          break;
        case "signIn":
          console.log(data);

          break;
      }
    });
  };

  useEffect(() => {
    checkUser();
    setAuthListener();
  }, []);

  const onChange = (e) => {
    e.persist();
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }));
  };

  const { formType } = formState;

  const signUp = async () => {
    const { username, email, password } = formState;
    const phone_number = "+821023935342";
    await Auth.signUp({ username, password, attributes: { email } });

    updateFormState(() => ({ ...formState, formType: "confirmSignUp" }));
  };

  const confirmSignUp = async () => {
    const { username, authCode } = formState;

    try {
      await Auth.confirmSignUp(username, authCode);
    } catch (error) {
        console.log('error confirming sign up', error);
    }

    updateFormState(() => ({ ...formState, formType: "signIn" }));
  };

  const reConfirmCode = async () => {
    const { username } = formState;

    try {
      await Auth.resendSignUp(username);
      console.log('code resent successfully');
  } catch (err) {
      console.log('error resending code: ', err);
  }

  };

  const signIn = async () => {
    const { username, password } = formState;

    await Auth.signIn(username, password);

    updateFormState(() => ({ ...formState, formType: "signedIn" }));
  };

  // console.log(formType);

  return (
    <>
      <h1>App</h1>

      {formType === "signUp" && (
        <div>
          <input name="username" onChange={onChange} placeholder="username" />
          <input
            name="password"
            type="password"
            onChange={onChange}
            placeholder="password"
          />
          <input name="email" onChange={onChange} placeholder="email" />

          <button onClick={signUp}>Sign Up</button>

          <p>Already signed up?</p>

          <button
            onClick={() =>
              updateFormState(() => ({
                ...formState,
                formType: "signIn",
              }))
            }
          >
            Sign In instead
          </button>
        </div>
      )}

      {formType === "confirmSignUp" && (
        <div>
          <input
            name="authCode"
            onChange={onChange}
            placeholder="cnfirm auth code"
          />
          <button onClick={confirmSignUp}>Confirm Sign up</button>
          <button onClick={reConfirmCode}>Do you want to reSend Code?</button>

        </div>
      )}

      {formType === "signIn" && (
        <div>
          <input name="username" onChange={onChange} placeholder="username" />
          <input
            name="password"
            type="password"
            onChange={onChange}
            placeholder="password"
          />
          <button onClick={signIn}>Sign In</button>

          <p>No account yet?</p>

          <button
            onClick={() =>
              updateFormState(() => ({
                ...formState,
                formType: "signUp",
              }))
            }
          >
            Sign Up now
          </button>
        </div>
      )}

      {formType === "signedIn" && (
        <div>
          <h2>
            Welcome the app, {user.username} ({user.attributes.email})!
          </h2>

          <button
            onClick={() => {
              Auth.signOut({ global: true });
            }}
          >
            Sign out
          </button>
        </div>
      )}

      <hr />
    </>
  );
}

export default App;