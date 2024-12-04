import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Post.css";

// Base URL for API endpoints
const API_BASE_URL = "http://localhost:5000/api";

export const Post = () => {
  const { id } = useParams(); // Fetch the thread ID from the URL
  const [post, setPost] = useState(null);
  const [newReply, setNewReply] = useState(""); // State for the reply input
  const { user } = useAuth0(); // User info from Auth0

  // Fetch the post and replies when the component mounts
  useEffect(() => {
    const loadPost = async () => {
      try {
        // Fetch the thread by its ID
        const response = await fetch(`${API_BASE_URL}/threads/${id}`);
        const data = await response.json();
        // Ensure replies are always an array
        if (Array.isArray(data.Replies)) {
            data.Replies = data.Replies.filter((reply) => reply !== null); // Remove null values
          }
          setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error); // Log errors
      }
    };
    loadPost(); // Fetch the post and replies
  }, [id]);

  // Handle the reply input change
  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  // Handle the reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (newReply) {
      try {
        // Create a new reply
        const response = await fetch(`${API_BASE_URL}/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            T_ThreadID: id,
            U_UserID: user ? user.sub : null,
						Username: user ? user.name : "Anon", // TODO: UNUSED ATM
            TextContent: newReply,
            Likes: 0, // Initialize likes at 0
          }),
        });
        const createdReply = await response.json();
        
        // Add the new reply to the post's replies
        setPost((prevPost) => ({
          ...prevPost,
          Replies: [...prevPost.Replies, createdReply],
        }));

        setNewReply(""); // Clear the reply input after submission
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    }
  };

  // Handle liking a reply
  const handleReplyLike = async (rID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${rID}/like`, {
        method: "PATCH",
      });
      if (response.ok) {
        setPost((prevPost) => ({
          ...prevPost,
          Replies: prevPost.Replies.map((reply) =>
            reply.PostID === rID
              ? { ...reply, Likes: reply.Likes + 1 }
              : reply
          ),
        }));
      }
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  // Handle liking the post itself
  const handleLike = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/threads/${id}/like`, {
        method: "PATCH",
      });
      if (response.ok) {
        setPost((prevPost) => ({ ...prevPost, Likes: prevPost.Likes + 1 }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post">
			<div className="post-profile">
				{/*<img src={user.picture} id="pfp"/> TODO: pfp*/}
				<h6>{post.User ? post.User : "Anon"}</h6>
			</div>
      <h1>{post.Title}</h1>
      <p>{post.TextContent}</p>
      {post.ImageContent && (
        <img
          src={post.ImageContent}
          alt="Thread"
          width="500px"
          height="500px"
        />
      )}
      <button onClick={handleLike}>Like ({post.Likes})</button>

      {/* Reply Form */}
      <form onSubmit={handleReplySubmit} className="reply-form">
        <textarea
          name="reply-content"
          placeholder="Write your Reply..."
          value={newReply}
          onChange={handleReplyChange}
          required
        ></textarea>
        <button type="submit">Create Reply</button>
      </form>

      {/* Replies Section */}
      <div className="replies">
        {post.Replies.length > 0 ? (
          post.Replies.map((reply) => (
            <div key={reply.PostID} className="reply">
              <p>{reply.TextContent}</p>
              <button onClick={() => handleReplyLike(reply.PostID)}>
                Like ({reply.Likes})
              </button>
            </div>
          ))
        ) : (
          <p>No replies yet</p>
        )}
      </div>
    </div>
  );
};
