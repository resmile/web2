import React, { useState } from 'react';
import Amplify, { Auth, Hub } from "aws-amplify";

function AuthProvider({children}) {
  let [user, setUser] = useState();
  
  const aaaa = (newUser, password, callback ) => {
    setUser(newUser);
    callback(newUser);
  };

  let signin = function (newUser, password, callback) {
    console.log(newUser);
    const u = "resmile";
    const p = "aromaceo23!";

    try {
      Auth.signIn({ u, p })
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
    } catch (e) {}

    
  };

  let signout = function (callback) {
          setUser(null);
          callback();
  };
  let value = { user, signin, signout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

var AuthContext = React.createContext(null);


export default AuthProvider;
