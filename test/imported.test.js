module.exports = require('should');
describe('firebase imported features', function () {
  this.timeout(50000);
  before(function () {
    require('./init.js');
  });

  require('loopback-datasource-juggler/test/datatype.test.js');
  require('loopback-datasource-juggler/test/common.batch.js');
  require('loopback-datasource-juggler/test/default-scope.test.js');
  require('loopback-datasource-juggler/test/include.test.js');

});