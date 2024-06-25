const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

//express instance
const app = express();

//middleware setup
app.use(cors());
app.use(bodyparser.json());

//-----------------------------------------------------------DATABASE CREATION-------------------
const db = new sqlite3.Database('./data/users.db', (err) =>{
    if (err) {
        console.error('Error opening the database:', err.message)
    }else{
        console.log('connected to the SQLite database.');
    }
});

const createUserTable = () =>{
    db.run(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
        )`, (err) =>{
            if (err) {
                console.error('Error creating users table:', err.message)
            }else{
                console.log('Users table created or already exists');
            }
        });
};
createUserTable();

//-----------------------------------------------------------DATABASE CREATION-------------------
const users = [
    {username: "user1", password: "pass1"},
    {username: "user2", password: "pass2" },
    {username: "user3", password: "pass3" },
]
//define route
app.get('/', (req, res) => {
    res.send('hello from backend here')
});





app.post('/', (req, res) =>{
    const {username, password} = req.body;
    console.log('recived login', {username, password});

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.status(200).json({message: "login successful"});
    }else{
        res.status(401).json({message: "Invalid credentials"});
    }
});

app.post('/signup', (req, res) =>{
    const {username, password} = req.body;
    console.log('recived signup', { username, password });

    db.run(`INSERT INTO users (username,password) VALUES (?, ?)`, [username, password], function(err){
        if (err) {
            if (err.message.includes(`UNIQUE constraint failed`)) {
                console.log('git good');
                return res.status(409).json({error: 'Username already exists'});
            }
            return res.status(500).json({error: 'Server error'});
        }
        res.status(201).json({message: 'User created successfully :)))))'})
    });
});


const port = 5000;
app.listen(port, () =>{
    console.log(`server is running oon http://localhost:${port}`);
});
