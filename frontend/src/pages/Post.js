import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Homepage.css";

export const Post = () => {
    const data = useLocation();
    const gottenPost = data.state || {};
    const [post, setPost] = useState(gottenPost);
    const [reply, setReply] = useState([]);

    console.log(gottenPost);

    const handleReplyChange = (e) => {
        setReply(e.target.value)
    }

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (reply) {
            const currentReply = {
                id: Date.now(),
                content: reply,
                likes: 0
            };

            
            setPost((prev) => {
                const currentReplies = [ ...prev.replies, currentReply ];
                return { ...prev, replies: currentReplies };
            });
        }
        setReply("");
    }

    const handleReplyLike = (rID) => {
        setPost((post) => {
            const arrayOfReplies = [...post.replies];
            for (let j = 0; j < arrayOfReplies.length; j++) {
                const reply = arrayOfReplies[j];
                if (reply.id === rID) {
                    reply.likes = reply.likes + 1;
                }
            }
            /* Use spread operator (assigning normal does not work) */
            return { ...post, replies: arrayOfReplies };
        })
    }

    const handleLike = () => {
        setPost({ ...post, likes: post.likes + 1 });
    };



    return (
        <div className="post">
            <h1>The route is working!</h1>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {/* Figure out how to dynamically edit width and height */}
            {post.file !== "" ? <img src={post.file || ""} alt="" width="500px" height="500px"></img> : <></>}
            <button onClick={handleLike}>Like ({post.likes})</button>
            <form onSubmit={(e) => handleReplySubmit(e)} className="reply-form">
              <textarea name="reply-content" placeholder="Write your Reply..." value={reply || ""} onChange={(e) => handleReplyChange(e)} required></textarea>
              <button type="submit">Create Reply</button>
            </form>
            <div className="replies">
                {post.replies.map((reply) => (
                    <div key={reply.id} className="reply">
                        <p>{reply.content}</p>
                        <button onClick={() => handleReplyLike(reply.id)}>Like ({reply.likes})</button>
                    </div>
                ))}
            </div>
        </div>
    )
}