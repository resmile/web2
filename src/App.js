import React, { useState, useEffect } from 'react';
import Amplify, {API, graphqlOperation, I18n} from 'aws-amplify'
import config from './aws-exports'
import { listPost2s } from './graphql/queries'
//import { AmplifyProvider, AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import {onCreatePost2, onUpdatePost2} from './graphql/subscriptions';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';


import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


I18n.setLanguage('kr');
I18n.putVocabulariesForLanguage('kr', {
  'Sign In': '로그인',
  'Sign in': '로그인',
  'Signing in': '로그인 중입니다.',
  'Forgot your password?':'비밀번호를 잊어버렸나요?',
  'Reset your password':'비밀번호 찾기',
  'Change Password':'비밀번호 변경',
  'Enter your username' : '아이디를 입력해주세요.',
  'Code':'인증번호 입력',
  'Account recovery requires verified contact information':'본 계정은 본인 인증 확인이 필요합니다.',
  'Incorrect username or password.' : '아이디 또는 비밀번호가 올바르지 않습니다.',
  'Invalid verification code provided, please try again.' : '올바르지 않은 인증번호입니다. 다시 입력해 주세요.',
  'Attempt limit exceeded, please try after some time.':'인증요청 수를 초과하였습니다. 잠시 후 다시 이용해주세요.',
  'User does not exist.' : '존재하지 않는 아이디 입니다.',
  'Verify':'인증번호 전송',
  'Verifying..':'인증번호를 전송 중입니다.',
  'Skip':'다음에 하기',
  'New password' : '새 비밀번호 입력',
  'Submit' : '인증하기',
  'Submiting..':'인증 중입니다.',
  'Resend Code':'비밀번호 재전송',
  'Send code':'비밀번호 전송',
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
  const rowData = [
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxter", price: 72000}
  ];

  useEffect(() => {
    fetchPosts();

    const subscription = API.graphql(graphqlOperation(onUpdatePost2))
    .subscribe({
      next: ({value})=>{
        const post=value.data.onUpdatePost2;
        console.log("new post->",post);
        fetchPosts();
      },
      error: error => console.warn(error)
    })
    return () => {subscription.unsubscribe()}
    

  }, []);
  async function fetchPosts() {
    try {
      const postData = await API.graphql({ query: listPost2s });
      setPosts(postData.data.listPost2s.items); // result: { "data": { "listPost2s": { "items": [/* ..... */] } } }
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
<div className="ag-theme-alpine" style={{height: 400, width: 600}}>
           <AgGridReact
               rowData={posts}>
               <AgGridColumn field="name" sortable={true} filter={true}></AgGridColumn>
               <AgGridColumn field="description"></AgGridColumn>
               <AgGridColumn field="location"></AgGridColumn>
           </AgGridReact>
       </div>
</div>
    )}
  </Authenticator>
  )
}

/*
    
*/