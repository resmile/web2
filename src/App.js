import React, { useState, useEffect } from 'react';
import Amplify, {API, I18n} from 'aws-amplify'
import config from './aws-exports'
import { listPost2s } from './graphql/queries'
//import { AmplifyProvider, AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
I18n.setLanguage('kr');
I18n.putVocabulariesForLanguage('kr', {
  'Sign In': '로그인',
  'Sign in': '로그인',
  'Forgot your password?':'비밀번호를 잊어버렸나요?',
  'Reset your password':'비밀번호 찾기',
  'Enter your usename' : '아이디를 입력해주세요.',
  'Send code':'인증번호 전송',
  'Back to Sign In':'로그인하기',
  'Create Account' : '회원가입',
  'Username' : '아이디',
  'Password' : '비밀번호',
  'Confirm Password' : '비밀번호 재입력',
  'Email' : '이메일',
  'Phone Number' : "핸드폰 번호",
  'Name' : "담당자명"

});
Amplify.configure(config);





export default function App() {
  const signUpConfig = {
    defaultCountryCode: '82',
    signUpFields: [
      {
        label: 'My custom email label',
        key: 'username',
        required: true,
        displayOrder: 1,
        type: 'string'
      },
    ]
  };
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);
  async function fetchPosts() {
    try {
      const postData = await API.graphql({ query: listPost2s });
      setPosts(postData.data.listPost2s.items)
    } catch (err) {
      console.log({ err })
    }
  }
  return (
    <Authenticator
    signUpConfig={signUpConfig}
    signUpAttributes={[
      'email',
      'name',
      'phone_number',
    ]}>
    {({ signOut, user }) => (

<div>
<h1>Hello {user.username}</h1>
<button onClick={signOut}>Sign out</button>

{
  posts.map(post => (
    <div key={post.id}>
      <h3>{post.name}</h3>
      <p>{post.location}</p>
    </div>
  ))
}
</div>
    )}
  </Authenticator>
  )
}

/*
    
*/