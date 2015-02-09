var book = require('./module/book'),
	article = require('./module/article'),
    async = require('async'),
    tool = require('./util/tool'),
    config = require('../config');

exports.add = function(req, res){
	if(!req.session || !req.session.user || !req.session.user._id){
        return res.send({status: -2, content: '非法操作'});
    }
    var userID = req.session.user._id;
	var bookID = req.body.bookID;
    var info = {};
	async.series({
		createArticle : function(done){
			article.insert({
                title : '未命名',
                content : '',
                userID : userID,
                bookID : bookID
            },function(err, obj){
                if(!err){
                    info = obj[0];
                    done();
                }else{
                    done(err);
                }
            });
		}
	},function(err){
		if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: info});
        }
	});
};
exports.update = function(req, res){
	
};
exports.remove = function(req, res){
	
};
exports.getByID = function(req, res){
	
};
exports.getByBookID = function(req, res){
	if(!req.session || !req.session.user || !req.session.user._id){
        return res.send({status: -2, content: '非法操作'});
    }
    var userID = req.session.user._id;
	var bookID = req.params.bookID;
	async.series({
		getByBookID : function(done){
			article.getByBookID({
				bookID : bookID,
				userID : userID
			},function(err, list){
                if(!err){
                    console.log(list);
                    info = list;
                    done();
                }else{
                    done(err);
                }
            });
		}
	},function(err){
		if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: info});
        }
	});



};