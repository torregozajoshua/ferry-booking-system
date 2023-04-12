const express = require('express');
const app = express();

const mysql = require('mysql2');

app.listen(5000, () => {
    console.log(`Server started...`);
})

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "user"
});

con.query('SELECT * FROM userinfo LIMIT 5', (err, result) =>{
    if(err) throw err;
    console.log(result);
})