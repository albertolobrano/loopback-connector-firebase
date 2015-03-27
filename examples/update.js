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
var user1={id:'amol', name: 'Amol Kulkarni', dob: 'Jan 1, 1970'};

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
    createUser();
  }
});

// Add user
function createUser () {
  User.create(user1, function (err, user) {
    if (err) {
      console.log("creation failed");
    } else {
      console.log("user created");
      updateUser();
    }
  });
}

// Delete User
function updateUser () {
  User.updateOrCreate({'id': user1.id, 'name': 'John'}, function(err){
    if (err) {
      console.log("updation failed");
    } else {
      console.log("user updated");
    }
  });
}
