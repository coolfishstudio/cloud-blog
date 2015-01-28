var mongoBook = require('../mongo/mongoBook');

/* 增删查改 */
exports.insert = mongoBook.insert;
exports.update = mongoBook.update;
exports.remove = mongoBook.remove;
exports.getById = mongoBook.getById;

exports.getByUserID = mongoBook.getByUserID;