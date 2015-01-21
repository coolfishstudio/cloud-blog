var mongoUser = require('../mongo/mongoUser');

/* 增删查改 */
exports.insert = mongoUser.insert;
exports.update = mongoUser.update;
exports.remove = mongoUser.remove;
exports.getById = mongoUser.getById;

exports.getByEmail = mongoUser.getByEmail;
exports.getByUserName = mongoUser.getByUserName;
exports.updateLastLoginDate = mongoUser.updateLastLoginDate;
exports.getCount = mongoUser.getCount;