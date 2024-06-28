const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/users.db', (err) => {
    if (err) {
        console.error('Error opening the database:', err.message)
    } else {
        console.log('connected to the SQLite database.');
        db.run('PRAGMA foreign_keys = ON', (pragmaErr) =>{
            if (pragmaErr) {
                console.error('Error enabling foreign key support: ', pragmaErr.message);
            }else{
                console.log('Foreign key support enabled.');
            }
        });
    }
});

const createUserTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
        )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message)
        } else {
            console.log('Users table created or already exists');
        }
    });
};

const createMessageTable = () =>{
    db.run(`CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
        FOREIGN KEY (recipient_id) REFERENCES users (id)
        )`, (err) => {
            if (err) {
                console.error('Error creating messages table:', err.message)
            } else {
                console.log('Messages table created or already exists');
            }
        });
}


module.exports = {
    db,
    createUserTable,
    createMessageTable
}