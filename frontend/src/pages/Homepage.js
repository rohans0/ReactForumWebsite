import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Homepage.css";

// Base URL for API endpoints
const API_BASE_URL = "http://localhost:5000/api";

const HomePage = () => {
  // State to hold the list of posts (threads)
  const [posts, setPosts] = useState([]);
  // State for new post inputs (title and content)
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  // State for handling uploaded files for posts
  const [newFile, setNewFile] = useState(null);
  // User info from Auth0 for identifying the poster
  const { user } = useAuth0();
  // State to manage new replies keyed by thread ID
  const [newReply, setNewReply] = useState({});

  // Fetch all threads with replies when the component loads
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Fetch all threads from the API
        const response = await fetch(`${API_BASE_URL}/threads`);
        const data = await response.json();
        // Ensure replies are always an array, even if there are none
        const postsWithReplies = data.map((post) => ({
          ...post,
          replies: Array.isArray(post.Replies) ? post.Replies : [],
        }));
        setPosts(postsWithReplies); // Update state with fetched posts
      } catch (error) {
        console.error("Error fetching threads:", error); // Log errors
      }
    };
    loadPosts(); // Trigger the fetch function
  }, []);

  // Handle input changes for the new post form
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get input name and value
    setNewPost((prev) => ({ ...prev, [name]: value })); // Update state
  };

  // Handle file upload and create a preview URL
  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setNewFile(URL.createObjectURL(e.target.files[0])); // Generate a URL for the uploaded file
    }
  };

  // Handle new post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (newPost.title && newPost.content) {
      try {
        const response = await fetch(`${API_BASE_URL}/threads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ThreadID: Date.now(), // Temporary unique ID for thread
            U_UserID: user?.sub || "anon", // User ID or anonymous
            Title: newPost.title,
            TextContent: newPost.content,
            Likes: 0, // Initialize likes at 0
            ImageContent: newFile || "", // Include uploaded file if any
          }),
        });
        const createdPost = await response.json();
        setPosts((prev) => [createdPost, ...prev]); // Add new post to the top of the list
        setNewPost({ title: "", content: "" }); // Reset form fields
        setNewFile(null); // Clear uploaded file
        document.getElementById("file-upload").value = null; // Reset file input
      } catch (error) {
        console.error("Error creating post:", error); // Log errors
      }
    }
  };

  // Handle liking a thread
  const handleLike = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/threads/${id}/like`, {
        method: "PATCH",
      });
      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.ThreadID === id ? { ...post, Likes: post.Likes + 1 } : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking thread:", error);
    }
  };

  // Handle reply content change for a specific thread
  const handleReplyChange = (pID, e) => {
    const { value } = e.target; // Get reply content
    setNewReply((prev) => ({ ...prev, [pID]: value })); // Update reply state by thread ID
  };

  // Handle reply submission for a specific thread
  const handleReplySubmit = async (pID, e) => {
    e.preventDefault();
    const replyContent = newReply[pID]; // Get reply content from state
    if (replyContent) {
      try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            T_ThreadID: pID,
            U_UserID: user?.sub || "anon",
            TextContent: replyContent,
            Likes: 0, // Initialize likes at 0
          }),
        });
        const createdReply = await response.json();
        setPosts((prev) =>
          prev.map((post) =>
            post.ThreadID === pID
              ? { ...post, replies: [...post.replies, createdReply] }
              : post
          )
        );
        setNewReply((prev) => ({ ...prev, [pID]: "" })); // Clear reply input
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    }
  };

  // Handle liking a reply within a specific thread
  const handleReplyLike = async (pID, rID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${rID}/like`, {
        method: "PATCH",
      });
      if (response.ok) {
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
      console.error("Error liking reply:", error);
    }
  };

  // Count the number of replies for a thread
  const countComments = (replies) => {
    return Array.isArray(replies) ? replies.length : 0;
  };

  return (
    <div className="homepage">
      <h1>Home</h1>
      {/* Form to create a new post */}
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

      {/* List of posts */}
      <div className="posts">
        {posts
          .sort((a, b) => b.Likes - a.Likes) // Sort posts by likes
          .map((post) => (
            <div key={post.ThreadID} className="post">
              {/* Thread title and link */}
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
              {/* Form to reply to the post */}
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
              {/* Replies section */}
              <div className="replies">
                {post.replies && post.replies.length > 0 ? (
                  post.replies.map((reply) => (
                    <div key={reply.PostID} className="reply">
                      <p>{reply.TextContent}</p>
                      <button
                        onClick={() => handleReplyLike(post.ThreadID, reply.PostID)}
                      >
                        Like ({reply.Likes})
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No replies yet.</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
