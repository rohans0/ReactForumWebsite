const mysql = require('mysql2');

const databaseConfig = {
    host: 'awseb-e-zhqfdcnx8v-stack-awsebrdsdatabase-kxqm7dfshlbt.c36oooeyur08.us-west-1.rds.amazonaws.com',
    user: 'forumAdmin',
    password: 'forumPass437--',
    database: 'forum_database',
    port: 3306 
};

const connection = mysql.createConnection(databaseConfig);

connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err.stack);
        return;
    }
    console.log('Connected successfully to the database.');
    connection.end();
});
