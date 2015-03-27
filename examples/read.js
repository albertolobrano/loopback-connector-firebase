/**
 * Created with JetBrains WebStorm.
 * User: kamol
 * Date: 3/27/15
 * Time: 10:29 AM
 * To change this template use File | Settings | File Templates.
 */
var DataSource = require('loopback-datasource-juggler').DataSource;
var config = require('rc')('loopback', {dev: {firebase: {}}}).dev.firebase;
var FBConnector = require('../index.js');
// Create new Datasource with FBConenctor
var ds = new DataSource(FBConnector, config);

// User data
var user1={id:'amol', name: 'Amol Kulkarni'};
var user2={id:'kamol', name: 'Amol K'};

// Define our model
User = ds.define('users', {
  id: { type: String },
  name: { type: String},
  dob: { type: String}
});

// Connect to Datasource
ds.connect(function(err, authData){
  if (err) {
    console.log("connection failed");
  } else {
    console.log("connection successfull");
    createUser(user1);
    createUser(user2);
  }
});

// Add user
function createUser (user) {
  User.create(user, function (err, user) {
    if (err) {
      console.log("creation failed");
    } else {
      console.log("user created");
      checkUser(user.id);
      if (user.id === 'kamol') {
        readAllUsers();
      }

    }
  });
}

// Check for user
function checkUser(id) {
  User.exists(id,function(err,res){
    if (res) {
      console.log ("User exists: ", id);
      readUserById(id);
    } else {
      console.log ("User does not exists: ", id);
    }
  });
}

// Read data for given user
function readUserById(id) {
  User.findById(id, function(err, data) {
    if (err) {
      console.log ("User does not exists: ", id, err);
    } else {
      console.log ("User data: ", data);
    }
  });
}

// Read all user data
function readAllUsers() {
  User.find ({},function(err, data){
    console.log('Data: ', data);
  });
}


