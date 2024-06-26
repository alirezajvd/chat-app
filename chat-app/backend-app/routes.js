const express = require('express');
const {db} = require('./db')
const router = express.Router()
const jwt = require('jsonwebtoken')

//CHANGE THIS LATER 
const accessTokenSecret = '!super@strong#password$123456%';

router.get('/', (req, res) => {
    res.send('hello from backend here')
});


//login post here
router.post('/', (req, res) => {
    const { username, password } = req.body;
    console.log('recived login', { username, password });

    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) =>{
        if (err) {
            console.error('Database Error: ', err.message);
            res.status(500).json({message: 'Server Error'});
        }

        if (row){
            console.log('got your logins :)))))');
            const accessToken = jwt.sign({username: username, userID:row.id}, accessTokenSecret, {expiresIn: '15m'});

            res.status(200).json({accessToken, username: row.username});
            
        }else{
            res.status(401).json({message: "invalid credentials"})
        }
    })
});

//sign up post here
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    console.log('recived signup', { username, password });

    db.run(`INSERT INTO users (username,password) VALUES (?, ?)`, [username, password], function (err) {
        if (err) {
            if (err.message.includes(`UNIQUE constraint failed`)) {
                console.log('git good');
                return res.status(409).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: 'Server error' });
        }
        const accessToken = jwt.sign({username: username}, accessTokenSecret, {expiresIn: '15m'});

        res.status(201).json({ accessToken, username: username })
    });
});

module.exports = router;