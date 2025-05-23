import mysql from 'mysql2';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

const db = mysql.createConnection({
    host: 'awseb-e-zhqfdcnx8v-stack-awsebrdsdatabase-kxqm7dfshlbt.c36oooeyur08.us-west-1.rds.amazonaws.com',
    user: 'forumAdmin',
    password: 'forumPass437--',
    database: 'forum_database'
})

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});


app.get('/user/:username', (req, res) => {
    const username = req.params.username; 
    console.log('Searching for:', username); 
    const queryUsr = 'SELECT UserID FROM User WHERE Username = ?'; 
    db.query(queryUsr, [username], (err, result) => {
        if (err) { 
            console.error('Error querying user:', err); return res.status(500).send(err); 
        } 
        if (result.length === 0) { console.log('User not found'); return res.status(404).send('User not found'); 

        } 
        const userID = result[0].UserID; console.log('UserID:', userID);
        const queryThreads = 'SELECT * FROM Thread WHERE U_UserID = ?';
        db.query(queryThreads, [userID], (err, t_result) => {
            if (err) { console.error('Error querying threads:', err); return res.status(500).send(err); } console.log('Threads:', t_result); res.send(t_result);

            app.get('/thread/:Title', (req, res) => {
                const Title = req.params.Title;
                console.log('Searching for:', Title);
                const queryThread = 'SELECT * FROM Thread WHERE Title = ?';
                db.query(queryThread, [Title], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.send(result);
                });
            });
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
