var book = require('./module/book'),
    async = require('async'),
    tool = require('./util/tool'),
    config = require('../config');

exports.add = function(req, res){
	if(!req.session || !req.session.user){
        return res.send({status: -2, content: '非法操作'});
    }
    console.log('req.session.user:',req.session.user);
    var userID = req.session.user._id;
	var bookName = req.body.bookName;
	console.log('userID', userID);
	res.send({status: 0, content: ''});
};

exports.getByUserID = function(req, res){
	
};

exports.remove = function(req, res){
	
};

exports.update = function(req, res){
	
};