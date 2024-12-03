// import mysql from 'mysql2';
// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';

const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); 

// Database connection pool
const db = mysql.createConnection({
  host: 'awseb-e-zhqfdcnx8v-stack-awsebrdsdatabase-kxqm7dfshlbt.c36oooeyur08.us-west-1.rds.amazonaws.com',
  user: 'forumAdmin',
  password: 'forumPass437--',
  database: 'forum_database'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

// Get all threads
app.get('/api/threads', (req, res) => {
  const query = 'SELECT * FROM Thread';
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Create a new thread
app.post('/api/threads', (req, res) => {
  const { U_UserID, Title, TextContent, Likes = 0 } = req.body;
  const query = `INSERT INTO Thread (U_UserID, Title, DateCreated, Likes, TextContent) VALUES (?, ?, CURDATE(), ?, ?)`;
  db.query(query, [U_UserID, Title, Likes, TextContent], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ ThreadID: result.insertId, U_UserID, Title, Likes, TextContent });
  });
});

// Get all posts for a thread
app.get('/api/threads/:threadID/posts', (req, res) => {
  const { threadID } = req.params;
  const query = 'SELECT * FROM Post WHERE T_ThreadID = ?';
  db.query(query, [threadID], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Create a new post
app.post('/api/posts', (req, res) => {
  const { T_ThreadID, U_UserID, TextContent, Likes = 0 } = req.body;
  const query = `INSERT INTO Post (T_ThreadID, U_UserID, Likes, DatePosted, TextContent) VALUES (?, ?, ?, CURDATE(), ?)`;
  db.query(query, [T_ThreadID, U_UserID, Likes, TextContent], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ PostID: result.insertId, T_ThreadID, U_UserID, Likes, TextContent });
  });
});

// Update likes for a thread
app.patch('/api/threads/:threadID/like', (req, res) => {
  const { threadID } = req.params;
  const query = 'UPDATE Thread SET Likes = Likes + 1 WHERE ThreadID = ?';
  db.query(query, [threadID], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('Thread liked successfully');
  });
});

// Update likes for a post
app.patch('/api/posts/:postID/like', (req, res) => {
  const { postID } = req.params;
  const query = 'UPDATE Post SET Likes = Likes + 1 WHERE PostID = ?';
  db.query(query, [postID], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('Post liked successfully');
  });
});

// Get posts for a specific user by username
app.get('/api/user/:username', (req, res) => {
  const username = req.params.username;
  console.log('Searching for user:', username);
  const queryUsr = 'SELECT UserID FROM User WHERE Username = ?';
  db.query(queryUsr, [username], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.length === 0) {
      return res.status(404).send('User not found');
    }

    const userID = result[0].UserID;
    const queryPost = 'SELECT * FROM Post WHERE U_UserID = ?';
    db.query(queryPost, [userID], (err, p_result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(p_result);
    });
  });
});

// Get thread by title
app.get('/api/thread/:Title', (req, res) => {
  const Title = req.params.Title;
  console.log('Searching for thread:', Title);
  const queryThread = 'SELECT * FROM Thread WHERE Title = ?';
  db.query(queryThread, [Title], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(result);
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 3000');
});
