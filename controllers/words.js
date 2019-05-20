const express   = require('express');
const router    = express.Router();
const axios     = require('axios');
const db        =require('./dbconnection');


  


let log = [];
let errors = [];

function checkIfWordExist(table , checkedword){
    return new Promise((resolve , reject) =>{
        db.query(`select * from ${table} where word = '${checkedword}'`,(error, results, fields)=> {
            if (error) reject(error);
            if(results.length > 0){
            resolve(true);
            }else{   
            resolve(false);
            }    
          }); 
    });
}


function updateExistWord(table , word , newscore){
    db.query(`UPDATE ${table} SET score = ${newscore} WHERE word = '${word}'`,(error, results, fields)=> {
        log.push(`${word} updated score to ${newscore}`);
        return 1;
    });
}

function insertNewWord(table, word, score){
    db.query(`INSERT INTO ${table}(word, score) values('${word}' , ${score})`,(error, results, fields)=> {
        log.push(`${word} got to insert score ${score}`);
        return 1;
    });
}

function sumAndCountWord(table){
    return new Promise((resolve , reject) =>{
        db.query(`SELECT word,SUM(score) as totle_score, Count(word) as apperances FROM ${table}`,
        (error, results, fields)=>{
            if(error) reject(error);
            resolve(results[0]);
        });
    });    
}


router.get('/logs' , (req,res) =>{
    res.status(202).json(log);
})

router.get('/errors' , (req,res) =>{
    res.status(202).json(errors);
})


router.get('/tweets-report' , async (req,res)=>{
    let answare = [];
    let affilate = await sumAndCountWord('affiliate');
    answare.push(affilate);
    let marketing = await sumAndCountWord('marketing');
    answare.push(marketing);
    let influencer = await sumAndCountWord('influencer');
    answare.push(influencer);
    res.status(202).send(answare);
});

router.post('/fetch-tweets' , (req,res)=> {
    //the affilate request     
    axios.get('http://api.datamuse.com/words?sp=marketing')
        .then( async response => {
            for(word_index in response.data){
                let currentword = response.data[word_index].word;
                let currentscore = response.data[word_index].score;
                let currenttable = 'marketing';
                let isexsit = await checkIfWordExist(currenttable,currentword);
                if(isexsit){
                    updateExistWord(currenttable,currentword,currentscore);
                }else{
                    insertNewWord(currenttable,currentword,currentscore);    
               }    
            }
        })

        .catch(err => {
            console.log(err);
            errors.push(err);
            log.push(' error in insertin word to db check errors route for more details');
        });

    axios.get('http://api.datamuse.com/words?sp=affiliate')
        .then( async response => {
            for(word_index in response.data){
                let currentword = response.data[word_index].word;
                let currentscore = response.data[word_index].score;
                let currenttable = 'affiliate';
                let isexsit = await checkIfWordExist(currenttable,currentword);
                if(isexsit){
                    updateExistWord(currenttable,currentword,currentscore);
                }else{
                    insertNewWord(currenttable,currentword,currentscore);    
               }    
            }
        })

        .catch(err => {
            console.log(err);
            errors.push(err);
            log.push(' error in insertin word to db check errors route for more details');
        });

    axios.get('http://api.datamuse.com/words?sp=influencer')
        .then( async response => {
            for(word_index in response.data){
                let currentword = response.data[word_index].word;
                let currentscore = response.data[word_index].score;
                let currenttable = 'influencer';
                let isexsit = await checkIfWordExist(currenttable,currentword);
                if(isexsit){
                    updateExistWord(currenttable,currentword,currentscore);
                }else{
                    insertNewWord(currenttable,currentword,currentscore);    
               }    
            }
        })

        .catch(err => {
            console.log(err);
            errors.push(err);
            log.push(' error in insertin word to db check errors route for more details');
        });        

    res.status(200).send('in a few seconds you could check tweets-report/logs/errors routs for more details');
});

module.exports = router ;
