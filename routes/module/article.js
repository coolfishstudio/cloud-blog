var mongoArticle = require('../mongo/mongoArticle');

/* 增删查改 */
exports.insert = mongoArticle.insert;
exports.update = mongoArticle.update;
exports.remove = mongoArticle.remove;
exports.getById = mongoArticle.getById;

exports.getByBookID = mongoArticle.getByBookID;