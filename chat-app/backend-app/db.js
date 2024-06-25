const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/users.db', (err) => {
    if (err) {
        console.error('Error opening the database:', err.message)
    } else {
        console.log('connected to the SQLite database.');
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

module.exports = {
    db,
    createUserTable
}