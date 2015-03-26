/**
 * Created with JetBrains WebStorm.
 * User: kamol
 * Date: 3/19/15
 * Time: 2:41 PM
 * To change this template use File | Settings | File Templates.
 */

var FirebaseClient = require('firebase'),
    FirebaseTokenGenerator = require("firebase-token-generator"),
    Connector = require('loopback-connector').Connector,
    util = require('util'),
    async = require('async');

var NAME = 'firebase';

var client = null;
/**
 * Constructor for FirebaseDB connector
 * @param {Object} settings The settings object
 * @param {DataSource} dataSource The data source
 * instance
 * @constructor
 */
var FirebaseDB = function (dataSource) {
  if (!(this instanceof FirebaseDB)) {
    return new FirebaseDB(dataSource);
  }

  Connector.call(this, NAME, dataSource.settings);

  this.name = NAME;
  this.settings = dataSource.settings;
};

util.inherits(FirebaseDB, Connector);

/**
 * Get the default data type for ID
 * @returns {Function} The default type for ID
 */
FirebaseDB.prototype.getDefaultIdType = function () {
  return String;
};

/**
 * Connect to the Database
 * @param callback
 */
FirebaseDB.prototype.connect = function (callback) {
  client = new FirebaseClient(this.settings.url);

  if (this.settings.token) {
    var tokenGenerator = new FirebaseTokenGenerator(this.settings.token);
    var token = tokenGenerator.createToken({uid: "1", some: "arbitrary", data: "here"});
    client.authWithCustomToken(token, callback);
  } else {
    callback(null);
  }

};

FirebaseDB.prototype.getTypes = function onGetTypes() {
  return ['db', 'nosql', 'firebase'];
};

/**
 * Create a new model instance
 */

FirebaseDB.prototype.create = function (model, data, callback) {
  console.log("create()");
  var ref = client.child(model);
  if (data.id) {
    ref.child(data.id).set(data, function(err){callback(err, data.id)});
  } else {
    var newRef = ref.push();
    var newId = newRef.key();
    newRef.remove();
    data.id = newId;
    ref.child(data.id).set(data, function(err){callback(err, data.id)});
  }
};

/**
 * Save a model instance
 */
FirebaseDB.prototype.save = function (model, data, callback) {
  console.log("save()");
  if (!data.id) {
    callback ({"msg": "not valid"});
    return;
  }

  var ref = client.child(model);
  ref.startAt(data.id).endAt(data.id).once('value', function(snapshot) {
        if (snapshot.exists()) {
          ref.set(data, function(err){callback(err, data)});
        } else {
          callback ({"msg": "not valid"});
        }
      });
};

/**
 * Check if a model instance exists by id
 */
FirebaseDB.prototype.exists = function (model, id, callback) {
  console.log("exists()");
  var ref = client.child(model);
  ref.startAt(id).endAt(id).once('value', function(snapshot) {
    callback(null, snapshot.exists());
  });
};

/**
 * Find a model instance by id
 */
FirebaseDB.prototype.find = function find(model, id, callback) {
  console.log("find()");
  var ref = client.child(model);

  ref.orderByKey().startAt(id).endAt(id).once('value', function(snapshot) {
    var exists = snapshot.val();
    var err;
    if (exists !== null) {
      err =  {"msg": "not found"};
    }
    callback(err, exists);
  });

};

/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
FirebaseDB.prototype.updateOrCreate = function updateOrCreate(model, data, callback) {
  console.log("updateOrCreate()");
  var ref = client.child(model);
  ref.startAt(data.id).endAt(data.id).once('value', function(snapshot) {
    if (snapshot.exists()) {
      this.save(model, data, callback);
    } else {
      this.create(model, data, callback);
    }
  });

};

/**
 * Delete a model instance by id
 */
FirebaseDB.prototype.destroy = function destroy(model, id, callback) {
  console.log("destroy()");
  var ref = client.child(model);
  ref.startAt(id).endAt(id).remove(callback);
};

/**
 * Query model instances by the filter
 */
FirebaseDB.prototype.all = function all(model, filter, callback) {
  console.log("all()");

  var ref = client.child(model);
  ref.orderByKey().startAt(filter.where.id)
      .endAt(filter.where.id).once('value', function(snapshot) {
        var val = snapshot.val();
        if (val) {
          callback(null, [val[filter.where.id]]);
        } else {
          callback (null, [{}]);
        }
      });
};

/**
 * Delete all model instances
 */
FirebaseDB.prototype.destroyAll = function destroyAll(model, data, callback) {
  console.log("destroyAll()");
  callback = (data && data.id) ? callback : data;
  var ref = client.child(model);
  ref.remove(callback);
};

/**
 * Count the model instances by the where criteria
 */
FirebaseDB.prototype.count = function count(model, callback, where) {
  console.log("count()");
  var ref = client.child(model);
  if (where.id) {
    ref.orderByKey().startAt(where.id)
        .endAt(where.id).once('value', function(snapshot) {
          var count = snapshot.numChildren();
          callback(null, count);
        });
  } else {
    ref.once('value', function(snapshot) {
          var count = snapshot.numChildren();
          callback(null, count);
        });
  }

};

/**
 * Update the attributes for a model instance by id
 */
FirebaseDB.prototype.updateAttributes = function updateAttrs(model, id, data, callback) {
  console.log("updateAttributes()");
  var ref = client.child(model);
  ref.startAt(id).endAt(id).once('value', function(snapshot) {
    if (snapshot.exists()) {
      data.id = id;
      this.save(model, data, callback);
    } else {
      callback ({"msg": "Not valid"});
    }
  });
};

module.exports = FirebaseDB;