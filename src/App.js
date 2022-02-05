import React, { useState, useEffect } from 'react';
import Amplify, {API} from 'aws-amplify'
import config from './aws-exports'
import { listPost2s } from './graphql/queries'

Amplify.configure(config)


export default function App() {
  const [posts, setPosts] = useState([])
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
    <div>
      <h1>Hello World</h1>
      {
        posts.map(post => (
          <div key={post.id}>
            <h3>{post.name}</h3>
            <p>{post.location}</p>
          </div>
        ))
      }
    </div>
  )
}