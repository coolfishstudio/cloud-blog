var userColl = require('./mongo').getCollection('user');
var tool = require('../util/tool');

/* 增加用户 */
exports.insert = function(userObj, callback){
	userObj._id = tool.generateUUID();
	userObj.createTimestamp = new Date().getTime();
	userObj.headSrc = '/images/face/default/' + tool.getZeroize(Math.round(Math.random()*20) + 1) + '.png';//头像
	userObj.describe = ' 这家伙很懒，什么个性签名都没有留下。';//描述
	userObj.lastLoginDate = new Date().getTime();//最后登陆
	userObj.activate = false;
	userColl.insert(userObj, callback);
};
/* 用户修改 */
exports.update = function(userID, userObj, callback){
	userObj.updateTimestamp = new Date().getTime();
	userColl.findAndModify({_id: userID.toLowerCase()}, [], {$set: userObj}, {new: true}, callback);
};
/* 删除用户 */ 
exports.remove = function(userID, callback){
	userColl.remove({_id: userID}, callback);
};
/* 根据id查找用户 */ 
exports.getById = function(userID, callback){
	userColl.findOne({_id:userID},callback);
};
/* 根据账号查找用户 */ 
exports.getByEmail = function(email, callback){
	userColl.findOne({email : email},callback);
};
/* 根据用户名查找用户 */ 
exports.getByUserName = function(userName, callback){
	userColl.findOne({name : userName},callback);
};
/* 用户登录修改最后登录时间 */
exports.updateLastLoginDate = function(userID, callback){
	userObj.lastLoginDate = new Date().getTime();
	userColl.findAndModify({_id: userID.toLowerCase()}, [], {}, {new: true}, callback);
};
/* 获取用户总数 */
exports.getCount = function(info, callback){
	userColl.count(info, callback);
};