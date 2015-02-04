var mongoArticle = require('../mongo/mongoArticle');

/* 增删查改 */
exports.insert = mongoBook.insert;
exports.update = mongoBook.update;
exports.remove = mongoBook.remove;
exports.getById = mongoBook.getById;

exports.getByBookID = mongoBook.getByBookID;