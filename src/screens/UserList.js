import React from "react";
import { Link } from "react-router-dom";


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


function UserList() {
  return (
    <>
      <h2>User List</h2>
      <ul>
        {users.map(({ id, name }) => (
          <li key={id}>
            <Link to={`${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default UserList;