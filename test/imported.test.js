module.exports = require('should');
describe('firebase imported features', function () {
  this.timeout(50000);
  before(function () {
    require('./init.js');
  });

  require('loopback-datasource-juggler/test/datatype.test.js');
  require('loopback-datasource-juggler/test/basic-querying.test.js');
  require('loopback-datasource-juggler/test/manipulation.test.js');
  require('loopback-datasource-juggler/test/hooks.test.js');

});