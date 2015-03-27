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
var user2={id:'amol', name: 'Amol K'};
var user3={id:'kamol', name: 'Amol Kulkarni'};

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
    createUser(user3);
    User.count(function(err,count){
       console.log ("total users: ", count);
    });
  }
});

// Add user
function createUser (user) {
  User.create(user, function (err, user) {
    if (err) {
      console.log("creation failed");
    } else {
      console.log("user created");
    }
  });
}
