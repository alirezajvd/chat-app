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

//messages stores in db.messages
router.post('/home/:userId/messages', (req,res) => {
    const {message, userId, recipientId} = req.body;
    console.log('message received messages', message, 'UserID:', userId, 'RecipientId', recipientId );


    db.run(`INSERT INTO messages (user_id, recipient_id, content) VALUES (?, ?, ?)`, [userId, recipientId, message], function (err){
        if(err){
            console.error('Database Error', err.message, this.lastID);
            res.status(500).json({message: 'Server Error'});
        } else{
            console.log('message Stoed successfully with ID: ', this.lastID);
            res.status(201).json({message: 'Message stored successfully', id: this.lastID});
        }
    });
});

//send previous chat 
router.get('/home/:userId/messages/:recipientId', (req,res) =>{
    const { userId, recipientId } = req.params;
    console.log('loading messages...', 'UserID:', userId);

    db.all(`
        SELECT id, content, recipient_id, timestamp
        FROM messages 
        WHERE (user_id = ? AND recipient_id = ?)
            OR (user_id = ? AND recipient_id = ?)
        ORDER BY TIMESTAMP ASC`,
        [userId,recipientId, recipientId, userId],
        (err, rows) =>{
        if (err) {
            console.error('Database Error', err.message);
            res.status(500).json({message: 'Server Error'});
        }else{
            const messages = rows.map(row => ({ id: row.id, content: row.content, userId: row.user_id, recipientId: row.recipient_id, timeStamp: row.timestamp}));
            console.log(messages);
            res.status(200).json(messages);
        }
    }); 

});

//deletes requested chat message 
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

//gets recipient id, name and list of recipient not empty messages and last message, timestamp
router.get('/home/:userId/communication-log', (req, res) => {
    const userId = req.params.userId;
    console.log('Got initial communication log request...');

    const query = `
        SELECT 
            ? AS user_id,
            partner_id,
            u.username AS partner_username,
            m.content AS last_message,
            m.timestamp AS last_message_timestamp
        FROM (
            SELECT 
                CASE 
                    WHEN user_id = ? THEN recipient_id
                    ELSE user_id
                END AS partner_id,
                MAX(id) AS last_message_id
            FROM messages
            WHERE (user_id = ? OR recipient_id = ?)
              AND user_id != recipient_id
            GROUP BY partner_id
        ) latest_messages
        JOIN messages m ON m.id = latest_messages.last_message_id
        JOIN users u ON latest_messages.partner_id = u.id
        ORDER BY m.timestamp DESC
        
    `;

    db.all(query, [userId, userId, userId, userId], (err, rows) => {
        if (err) {
            console.error('Error fetching communication log:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Processed communication log request successfully');
            res.status(200).json(rows);
        }
    });
});


router.get('/home/search-user', (req, res) =>{
    const searchQuery = req.query.username;
    console.log('///////////////////////');
    
    console.log('SEARCH QUERY:::',searchQuery);

    db.get(`SELECT id, username FROM users WHERE username = ? `, [searchQuery], (err, user) =>{
        if (err){
            console.error('Error fetching communication log:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } 
        if(user){
            console.log('sent ittttttttttt');
            res.status(200).json(user);
        }
        else {
            console.log('got the username');
            res.status(404).json({error: 'User not found'});
        }
    })

})

module.exports = router;