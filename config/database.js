const mysql = require('mysql2');

const db = mysql.createPool({
host: 'localhost',
user: 'root',
database: 'projectdb',
password: '08042001'
});

module.exports = db.promise();