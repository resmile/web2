import React, { useState } from "react";
import { Hub } from "aws-amplify";
import SignIn from "./SignIn";
import WhoAmI from "./WhoAmI";
import Logout from "./Logout";

function SecurePage() {
  const [authStatus, setAuthStatus] = useState("");

  const listener = (data) => {
    setAuthStatus(data.payload.event);
  };

  Hub.listen("auth", listener);

  return (
    <div>
      {authStatus === "signIn" ? (
        <div>
          Hello
          <WhoAmI />
          <Logout />
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default SecurePage;