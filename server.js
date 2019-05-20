const express = require('express');
const app = express();
const port = process.env.POST || 3000 ;
bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/assets', express.static(`${__dirname}/public`));
 
app.listen(port , console.log(`listening on Port ${port}`) );


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, content-type, Accept, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/words' , require('./controllers/words'));

app.use('/' ,(req, res)=> res.status(200).send('somthing went wrong on route fix route path :)') );
