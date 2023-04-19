const express = require('express');
const app = express();

//set view engine
app.set('view engine', 'ejs');

//use middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended : true }));

//express app
app.listen(5000, () => {
    console.log(`Server started...`);
})

//db setup and connections
const mysql = require('mysql2');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "user"
});

//get login
app.get('/login', (req, res) => {
    res.render('login');
})

//login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username !== '' || username !== ''){
        con.query('SELECT username, password, firstName, lastName FROM userinfo', (err,result) => {
            if(err) throw err;
    
            let errors = [];
    
            const user = result.find((user) => {
                return user.username === username;
            });
    
            if(user === null || user === undefined || user.password !== password){
                errors.push('Incorrect username or password...');
            }
            if(errors.length > 0){
                res.render('login', {errors, username});
            }
            else{
                res.render('home', {user : result[0].firstName +' '+ result[0].lastName})
                console.log(result[0].firstName);
            }  
            
        });
    }    
    console.log(req.body);
})

//get create new user page
app.get('/user/new', (req, res) => {
    res.render('signup');
})

//create new user
app.post('/user/new', (req,res) => {
    // console.log(req.body);
    const username = req.body.username;    
    const password = req.body.password;    
    const password2 = req.body.password2;    
    const firstName = req.body.firstName;    
    const lastName = req.body.lastName;  
    const email = req.body.email; 

    let errors = []
    
    con.query('SELECT email from userinfo', (err, result) => {
        if(err) throw err;
        const findEmail = result.find(email =>  email.email === email);
        if( findEmail === null || findEmail === undefined){
            errors.push('Email already in use!');
        }
        if(password !== password2){
            errors.push('Password does not match!');
        }
        if(password.length < 8){
            errors.push('Password should be at least 8 characters!');
        }
        if(errors.length > 0){
            res.render('signup', {errors, username, firstName, lastName, email});
        }
        else{
            con.query('INSERT INTO userinfo (username, password, firstName, lastName, email) VALUES (?, ?, ?, ?, ?)', [username, password, firstName, lastName, email], (err) => {
                if(err) throw err;
                res.send(`INSERT successful!`);
            })
        }    
    })
})

app.use((req, res) => {
    res.status(404).send('ERROR 404!')
})
