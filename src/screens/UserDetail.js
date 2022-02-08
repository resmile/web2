import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const users=[
  {
    id: "1",
    name: "user#1"
  },
  {
    id: "2",
    name: "user#2"
  },
  {
    id: "3",
    name: "user#3"
  }
];


function UserDetail() {
  const {id} = useParams();
  const navigate = useNavigate();

  const user = users.find(user => user.id === id);
  return (
    <>
      <h2>User Detail</h2>
      <dt>id</dt>
      <dd>{user.id}</dd>
      <dt>name</dt>
      <dd>{user.name}</dd>
      <button onClick={() => navigate(-1)}>Back</button>
    </>
  );
}

export default UserDetail;