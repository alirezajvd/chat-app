const express = require('express');
const {db} = require('./db')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('hello from backend here')
});

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
            res.status(200).json({message: "Login Successful"});
        }else{
            res.status(401).json({message: "invalid credentials"})
        }
    })
});

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
        res.status(201).json({ message: 'User created successfully :)))))' })
    });
});

module.exports = router;