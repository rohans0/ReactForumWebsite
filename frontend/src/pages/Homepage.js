import React, { useState } from "react";
import "../styles/Homepage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" , file: "" });
  const [newReply, setNewReply] = useState([]);
  const [newFile, setNewFile] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length !== 0) {
      setNewFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  /* pID = ID of parent post */
  const handleReplyChange = (pID, e) => {
    const content = e.target.value;
    /* Modeled after handleInputChange */
    /* Setting the 'name' as the post_ID helps with connecting reply and post */
    setNewReply((prev) => ({...prev, [pID]: content}));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
        const post = {
          id: Date.now(),
          title: newPost.title,
          content: newPost.content,
          likes: 0,
          file: newFile || "",
          replies: []
        };
        setPosts((prev) => [post, ...prev]);
        setNewPost({ title: "", content: "", file: "" });
        setNewFile(null);
    }
  };

  const handleReplySubmit = (pID, e) => {
    e.preventDefault();
    if (newReply[pID]) {
      const reply = {
        id: Date.now(),
        content: newReply[pID],
        likes: 0
      };
      
      setPosts((prev) => {
        return prev.map((post) => {
          if (post.id === pID) {
            return {...post, replies: [...post.replies, reply]}
          } else {
            return post;
          }
        })
      })

      // setPosts((prev) => {
      //   prev.map((post) =>
          
      //     //post.id === pID ? {...post, replies: [...post.replies, reply]} : post
      //   }) 
      // });

      setNewReply((prev) => ({ ...prev, [pID]: "" }));
    }
  };

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1} : post
      ),
      handleLikeChange()
    )
  };

  const handleLikeChange = () => {
    posts.sort((a, b) => b.likes - a.likes);
  };

  /* BIG NOTE: For some reason when you click like for a reply
    handleReplyLike activates twice. idk how to really fix rn, but
    this is a current solution */
  const handleReplyLike = (pID, rID) => {
    setPosts((prev) => {
      const arrayOfPosts = [...prev];
      for (let i = 0; i < arrayOfPosts.length; i++) {
        const post = arrayOfPosts[i];
        if (post.id === pID) {
          const arrayOfReplies = [...post.replies];
          for (let j = 0; j < arrayOfReplies.length; j++) {
            const reply = arrayOfReplies[j];
            if (reply.id === rID) {
              reply.likes = reply.likes + 0.5;
            }
          }
        }
      }
      return arrayOfPosts;
    });
  }

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
        <input type="file" name="file-upload" onChange={handleFileUpload}></input>
        <button type="submit">Create Post</button>
      </form>

      {/* Post List */}
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {/* Figure out how to dynamically edit width and height */}
            <img src={post.file} alt="" width="500px" height="500px"></img>
            <button onClick={() => handleLike(post.id)}>Likes ({post.likes})</button>
            <form onSubmit={(e) => handleReplySubmit(post.id, e)} className="reply-form">
              <textarea name="reply-content" placeholder="Write your Reply..." value={newReply[post.id] || ""} onChange={(e) => handleReplyChange(post.id, e)} required></textarea>
              <button type="submit">Create Reply</button>
            </form>
            <div className="replies">
              {post.replies.map((reply) => ( 
                <div key={reply.id} className="reply">
                  <p>{reply.content}</p>
                  <button onClick={() => handleReplyLike(post.id, reply.id)}>Like ({reply.likes})</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
