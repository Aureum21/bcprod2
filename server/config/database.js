 const mysql = require("mysql2/promise");


const pool = mysql.createPool({

    host: "localhost",

    user: "blockchain_backend",

    password: "CHANGE_THIS_PASSWORD",

    database: "blockchain_auth",

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0
});


module.exports = pool;