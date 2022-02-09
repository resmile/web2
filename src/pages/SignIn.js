import { Auth } from "aws-amplify";


  function SignIn() {
    const [formState, updateFormState] = useState();
    const signIn = async () => {
        const { username, password } = formState;
    
        try {
            Auth.signIn({ username, password })
              .then((user) => {
                console.log(user);
              })
              .catch((e) => {
                console.log(e.message);
              });
          } catch (e) {}

    
      };
    return (<div>
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
            }))
          }
        >
          Sign Up now
        </button>
      </div>);
  }

  

  export default SignIn;