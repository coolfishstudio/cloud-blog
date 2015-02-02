var bookColl = require('./mongo').getCollection('blog_book');
var tool = require('../util/tool');

/* 增加书籍 */
exports.insert = function(bookObj, callback){
	bookObj._id = tool.generateUUID();
	bookObj.released = false;
	bookObj.createTimestamp = new Date().getTime();
	bookObj.updateTimestamp = new Date().getTime();
	bookColl.insert(bookObj, callback);
};
/* 书籍修改 */
exports.update = function(bookID, bookObj, callback){
	bookObj.updateTimestamp = new Date().getTime();
	bookColl.findAndModify({_id: bookID.toLowerCase()}, [], {$set: bookObj}, {new: true}, callback);
};
/* 删除书籍 */ 
exports.remove = function(bookID, callback){
	bookColl.remove({_id: bookID}, callback);
};
/* 根据id查找书籍 */ 
exports.getById = function(bookID, callback){
	bookColl.findOne({_id:bookID},callback);
};
/* 根据用户id查找书籍 */ 
exports.getByUserID = function(userID, callback){
	bookColl.find({userID : userID}).sort({'updateTimestamp':-1}).toArray(callback);
};
