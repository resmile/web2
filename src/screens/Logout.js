import Auth from "@aws-amplify/auth";
import React from "react";

const Logout = () => {
  async function logOut() {
    Auth.signOut();
  }

  const handleFormSubmission = (e) => {
    e.preventDefault();

    logOut();
  };

  return (
    <div>
      <button type="submit" onClick={handleFormSubmission}>
        Logout
      </button>
    </div>
  );
}

export default Logout;