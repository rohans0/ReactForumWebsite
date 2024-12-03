import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Homepage.css";

// Backend API URL for your server
const API_BASE_URL = "http://localhost:5000/api"; // Update with your backend URL if different

const HomePage = () => {
  // State hooks to manage posts, new post data, file upload, and replies
  const [posts, setPosts] = useState([]); // Holds the posts fetched from the backend
  const [newPost, setNewPost] = useState({ title: "", content: "" }); // New post form data
  const [newFile, setNewFile] = useState(null); // Holds the file URL if a file is uploaded
  const { user } = useAuth0(); // Auth0 user object for authentication
  const [newReply, setNewReply] = useState({}); // Holds the new reply content for each post

  // `useEffect` hook to load posts when the component is mounted
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Fetch the threads (posts) from the backend
        const response = await fetch(`${API_BASE_URL}/threads`);
        const data = await response.json();

        // Ensure that each post has a `replies` array, even if it's empty
        const postsWithReplies = data.map((post) => ({
          ...post,
          replies: Array.isArray(post.replies) ? post.replies : [],
        }));

        setPosts(postsWithReplies); // Set the fetched posts with their replies
      } catch (error) {
        console.error("Error fetching threads:", error); // Error handling if fetching fails
      }
    };

    loadPosts(); // Trigger the loading of posts
  }, []); // Empty array means this runs only once when the component mounts

  // Handles the change in the new post form (title/content)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  // Handles file upload (if a file is attached to the post)
  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setNewFile(URL.createObjectURL(e.target.files[0])); // Converts the file to a local URL
    }
  };

  // Submits a new post to the backend
  const handlePostSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission
    if (newPost.title && newPost.content) {
      try {
        // Sending the new post data to the backend via a POST request
        const response = await fetch(`${API_BASE_URL}/threads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            U_UserID: user?.sub || "anon", // Use user ID from Auth0 or "anon" for anonymous posts
            Title: newPost.title,
            TextContent: newPost.content,
            Likes: 0, // Initialize likes to 0
            ImageContent: newFile || null, // Attach file if present
          }),
        });
        const createdPost = await response.json(); // Response from the server with the created post

        // Update the posts state with the newly created post
        setPosts((prev) => [createdPost, ...prev]);

        // Clear the form data after post submission
        setNewPost({ title: "", content: "" });
        setNewFile(null);
        document.getElementById("file-upload").value = null; // Reset the file input
      } catch (error) {
        console.error("Error creating post:", error); // Error handling if creating the post fails
      }
    }
  };

  // Increments the like count for a specific post
  const handleLike = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/threads/${id}/like`, {
        method: "PATCH", // PATCH request to update the like count
      });
      if (response.ok) {
        // Update the posts state with the new like count
        setPosts((prev) =>
          prev.map((post) =>
            post.ThreadID === id ? { ...post, Likes: post.Likes + 1 } : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking thread:", error); // Error handling if liking the post fails
    }
  };

  // Handles change in reply input for a specific post
  const handleReplyChange = (pID, e) => {
    const { value } = e.target;
    setNewReply((prev) => ({ ...prev, [pID]: value })); // Store reply content by post ID
  };

  // Submits a new reply for a specific post
  const handleReplySubmit = async (pID, e) => {
    e.preventDefault();
    const replyContent = newReply[pID]; // Get the reply content for the specific post
    if (replyContent) {
      const reply = {
        content: replyContent,
        likes: 0, // Initialize likes for the reply
      };

      try {
        // Sending the new reply to the backend via a POST request
        const response = await fetch(`${API_BASE_URL}/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            T_ThreadID: pID, // Thread ID to associate the reply with the post
            U_UserID: user?.sub || "anon", // Use user ID or "anon" for anonymous replies
            TextContent: reply.content,
            Likes: 0, // Initialize likes for the reply
          }),
        });
        const createdReply = await response.json(); // Get the newly created reply

        // Add the new reply to the post's replies array
        setPosts((prev) =>
          prev.map((post) =>
            post.ThreadID === pID
              ? { ...post, replies: [...post.replies, createdReply] }
              : post
          )
        );

        // Clear the reply input after submission
        setNewReply((prev) => ({ ...prev, [pID]: "" }));
      } catch (error) {
        console.error("Error submitting reply:", error); // Error handling if replying fails
      }
    }
  };

  // Increments the like count for a specific reply
  const handleReplyLike = async (pID, rID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${rID}/like`, {
        method: "PATCH", // PATCH request to update the reply's like count
      });
      if (response.ok) {
        // Update the posts state with the new like count for the specific reply
        setPosts((prev) =>
          prev.map((post) =>
            post.ThreadID === pID
              ? {
                  ...post,
                  replies: post.replies.map((reply) =>
                    reply.PostID === rID
                      ? { ...reply, Likes: reply.Likes + 1 }
                      : reply
                  ),
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking reply:", error); // Error handling if liking the reply fails
    }
  };

  // Helper function to count the number of replies for a post
  const countComments = (replies) => {
    return Array.isArray(replies) ? replies.length : 0; // Return the number of replies
  };

  return (
    <div className="homepage">
      <h1>Home</h1>

      {/* Post Creation Form */}
      <form onSubmit={handlePostSubmit} className="post-form">
        <h6>{user ? user.name : "Anon"}</h6>
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
        <input
          type="file"
          name="file-upload"
          id="file-upload"
          onChange={handleFileUpload}
        />
        <button type="submit">Create Post</button>
      </form>

      {/* Post List */}
      <div className="posts">
        {posts
          .sort((a, b) => b.Likes - a.Likes) // Sorting posts by likes in descending order
          .map((post) => (
            <div key={post.ThreadID} className="post">
              <nav>
                <Link to={`/thread/${post.ThreadID}`} state={post}>
                  {post.Title}
                </Link>
              </nav>
              <h6>{user?.name || "Anon"}</h6>
              <p>{post.TextContent}</p>
              {post.ImageContent && (
                <img
                  src={post.ImageContent}
                  alt="Post Attachment"
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              )}
              <div className="post-actions">
                <button onClick={() => handleLike(post.ThreadID)}>
                  👍 Likes ({post.Likes})
                </button>
                <a
                  href={`#post-${post.ThreadID}-comments`}
                  className="comment-counter"
                  title="View Comments"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 2H4a2 2 0 00-2 2v16l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm0 12H6.83L4 16.83V4h16v10z" />
                  </svg>
                  {countComments(post.replies)}
                </a>
              </div>
              <form
                onSubmit={(e) => handleReplySubmit(post.ThreadID, e)}
                className="reply-form"
              >
                <textarea
                  name="reply-content"
                  placeholder="Write your Reply..."
                  value={newReply[post.ThreadID] || ""}
                  onChange={(e) => handleReplyChange(post.ThreadID, e)}
                  required
                ></textarea>
                <button type="submit">Reply</button>
              </form>
              <div className="replies">
                {(post.replies || []).map((reply) => (
                  <div key={reply.PostID} className="reply">
                    <p>{reply.TextContent}</p>
                    <button onClick={() => handleReplyLike(post.ThreadID, reply.PostID)}>
                      Like ({reply.Likes})
                    </button>
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
