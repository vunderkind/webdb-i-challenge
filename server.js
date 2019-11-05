const express = require('express');
const db = require('./data/dbConfig.js');
const server = express();
server.use(express.json());

server.get('/', (req, res)=> {
    res.status(200).send("Hello!");
})

server.get('/api/:id', (req, res)=>{
    db('accounts')
    .where({id: req.params.id})
    .first()
    .then(accts => res.status(200).json(accts))
    .catch(err => res.status(500).json({message: 'Failed to get account ' + err}))
});

server.post('/api', (req, res) => {

    const {name, budget} = req.body;
    (!name || !budget) ? res.status(400).json({ errorMessage: "Please provide name and budget for the account." }) :
    db('accounts')
        .insert({name, budget}, 'id')
        .then(([id]) => {
            db('accounts')
                .where({ id })
                .first()
                .then(acct => {
                    res.status(200).json(acct);
                });
        })
        .catch(err => res.status(500).json({ message: 'Error adding account' }))
});	

server.put('/api/:id', (req, res) => { 

    const acctChanges = req.body;
    db('accounts')
        .where('id', req.params.id)
        .update(acctChanges)
        .then(response => res.status(200).json({ message: 'Account updated' }))
        .catch(err => res.status(500).json({ message: 'Error adding account' }))
});	

server.delete('/api/:id', (req, res) => {

    db('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => res.status(200).json({ message: `Deleted records: ${count}` }))
    .catch(err => res.status(500).json({ message: 'Failed to get account' }))
});



module.exports = server;