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

            res.status(200).json({accessToken, username: row.username, userId: row.id});
            
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

//user chat stores in db.messages
router.post('/home/:userId/messages', (req,res) => {
    const {message, userId} = req.body;
    console.log('message received messages', message, 'UserID:', userId );


    db.run(`INSERT INTO messages (user_id, content) VALUES (?, ?)`, [userId, message], function (err){
        if(err){
            console.error('Database Error', err.message, this.lastID);
            res.status(500).json({message: 'Server Error'});
        } else{
            console.log('message Stoed successfully with ID: ', this.lastID);
            res.status(201).json({message: 'Message stored successfully', id: this.lastID});
        }
    });
});

//displays previous chat 
router.get('/home/:userId/messages', (req,res) =>{
    const {userId} = req.params;
    console.log('loading messages...', 'UserID:', userId);

    db.all(`SELECT id, content FROM messages WHERE user_id = ? ORDER BY TIMESTAMP ASC`, [userId], (err, rows) =>{
        if (err) {
            console.error('Database Error', err.message);
            res.status(500).json({message: 'Server Error'});
        }else{
            const messages = rows.map(row => ({id: row.id, content: row.content }));
            res.status(200).json(messages);
        }
    }); 

});

//deletes the chat message 
router.delete('/home/:userId/messages/:messageId', (req,res) =>{
    const { userId, messageId } = req.params;
    console.log('got delete request...', 'UserID:', userId, 'messageID:', messageId);
    db.run(`DELETE FROM messages WHERE id = ? AND user_id = ?`, [messageId, userId], function(err) {
        if (err) {
            console.error('Database Error:', err.message);
            res.status(500).json({message: 'Server Error'});
        }else{
            console.log(`Message deleted with ID ${messageId} for user ${userId}`);
            res.status(200).json({ message: `Message with ID ${messageId} deleted successfully` });
        }
    })
});

module.exports = router;