var user = require('./module/user'),
    async = require('async'),
    tool = require('./util/tool'),
    config = require('../config');

//注册
exports.signin = function(req, res){
	var userName = req.body.userName || '';
    var password = req.body.password || '';
    var email = req.body.email || '';
    if(!userName || !password || !email){
    	return res.send({status: -1, content: '参数不能为空'});
    }
    for(var i = 0; i < config.LIMIT.NAME.length; i++){
        if(userName == config.LIMIT.NAME[i]){
            return res.send({status: -1, content: '该用户名已经存在了。'});
        }
    }
    async.series({
    	//查看是否有用过这个邮箱做为账户
    	findEmail : function(done){
    		user.getByEmail(email, function(err, info){
        		if(!err){
                    if(null != info){
                        done('该邮箱已经注册过了。');
                    }else{
                        done();
                    }
                }else{
                    done(err);
                }
        	});
    	},
    	//查看用户名是否一样
    	findUserName : function(done){
    		user.getByUserName(userName, function(err, info){
        		if(!err){
                    if(null != info){
                        done('该用户名已经存在了。');
                    }else{
                        done();
                    }
                }else{
                    done(err);
                }
        	});
    	},
    	//注册用户
    	insertUser : function(done){
    		user.insert({
            	email : email,
                name : userName,
                password : tool.getMD5(password)
            },function(err, info){
                if(!err){
                	info[0].password = '';
                    req.session.user = info[0];
                    done();
                }else{
                    done(err);
                }
            });
    	}
    }, function(err){
    	if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '注册成功'});
        }
    });
};

//登录
exports.login = function(req, res){
	var email = req.body.email;
    var password = req.body.password;
    var userInfo = {};
    async.series({
        //根据账户email去查询
        findEmail: function(done){
            user.getByEmail(email, function(err, info){
                if(!err){
                    if(null != info){
                        userInfo = info;
                        done();
                    }else{
                        done('该帐户不存在，请检查你的输入邮箱。');
                    }
                }else{
                    done(err);
                }
            });
        },
        //判断找到的数据是否密码一样
        contrastPassword: function(done){
            if(tool.getMD5(password) == userInfo.password){       	
            	userInfo.password = '';
                req.session.user = userInfo;//用户信息存入 session
                done();
            }else{
                done('密码不正确，请重新输入。');
            }
        },
        //纪录最后一次登陆的时间
        updateLastLoginDate : function(done){
            user.updateLastLoginDate(userInfo._id,{},function(err, info){
                done(err);
            });
        }
    },function(err){
        if(err){
            res.send({status: -1, content: err});
        }else{
            res.send({status: 0, content: '登录成功。'});
        } 
    });
};

//退出
exports.logout = function(req, res){
	req.session.user = null;
    res.redirect('/');
};