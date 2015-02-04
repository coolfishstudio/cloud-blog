var articleColl = require('./mongo').getCollection('blog_article');
var tool = require('../util/tool');

/* 创建文章 */
exports.insert = function(articleObj, callback){
	articleObj._id = tool.generateUUID();
	articleObj.released = false;
	articleObj.createTimestamp = new Date().getTime();
	articleObj.updateTimestamp = new Date().getTime();
	articleColl.insert(articleObj, callback);
};
/* 文章修改 */
exports.update = function(articleID, articleObj, callback){
	articleObj.updateTimestamp = new Date().getTime();
	articleColl.findAndModify({_id: articleID.toLowerCase()}, [], {$set: articleObj}, {new: true}, callback);
};
/* 删除文章 */ 
exports.remove = function(articleID, callback){
	articleColl.remove({_id: articleID}, callback);
};
/* 根据id查找文章 */ 
exports.getById = function(articleID, callback){
	articleColl.findOne({_id:articleID},callback);
};
/* 根据bookID查找文章 */ 
exports.getByBookID = function(bookID, callback){
	articleColl.find({bookID : bookID}).sort({'updateTimestamp':-1}).toArray(callback);
};
