import React, { useContext, useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Route, Routes,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";
import Home from "./screens/Home";

import UserList from "./screens/UserList";
import UserDetail from "./screens/UserDetail"

import Amplify, { Auth, Hub } from "aws-amplify";
//import config from './aws-exports';
import { useForm }  from 'react-hook-form';


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



export default function App() {
  


    return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirmsignup" element={<ConfirmSignUp />} />
            <Route path="/users" element={<RequireAuth><UserList /></RequireAuth>}/>
            <Route path="/users/:id" element={<RequireAuth><UserDetail /></RequireAuth>} />
          </Route>
          </Routes>
      </Router>
    </AuthProvider>
    );
}

function Layout() {
    return (
    <div>
      <AuthStatus />
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/users">회원목록</Link>
        </li>
        <li>
          <Link to="/login">로그인</Link>
        </li>
        <li>
          <Link to="/signup">회원가입</Link>
        </li>        
      </ul>
      <Outlet />
    </div>
    );
}
var AuthContext = React.createContext(null);

function AuthProvider({children}) {
  
  const user1 =Auth.currentAuthenticatedUser();
      console.log('1.user attributes: ', user1.attributes);


    let [username, setUsername] = useState();
    console.log("2.username->", username);
    let signin = function (newUser, password, callback) {
      try {
        Auth.signIn(newUser,password)
          .then((user) => {
            console.log("3->",newUser);
            // Handle case where New Password is Required.
            setUsername(user.username);
            callback(user.username);
            console.log("4->",user);
          })
          .catch((e) => {
            console.log(e.message);
          });
      } catch (e) { console.error(e); }
    };
    let signup = function (username, password, email,callback) {
      try {
        const { user } = Auth.signUp({
            username,
            password,
            attributes: {
                email,  
            }
        });
        setUsername(username);
        callback(username);
    } catch (error) {
        console.log('error signing up:', error);
    }
    };

    let confirmSignUp = function (username, code,callback) {
      try {
       Auth.confirmSignUp(username, code);
       callback(username);
      } catch (error) {
          console.log('error confirming sign up', error);
      }
    };


    let signout = function (callback) {
      Auth.signOut();
            setUsername(null);
            callback();
    };
    let value = { 
      username, 
      signin, 
      signup, 
      confirmSignUp, 
      signout
    };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
function useAuth() {
    console.log("6.AuthContext->", AuthContext);
    ///?????
    console.log("7.useContext(AuthContext)=>",useContext(AuthContext));
    // {auth = { user:'resmile' , signin: f}} 객체를 반환하네?
    return useContext(AuthContext);
}
function AuthStatus() {
    var auth = useAuth();
    var navigate = (0, useNavigate)();
    if (!auth.username) {
        return <p>미로그인</p>;
    }
    return (<p>
      Welcome {auth.username}!{" "}
      <button onClick={function () {
            auth.signout(function () { return navigate("/"); });
        }}>
        Sign out
      </button>
    </p>);
}
function RequireAuth(_a) {
    var children = _a.children;
    console.log("8.children=>",children);
    //childern은 경로를 뽑아내는 것 같아  예: UserList

    var auth = useAuth();
    console.log("9.auth=>", auth);
    // {auth = { user:'resmile' , signin: f}} 를 가진 객체


    var location = (0, useLocation)();
    if (!auth.username) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }
    return children;
}
function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";  
  
  function handleSubmit(event) {
        event.preventDefault();
        let formData = new FormData(event.currentTarget);
        let username = formData.get("username");
        let password = formData.get("password");

        auth.signin(username, password,function () {
            navigate(from, { replace: true });
        });
    }
    return (<div>
      <p>로그인이 필요합니다. 접속경로 :  {from}</p>

      <form onSubmit={handleSubmit}>
        <label>
          아이디: <input name="username" type="text"/>
        </label>{" "}
        <label>
          비밀번호: <input name="password" type="password"/>
        </label>{" "}
        <button type="submit">로그인</button>

      </form>
    </div>);
}



function SignUp() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";  
  
  function handleSubmit(event) {
        event.preventDefault();
        let formData = new FormData(event.currentTarget);
        let username = formData.get("username");
        let password = formData.get("password");
        let email = formData.get("email");

        auth.signup(username, password, email,function () {
            navigate(from, { replace: true });
        });
    }
    return (<div>
      <p>로그인이 필요합니다. 접속경로 :  {from}</p>
      
      <form onSubmit={handleSubmit}>
        <label>
          아이디: <input name="username" type="text"/>
        </label>{" "}
        <label>
          비밀번호: <input name="password" type="password"/>
        </label>{" "}
        <label>
          이메일: <input name="email" type="text"/>
        </label>{" "}
        <button type="submit">회원가입</button>

      </form>
    </div>);
}




function ConfirmSignUp() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";  
  
  function handleSubmit(event) {
        event.preventDefault();
        let formData = new FormData(event.currentTarget);
        let code = formData.get("code");
        let username = auth.username;
        auth.confirmSignUp(username, code,function () {
            navigate(from, { replace: true });
        });
    }
    return (<div>
      <p>인증이 필요합니다. 접속경로 :  {from}</p>

      <form onSubmit={handleSubmit}>
        <label>
          인증코드: <input name="code" type="text"/>
        </label>{" "}
        <button type="submit">인증완료</button>

      </form>
    </div>);
}