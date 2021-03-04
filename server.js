/** MODULE IMPORTS */
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const hexRgb = require('hex-rgb');
const rgbHex = require('rgb-hex');

// Salt rounds. Higher number prevents more attacks. 10 is the default and should be sufficient for NEA project.
const saltRounds = 10;

// User class
class User {
    #username;
    #hashed_password;
    #email;

    constructor(u_username, u_password, u_email) {
        this.#username = u_username;
        this.#email = u_email;

        if(username && password && email) {
            // Creates bcrypt salt
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) throw err;
                // If there wasn't an error we proceed to hash our password
                bcrypt.hash(u_password, salt, (err, hash) => {
                    if(err) throw err;
                    // Assuming our password was correctly hashed and salted we proceed to assign it to our password field
                    this.#hashed_password = hash;
                });
            })
        }
    }

    get_username() {
        return this.#username;
    }

    get_email() {
        return this.#email;
    }

    get_insert_query() {
        return `INSERT INTO users VALES (${this.#username}, ${this.#hashed_password}, ${this.#email})`;
    }
}

class Post {
    // All of the fields that a post will have
    #colour;
    #primary_font;
    #secondary_font;
    #secondary_colour;
    #accent_colour;
    #user_id;

    // Post constructor
    constructor(primary_colour, primary_font_url, secondary_font_url, user_id) {
        this.#colour = primary_colour;
        this.#primary_font = primary_font_url;
        this.#secondary_font = secondary_font_url;
        this.#user_id = user_id;
    }

    generate_colours() {
        let rgbColour = hexRgb(this.#colour);
        let shadeColour = hexRgb('#ffffff');
        let complementaryColour = hexRgb('#ffffff');

        // Create shade colour
        shadeColour.red   = Math.ceil(rgbColour.red / 2);
        shadeColour.blue  = Math.ceil(rgbColour.blue / 2);
        shadeColour.green = Math.ceil(rgbColour.green / 2);
    
        // Create accent colour
        complementaryColour.red   = 255 - rgbColour.red;
        complementaryColour.blue  = 255 - rgbColour.blue;
        complementaryColour.green = 255 - rgbColour.green;

        this.#secondary_colour = rgbHex(shadeColour.red, shadeColour.blue, shadeColour.green);
        this.#accent_colour    = rgbHex(complementaryColour.red, complementaryColour.blue, complementaryColour.green);
    }
}

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
    host: 'localhost',
    database: 'themevio',
    port: '3306',
    user: 'root',
    password: 'password'
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
    let user = User(req.body.user, req.body.password, req.body.email);
    // Assigns all parameters to variables to use later

    
});

app.post('/add_post', (req, res) => {
    let colour = req.body.colour;
    let user = req.body.user;

    connection.query
});

// Initializes our express application at a specific port, and the calls a function (8080)
app.listen(8080, () => console.log("Listening on port 8080"));