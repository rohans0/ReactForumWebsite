const mysql = require("mysql2/promise");

const testConnection = async () => {
  const db = mysql.createPool({
    host: "awseb-e-zhqfdcnx8v-stack-awsebrdsdatabase-kxqm7dfshlbt.c36oooeyur08.us-west-1.rds.amazonaws.com",
    user: "forumAdmin",
    password: "forumPass437--",
    database: "forum_database",
  });
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("Connection successful:", rows);
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
};

testConnection();
