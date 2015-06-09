/**
 * Created with JetBrains WebStorm.
 * User: kamol
 * Date: 3/19/15
 * Time: 2:34 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

var FirebaseDB = require('./firebasedb');

/**
 * Initialize the FireBase connector for the given data source
 * @param {DataSource} dataSource The data source instance
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
  var settings = dataSource.settings;
  var connector = new FirebaseDB(dataSource);

  dataSource.connector = connector;
  connector.dataSource = dataSource;

  if (callback) {
    connector.connect(callback);
  }
};
