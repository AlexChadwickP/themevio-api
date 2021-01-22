/** MODULE IMPORTS */
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Create our express application
const app = express();

// Tells express to use our body parser middleware to handle POST requests more easily
// We call bodyParsers json() method so we get the body as an object as opposed to getting it
// as a string.
app.use(bodyParser.json());

// Set bodyParsers extended urlencoding to false
app.use(bodyParser.urlencoded({ extended: false }));

// Creates SQL connection
// TODO: Update connection with hosting parameters
let connection = mysql.createConnection({
    host     : 'localhost',
    database : 'themevio',
    port     : '3306',
    user     : 'themevioadmin',
    password : 'password'
});

// Connect to our connection (seems weird to write, but it makes sense I guess)
connection.connect();

// Handles get request at '/'
app.get('/', (req, res) => {
    res.send("Working!");
});

// Handles request at '/users'
app.get('/users', (req, res) => {
    // Queries our MariaDB MySQL database
    connection.query('SELECT * FROM users', (err, rows, fields) => {
        // If there's an error querying the database, it will throw the error
        if (err) throw err;
        // If there are no errors, then we will send a response containing all the rows from the result
        res.send(rows);
    });
});

// Handles post request at '/submit_user'
app.post('/submit_user', (req, res) => {
    // Assigns all parameters to variables to use later
    let username = req.body.user;
    let password = req.body.password;
    let email = req.body.email;

    // Checks if all the fields have arrived
    if(username && password && email) {
        // If they have it sends a 200 code which is standard for a successful HTTP request
        res.sendStatus(200);
        res.send('200 - Okay');
    } else {
        // If any of the fields have failed to arrive it sends a 200 code which is standard
        // for a server error
        res.sendStatus(500);
        res.send('500 - Error');
    }
});

// Initializes our express application at a specific port, and the calls a function (8080)
app.listen(8080, () => console.log("Listening on port 8080"));