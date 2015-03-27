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
    callback (new Error("not valid"));
    return;
  }

  var ref = client.child(model);
  ref.orderByKey().startAt(data.id).endAt(data.id).once('value', function(snapshot) {
        if (snapshot.exists()) {
          ref.child(data.id).update(data, function(err){callback(err, data)});
        } else {
          callback (new Error("not valid"));
        }
      });
};

/**
 * Check if a model instance exists by id
 */
FirebaseDB.prototype.exists = function (model, id, callback) {
  console.log("exists()");
  var ref = client.child(model);
  ref.orderByKey().startAt(id).endAt(id).once('value', function(snapshot) {
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
    if (exists === null) {
      callback(new Error("not found"));
    } else {
      callback(null, [exists[id]]);
    }
  });

};

/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
FirebaseDB.prototype.updateOrCreate = function updateOrCreate(model, data, callback) {
  console.log("updateOrCreate()");
  var ref = client.child(model);
  var self = this;
  if (data && data.id) {
    ref.orderByKey().startAt(data.id).endAt(data.id).once('value', function(snapshot) {
      if (snapshot.exists()) {
        self.save(model, data, callback);
      } else {
        self.create(model, data, callback);
      }
    });
  } else {
    self.create(model, data, callback);
  }
};

/**
 * Delete a model instance by id
 */
FirebaseDB.prototype.destroy = function destroy(model, id, callback) {
  console.log("destroy()");
  var ref = client.child(model + '/' + id);
  ref.remove(callback);
};

/**
 * Query model instances by the filter
 */
FirebaseDB.prototype.all = function all(model, filter, callback) {
  console.log("all()");

  var filterKeys = Object.keys(filter);
  if (filterKeys && filterKeys.length > 0) {
    var id = (filter.where && filter.where.id) ? filter.where.id : filter.id;
    this.find(model, id, callback);
  } else {
    var ref = client.child(model);
    ref.once('value', function(snapshot){
      var values = snapshot.val();
      if (values) {
        var results = [];
        for (var key in values) {
          results.push(values[key]);
        }
        callback(null, results);
      } else {
        callback(null, []);
      }
    });
  }

};

/**
 * Delete all model instances
 */
FirebaseDB.prototype.destroyAll = function destroyAll(model, data, callback) {
  console.log("destroyAll()");
  if (data && data.id) {
    return this.destroy(model, data.id, callback);
  } else {
    callback = data;
    var ref = client.child(model);
    ref.remove(callback);
  }
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
  console.log("updateAttributes()", model, id, data, callback);
  var ref = client.child(model);
  ref.orderByKey().startAt(id).endAt(id).once('value', function(snapshot) {
    if (snapshot.exists()) {
      data.id = id;
      this.save(model, data, callback);
    } else {
      callback (new Error("Not valid"));
    }
  });
};

module.exports = FirebaseDB;