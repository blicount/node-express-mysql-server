const mysql = require('mysql');
const config = require('../config/mysqlKey');

const db = mysql.createConnection({
    connectionLimit : 10,
    host            : config.host,
    user            : config.user,
    password        : config.password,
    database        : config.database
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

module.exports=db