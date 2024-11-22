import React, { useState } from "react";
import "../styles/Homepage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      const post = {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        likes: 0,
      };
      setPosts((prev) => [post, ...prev]);
      setNewPost({ title: "", content: "" });
    }
  };

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="homepage">
      <h1>Home</h1>

      {/* Post Creation Form */}
      <form onSubmit={handlePostSubmit} className="post-form">
        <input
          type="text"
          name="title"
          placeholder="Enter post title"
          value={newPost.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="content"
          placeholder="Write your post here..."
          value={newPost.content}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Create Post</button>
      </form>

      {/* Post List */}
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleLike(post.id)}>Like ({post.likes})</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
