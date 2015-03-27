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
var user1 = {
  name: 'Amol Kulkarni',
  age: 30,
  title: 'MyPost',
  contents: 'My First Post'
};
var user2 = {
  name: 'Amol Kulkarni',
  age: 30,
  title: 'MyPost',
  contents: 'Updated Contents'
};
var user3 = {
  name: 'John',
  age: 30,
  title: 'Post',
  contents: 'Current affairs'
};
var user4 = {
  name: 'John',
  age: 35,
  title: 'Post2',
  contents: 'The making of USA'
};
var user5 = {
  name: 'David',
  age: 20,
  title: 'World as seen'
};

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
    createUser(user4);
    createUser(user5);
  }
});

// Add user
function createUser (user) {
  User.create(user, function (err, user) {
    if (err) {
      console.log("creation failed");
    } else {
      console.log("user created");
      if (user.name === 'David') {
        FindAll();
        FindWithName();
        FindWithAge();
        FindLimit();
        FindOrdered();

        // Not Supported Yet
        //FindAgeAndName();
        //FindProperty();
        //FindPosts();
        //FindOwnerPosts();
      }
    }
  });
}

// Return All Data
function FindAll() {
  User.find ({},function(err, data){
    console.log('FindAll Data: ', data);
  });
}

// Return data for given User
function FindWithName() {
  User.find ({where: {name: 'Amol Kulkarni'}},function(err, data){
    console.log('FindWithName Data: ', data);
  });
}

// Return data witch matches age criteria
function FindWithAge() {
  User.find ({where: {age: {gt: 25}}},function(err, data){
    console.log('FindWithAge Data: ', data);
  });
}

// Return data with matching Name and Age
function FindAgeAndName() {
  User.find ({where: {name: 'John', age: {gt: 30}}},function(err, data){
    console.log('FindAgeAndName Data: ', data);
  });
}

// Return only x data
function FindLimit() {
  User.find ({limit: 3}, function(err, data){
    console.log('FindLimit Data: ', data);
  });
}

// Return ordered data
function FindOrdered() {
  User.find ({order: 'age DESC', limit: 3}, function(err, data){
    console.log('FindOrdered Data: ', data);
  });
}

// Return only title and contents
function FindProperty() {
  User.find ({fields: {title: true, contents: true}}, function(err, data){
    console.log('FindProperty Data: ', data);
  });
}

function FindPosts() {
  User.find ({include: 'contents'}, function(err, data){
    console.log('FindPosts Data: ', data);
  });
}

function FindOwnerPosts() {
  User.find ({include: {name: 'title'}}, function(err, data){
    console.log('FindOwnerPosts Data: ', data);
  });
}