import mysql from "mysql2/promise"

export const connectDB = async () => await mysql.createConnection({
    host : "localhost",
    user : "root",
    password : process.env.MYSQL_PASSWORD,
    // database : "",
}).then(
    console.log("Connected to MySQL server."),
).catch((error) => {
    console.log(`Can't able to connect to MySQL server.\nError : ${error}`);
})