var book = require('./module/book'),
    async = require('async'),
    tool = require('./util/tool'),
    config = require('../config');

exports.add = function(req, res){
	if(!req.session || !req.session.user || !req.session.user._id){
        return res.send({status: -2, content: '非法操作'});
    }
    var userID = req.session.user._id;
	var bookName = req.body.bookName;
	async.series({
		createBooks : function(done){
			book.insert({
                name : bookName,
                userID : userID
            },function(err, info){
                if(!err){
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
            res.send({status: 0, content: '添加笔记成功。'});
        }
	});
};

exports.getByUserID = function(req, res){
	if(!req.session || !req.session.user || !req.session.user._id){
        return res.send({status: -2, content: '非法操作'});
    }
    var userID = req.session.user._id;
    var info = [];
    async.series({
        findBookList : function(done){
            book.getByUserID(userID, function(err, list){
                if(!err){
                    info = list;
                    done();
                }else{
                    done(err);
                }
            });
        }
    },function(err){
        if(err){
            res.render('error', { user:req.session.user || ''});
        }else{
            res.render('editor', { user:req.session.user || '', bookList : info});
        }
    });
};

exports.remove = function(req, res){
	
};

exports.update = function(req, res){
	
};