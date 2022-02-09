var AuthContext = React.createContext(null);

function useAuth() {
  return React.useContext(AuthContext);
}

function AuthStatus() {
  var auth = useAuth();
  var navigate = (0, useNavigate)();
  if (!auth.user) {
      return <p>You are not logged in.</p>;
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

export default AuthStatus;