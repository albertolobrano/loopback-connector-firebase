/**
 * Created with JetBrains WebStorm.
 * User: kamol
 * Date: 3/19/15
 * Time: 5:24 PM
 * To change this template use File | Settings | File Templates.
 */

require('./init.js');
var expect = require('chai').expect;

describe('DataSource',function(){
  var ds = null;
  var User = null;
  this.timeout(5000);
  console.log('Try increasing timeout if failing due to timeout exceeded');

  beforeEach(function(done){
    ds = getDataSource();

    User = ds.define('users', {
      id: { type: String },
      name: { type: String},
      dob: { type: String}
    });

    Project = ds.define('projects', {
      id:{ type:String },
      name: { type: String},
      owner:{ type: String}
    });

    ds.connect(function(err, authData){
      if (err) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:");
        User.destroyAll(function(){
          expect(err).to.satisfy(function(err){
            return err === null || err === undefined
          });
          Project.destroyAll(function(err){
            expect(err).to.satisfy(function(err){
              return err === null || err === undefined
            });
            done();
          });
        });
      }
    });
  });


  it('should have firebase connector',function(){
    expect(ds).not.null;
    expect(ds.connector).not.null;
    expect(ds.connector.name).to.equal('firebase');
    expect(ds.connector.settings).not.null;
    expect(ds.connector.settings.host).not.null;
  });

  it('should be able to create User with id',function(done){

    var user1={id:'amol', name: 'Amol Kulkarni'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;
      expect(user.id).to.equal(user1.id);
      expect(user.name).to.equal(user1.name);

      User.findById('amol',function(err,res){
        expect(res.id).to.equal(user1.id);
        expect(res.name).to.equal(user1.name);
        done();
      });
    });
  });


  it('should be able to create User without id',function(done){

    var user1={name: 'John'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;
      expect(user.id).not.be.null;
      expect(user.name).to.equal(user1.name);
      User.findById(user.id,function(err,res){
        expect(res.id).not.be.null;
        expect(res.name).to.equal(user1.name);
        done();
      })

    });
  });

  it('should be able to destroy User',function(done){

    var user1={id:'200',name: 'John'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;

      User.findById('200',function(err,user){
        expect(err).to.be.null;
        expect(user.id).to.equal(user1.id);
        expect(user.name).to.equal(user1.name);

        User.deleteById('200',function(err){
          expect(err).to.be.null;
          done();
        });
      })

    });
  });

  it('should be able to destroy all Users',function(done){

    var user1={id:'200',name: 'John'};
    var project1= {id:'100',name:'hr',owner:'Smith'};
    Project.create(project1,function(err,project) {

      User.create(user1, function (err, user) {
        expect(err).to.be.null;

        User.destroyAll(function (err) {
          expect(err).to.be.null;
          Project.findById('100',function(err,project){
            //Check if project still exists
            expect(project.id).to.equal(project1.id);

            //Check the count of Users
            User.count(function(err,count){
              expect(count).to.equal(0);
              done();
            });

          })

        });


      });
    });
  });

  it('should be able to count User',function(done){

    var user1={id:'200',name: 'John'};
    var user2={id:'400',name: 'Bob'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;

      User.count(function(err,count){
        expect(count).to.equal(1);
        User.create(user2, function (err, user) {
          User.count(function(err,count){
            expect(count).to.equal(2);
            done();
          })
        });
      });

    });
  });

  it('should be able check if key exists',function(done){

    var user1={id:'200',name: 'John'};
    var user2={id:'400',name: 'Bob'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;
      User.exists('200',function(err,res){
        expect(res).to.equal(true);
        User.create(user2, function (err, user) {
          User.exists('400',function(err,res){
            expect(res).to.equal(true);
            done();
          });
        });

      });

    });
  });

  it('should not be able find a non existent User',function(done){

    User.findById('200',function(err,user){
      expect(err).to.be.null;
      expect(user).to.be.null;
      done();
    })

  });


});
