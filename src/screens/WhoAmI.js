import React, { useState } from "react";
import { Auth } from "aws-amplify";

function WhoAmI() {
  const [username, setUsername] = useState("");

  Auth.currentUserInfo().then((user) => {
    if (user) {
      setUsername(user.attributes.email);
    }
  });
  return <div>{username}</div>;
}

export default WhoAmI;