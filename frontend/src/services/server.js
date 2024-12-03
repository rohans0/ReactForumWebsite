// Import required modules for server setup
const mysql = require('mysql2'); // MySQL client for Node.js
const express = require('express'); // Framework for building web applications
const bodyParser = require('body-parser'); // Middleware for parsing JSON request bodies
const cors = require('cors'); // Middleware for enabling Cross-Origin Resource Sharing (CORS)

// Initialize Express app
const app = express();
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all routes

// Create MySQL database connection
const db = mysql.createConnection({
  host: 'awseb-e-zhqfdcnx8v-stack-awsebrdsdatabase-kxqm7dfshlbt.c36oooeyur08.us-west-1.rds.amazonaws.com', // Database host
  user: 'forumAdmin', // Database username
  password: 'forumPass437--', // Database password
  database: 'forum_database' // Database name
});

// Connect to the database and handle errors
db.connect((err) => {
  if (err) {
    throw err; // Throw error if connection fails
  }
  console.log('Connected to database'); // Log successful connection
});

// Endpoint: Retrieve all threads with associated replies
app.get('/api/threads', (req, res) => {
  const query = `
    SELECT 
      t.ThreadID, 
      t.U_UserID AS ThreadOwnerID, 
      u.Username AS ThreadOwner, 
      t.Title, 
      t.DateCreated, 
      t.Likes, 
      t.TextContent, 
      t.ImageContent, 
      t.VideoContent,
      IFNULL(
        JSON_ARRAYAGG(
          CASE 
            WHEN p.PostID IS NOT NULL THEN JSON_OBJECT(
              'PostID', p.PostID,
              'T_ThreadID', p.T_ThreadID,
              'U_UserID', p.U_UserID,
              'Username', pu.Username,
              'TextContent', p.TextContent,
              'Likes', p.Likes,
              'DatePosted', p.DatePosted,
              'ImageContent', p.ImageContent,
              'VideoContent', p.VideoContent
            ) 
            ELSE NULL 
          END
        ),
        JSON_ARRAY()
      ) AS Replies
    FROM Thread t
    LEFT JOIN Post p ON t.ThreadID = p.T_ThreadID
    LEFT JOIN User u ON t.U_UserID = u.UserID
    LEFT JOIN User pu ON p.U_UserID = pu.UserID
    GROUP BY t.ThreadID;
  `;
  // Execute the query and handle the response
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err); // Handle query errors
    }
    // Filter out null replies and send the response
    res.json(result.map(thread => ({ ...thread, Replies: thread.Replies.filter(r => r !== null) })));
  });
});

// Endpoint: Create a new thread
app.post('/api/threads', (req, res) => {
  const { U_UserID, Title, ImageContent, TextContent, Likes = 0 } = req.body;
  const query = `INSERT INTO Thread (ThreadID, U_UserID, Title, DateCreated, Likes, TextContent, ImageContent) VALUES (?, ?, ?, CURDATE(), ?, ?, ?)`;
  db.query(query, [null, U_UserID, Title, Likes, TextContent, ImageContent], (err, result) => {
    if (err) {
      return res.status(500).send(err); // Handle errors during insertion
    }
    // Respond with the created thread details
    res.json({ ThreadID: result.insertId, U_UserID, Title, Likes, TextContent, ImageContent });
  });
});

// Endpoint: Get all posts for a specific thread
app.get('/api/threads/:threadID/posts', (req, res) => {
  const { threadID } = req.params;
  const query = 'SELECT * FROM Post WHERE T_ThreadID = ?';
  db.query(query, [threadID], (err, result) => {
    if (err) {
      return res.status(500).send(err); // Handle query errors
    }
    res.json(result); // Return the posts
  });
});

// Endpoint: Create a new post in a thread
app.post('/api/posts', (req, res) => {
  const { T_ThreadID, U_UserID, TextContent, Likes = 0 } = req.body;
  const query = `INSERT INTO Post (T_ThreadID, U_UserID, Likes, DatePosted, TextContent) VALUES (?, ?, ?, CURDATE(), ?)`;
  db.query(query, [T_ThreadID, U_UserID, Likes, TextContent], (err, result) => {
    if (err) {
      return res.status(500).send(err); // Handle errors during insertion
    }
    res.json({ PostID: result.insertId, T_ThreadID, U_UserID, Likes, TextContent }); // Respond with new post details
  });
});

// Endpoint: Update likes for a thread
app.patch('/api/threads/:threadID/like', (req, res) => {
  const { threadID } = req.params;
  const query = 'UPDATE Thread SET Likes = Likes + 1 WHERE ThreadID = ?';
  db.query(query, [threadID], (err) => {
    if (err) {
      return res.status(500).send(err); // Handle update errors
    }
    res.send('Thread liked successfully'); // Confirm success
  });
});

// Endpoint: Update likes for a post
app.patch('/api/posts/:postID/like', (req, res) => {
  const { postID } = req.params;
  const query = 'UPDATE Post SET Likes = Likes + 1 WHERE PostID = ?';
  db.query(query, [postID], (err) => {
    if (err) {
      return res.status(500).send(err); // Handle update errors
    }
    res.send('Post liked successfully'); // Confirm success
  });
});

// Endpoint: Get all posts by a specific user
app.get('/api/user/:username', (req, res) => {
  const username = req.params.username;
  const queryUsr = 'SELECT UserID FROM User WHERE Username = ?';
  db.query(queryUsr, [username], (err, result) => {
    if (err) {
      return res.status(500).send(err); // Handle errors during user search
    }
    if (result.length === 0) {
      return res.status(404).send('User not found'); // Handle user not found
    }
    const userID = result[0].UserID;
    const queryPost = 'SELECT * FROM Post WHERE U_UserID = ?';
    db.query(queryPost, [userID], (err, p_result) => {
      if (err) {
        return res.status(500).send(err); // Handle errors during post retrieval
      }
      res.json(p_result); // Return user's posts
    });
  });
});

// Endpoint: Get thread by title
app.get('/api/thread/:Title', (req, res) => {
  const Title = req.params.Title;
  const queryThread = 'SELECT * FROM Thread WHERE Title = ?';
  db.query(queryThread, [Title], (err, result) => {
    if (err) {
      return res.status(500).send(err); // Handle errors during thread search
    }
    res.json(result); // Return the thread details
  });
});

// Endpoint: Get thread by ID (along with associated replies)
app.get('/api/threads/:threadID', (req, res) => {
  const { threadID } = req.params;
  const query = `
    SELECT 
      t.ThreadID, 
      t.U_UserID AS ThreadOwnerID, 
      u.Username AS ThreadOwner, 
      t.Title, 
      t.DateCreated, 
      t.Likes, 
      t.TextContent, 
      t.ImageContent, 
      t.VideoContent,
      IFNULL(
        JSON_ARRAYAGG(
          CASE 
            WHEN p.PostID IS NOT NULL THEN JSON_OBJECT(
              'PostID', p.PostID,
              'T_ThreadID', p.T_ThreadID,
              'U_UserID', p.U_UserID,
              'Username', pu.Username,
              'TextContent', p.TextContent,
              'Likes', p.Likes,
              'DatePosted', p.DatePosted,
              'ImageContent', p.ImageContent,
              'VideoContent', p.VideoContent
            ) 
            ELSE NULL 
          END
        ),
        JSON_ARRAY()
      ) AS Replies
    FROM Thread t
    LEFT JOIN Post p ON t.ThreadID = p.T_ThreadID
    LEFT JOIN User u ON t.U_UserID = u.UserID
    LEFT JOIN User pu ON p.U_UserID = pu.UserID
    WHERE t.ThreadID = ?
    GROUP BY t.ThreadID;
  `;
  db.query(query, [threadID], (err, result) => {
    if (err) {
      return res.status(500).send(err); // Handle query errors
    }
    if (result.length === 0) {
      return res.status(404).send('Thread not found'); // Handle case when thread is not found
    }
    // Filter out null replies and send the response
    res.json(result[0]);
  });
});


// Start the server on port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
