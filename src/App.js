import React, { useState, useEffect, useRef } from 'react';
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
import { GridApi, ColumnApi } from 'ag-grid-community';


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



const App = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [btndisabled, setBtnDisabled] = useState(true);
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => params.api.setRowData(data);

    fetchPosts();
   
    updateData(rowData);
  };

  const onSelectionChanged = () => {
    const data = gridApi.getSelectedRows();

    if (data.length > 0) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
    setSelectedRows(gridApi.getSelectedRows());
  };

  const onCellValueChanged = (e) => {
    console.log("changed", e.data);
  };

  async function fetchPosts() {
    try {
      const postData = await API.graphql({ query: listPost2s });
      setRowData(postData.data.listPost2s.items); // result: { "data": { "listPost2s": { "items": [/* ..... */] } } }
    } catch (err) {
      console.log({ err })
    }
  }

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <div
          id="myGrid"
          style={{
            height: "600px",
            width: "100%",
          }}
          className="ag-theme-alpine"
        >
          <h1>editable table</h1>
          <div>
            <button variant="contained" disabled={btndisabled}>
              action1
            </button>
            <button variant="contained" disabled={btndisabled}>
              action1
            </button>
            <button variant="contained" disabled={btndisabled}>
              action1
            </button>
          </div>
          <AgGridReact
            rowData={rowData}
            rowSelection={"multiple"}
            suppressRowClickSelection={false}
            defaultColDef={{
              editable: true,
              sortable: true,
              minWidth: 100,
              filter: true,
              resizable: true,
              floatingFilter: true,
              flex: 1,
            }}
            sideBar={{
              toolPanels: ["columns", "filters"],
              defaultToolPanel: "",
            }}
            onGridReady={onGridReady}
            onSelectionChanged={onSelectionChanged}
            onCellEditingStopped={(e) => {
              onCellValueChanged(e);
            }}
          >
            <AgGridColumn
              headerName="..HELLO."
              headerCheckboxSelection={true}
              checkboxSelection={true}
              floatingFilter={false}
              suppressMenu={true}
              minWidth={50}
              maxWidth={50}
              width={50}
              flex={0}
              resizable={false}
              sortable={false}
              editable={false}
              filter={false}
              suppressColumnsToolPanel={true}
            />
            <AgGridColumn headerName="aaaaa">
              <AgGridColumn field="name" minWidth={170} />
            </AgGridColumn>
            <AgGridColumn headerName="bbbbbb">
              <AgGridColumn
                field="description"
                columnGroupShow="closed"
                filter="agNumberColumnFilter"
                width={120}
                flex={0}
              />
              <AgGridColumn
                field="location"
                columnGroupShow="closed"
                filter="agNumberColumnFilter"
                width={100}
                flex={0}
              />
            </AgGridColumn>
          </AgGridReact>
        </div>
      </div>
    </>
  );
};

export default App;