const fetch = require('node-fetch');
const User = require('../models/users');

const mongoose = require('mongoose');
const mongoDB = 'mongodb://test:abc123@ds151853.mlab.com:51853/interview';
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

exports.users = function(req, res, next){
  console.log('Start of Get Users')
  db.db.listCollections({name: 'users'})
    .next((error, usersData) => {
      if(error){
        return next(err);
      }
      if(usersData){
        console.log('Users are already in DB');
        User
          .find({})
          .exec(function(err, users){
            if(err){return next(err);}
            console.log('FOUND USERS')
            res.json(users);
          });
      }
      else{
        console.log('No Users in DB. Retrieving now.');
        fetch('https://api.github.com/search/users?q=repos:%3E42+followers:%3E500&per_page=100&page=1')
          .then(response => response.json())
          .then(json => {
            console.log('GOT USERS', json)
            var users = [];
            json.items.map(item => {
              const user = new User(
                {
                  login: item.login,
                  githubId: item.id,
                  url: item.url,
                  score: item.score
                }
              );
    
              user.save(function(err){
                if(err){ 
                  cb(err, null);
                  return;
                }
                console.log('New User: ', user)
                users.push(user);
              });
            });
    
            res.json(users);
          });
      }
    });
};

exports.addData = function(req, res, next){
  console.log('addData from server');
  console.log('req - body', req.body);
  console.log('req.params', req.query.id)

  // User.findById(req.query.id)
  //   .exec(function(err, user){
  //     console.log('Found user', user)
  //   });
  User.findByIdAndUpdate(req.query.id, req.body, function(err, result){
    if(err){ return next(err);}
    console.log('Result =', result);
    res.sendStatus(200);
  });
  // console.log('res ', res);
}