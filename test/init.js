/**
 * Created with JetBrains WebStorm.
 * User: kamol
 * Date: 3/19/15
 * Time: 5:25 PM
 * To change this template use File | Settings | File Templates.
 */
module.exports = require('should');

var DataSource = require('loopback-datasource-juggler').DataSource;

var config = require('rc')('loopback', {test: {firebase: {}}}).test.firebase;

global.getConfig = function (options) {

  var dbConf = {
    url: config.url || 'https://test.firebaseio.com/',
    token: config.token,
    database: 'myapp_test',
    createDatabase: true
  };

  if (options) {
    for (var el in options) {
      dbConf[el] = options[el];
    }
  }

  return dbConf;
};

global.getDataSource = global.getSchema = function (customConfig) {
  var db = new DataSource(require('../'), getConfig(customConfig));
  db.log = function (a) {
    console.log(a);
  };
  return db;
};