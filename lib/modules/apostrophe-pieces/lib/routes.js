module.exports = function(self, options) {

  self.route('post', 'insert', function(req, res) {

    var piece = self.newInstance();

    return async.series({
      // hint: a partial object, or even passing no fields
      // at this point, is OK
      convert: function(callback) {
        return self.apos.schemas.convert(req, schema, req.body, piece, callback);
      },
      before: function(callback) {
        return self.beforeCreate(req, piece, callback);
      },
      insert: function(callback) {
        return self.insert(req, piece, callback);
      },
      after: function(callback) {
        return self.afterCreate(req, piece, callback);
      }
    }, function(err) {
      return self.apiResponse(res, err, piece);
    });

  });

  self.route('post', 'retrieve', self.requirePiece, function(req, res) {
    return self.apiResponse(res, null, req.piece);
  });

  self.route('post', 'list', function(req, res) {
    var results;
    return async.series({
      before: function(callback) {
        return self.beforeList(req, callback);
      },
      list: function(callback) {
        return self.list(req, function(err, _results) {
          if (err) {
            return callback(err);
          }
          results = _results;
          return callback(null);
        }
      },
      after: function(callback) {
        return self.afterList(req, pieces, callback);
      }
    }, function(err) {
      return self.apiResponse(res, err, results);
    });
  });

  self.route('post', 'update', self.requirePiece, function(req, res) {
    var schema = self.schema;
    return async.series({
      convert: function(callback) {
        return self.apos.schemas.convert(req, schema, req.body, req.piece, callback);
      },
      before: function(callback) {
        return self.beforeUpdate(req, req.piece, callback);
      },
      update: function(callback) {
        return self.update(req, req.piece, callback);
      },
      after: function(callback) {
        return self.afterUpdate(req, req.piece, callback);
      },
    }, function(err) {
      return self.apiResponse(res, err, req.piece);
    });

  });

  self.route('post', 'trash', function(req, res) {
    // TODO implement
  });

};