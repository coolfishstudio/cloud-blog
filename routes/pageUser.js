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
                	// info[0].password = '';
                 //    req.session.user = info[0];
                    done();
                }else{
                    done(err);
                }
            });
    	},
    	//发送邮件
    	sendEmail : function(done){
    		var time = new Date().getTime();
    		var link = config.HOSTNAME + '/activate/' + email + '/' + tool.getMD5(password) + time;
    		var html = '<style type="text/css">.cfs_letterBox{padding:40px;text-align:center;background:#d2d2d2;}.cfs_letterBox a{color:#407700;}.cfs_letter{width:580px;margin:0 auto;padding:10px;color:#333;background-color:#fff;border:0px solid#aaa;border-radius:5px;-webkit-box-shadow:3px 3px 10px#999;box-shadow:3px 3px 10px#999;font-family:Verdana,sans-serif;}.cfs_letterHeader{height:23px;}.cfs_letterTitle{height:48px;}.cfs_letterTitle h1{margin:0;color:#407700;}.cfs_letterTitle_line{height:2px;font-size:0;margin:10px auto 5px auto;background:#407700;width:90%;}.cfs_letterContent{text-align:left;padding:30px;font-size:14px;line-height:1.5em;}.cfs_letterContent p{word-wrap:break-word;word-break:break-all;}.cfs_letterInscribe{padding:40px 0 0;overflow:hidden;}.cfs_letterInscribe img{float:right;width:79px;border-radius:5px;}.cfs_letterSender{float:right;text-align:right;margin:0 10px 0 0;}.cfs_letterSenderName{margin:0 0 8px;font-size:16px;}.cfs_letterSenderInfo{font-size:12px;margin:0;line-height:1.2em;}.cfs_letterSenderAsk{font-size:12px;margin:0;}.cfs_letterFooter{margin:16px;text-align:center;font-size:12px;color:#888;text-shadow:1px 0px 0px#eee;}</style><div class="cfs_letterBox"><div class="cfs_letter"><div class="cfs_letterHeader"></div><div class="cfs_letterTitle"><h1>酷鱼网</h1><div class="cfs_letterTitle_line"></div></div><div class="cfs_letterContent"><div><p>您好, ' + userName + ' !</p><p>感谢你注册酷鱼网平台。<br>你的登录账户为：<a href="mailto:' + email + '"target="_blank">' + email + '</a>。请点击以下链接激活帐号：</p><p><a href="' + link + '"target="_blank">' + link + '</p><p>如果以上链接无法点击，请将上面的地址复制到你的浏览器(如IE)的地址栏进入酷鱼网平台进行激活。 （该链接在24小时内有效，24小时后需要重新注册）</p></div><div class="cfs_letterInscribe"><img src="http://www.coolfishstudio.com/images/yves.png"><div class="cfs_letterSender"><p class="cfs_letterSenderName">Yves</p><p class="cfs_letterSenderInfo">酷鱼网开发者<br><a href="mailto:461836324@qq.com"target="_blank">461836324@qq.com</a></p><p class="cfs_letterSenderAsk">有问题、有建议，欢迎大家与我联系。</p></div></div></div><div class="cfs_letterFooter"><p>本邮件由&nbsp;<a href="http://www.coolfishstudio.com" target="_blank">酷鱼网</a>&nbsp;自动发出，无需回复。</p></div></div></div>';
    		tool.sendMail(email, '您好 ' + userName + '，请激活您的酷鱼网平台账户', html, function(err, info){
                if(err){
                	done('发送邮件时，发送了错误');
                }else{
                    done();
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

//激活
exports.activate = function(req, res){
	var email = req.params.email || '';
	var pwdTime = req.params.pwdTime || '';
	var userInfo = {};
	async.series({
		//判断是否为空
		judgeNull : function(done){
			if(!email || !pwdTime){
				done('参数链接有问题。');
			}else{
				done();
			}
		},
		//判断是否有这个用户
		judgeUser : function(done){
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
		//判断是否过期
		judgeExpired : function(done){
			var createTime = new Date(parseInt(pwdTime.substring(pwdTime.length - 13, pwdTime.length)));
			var newTime = new Date().getTime();
			if((newTime > createTime) && (newTime - createTime) < 24*60*60*1000){
				done();
			}else{
				done('时间已经过期了。');
			}
		},
		//激活
		activateUser : function(done){
			user.update(userInfo._id,{
				'activate' : true
			},function(err, info){
				if(err){
					done(err);
				}else{
					userInfo.password = '';
                    req.session.user = userInfo;
					done();
				}
                
            });
		}
	}, function(err){
		if(err){
			//有问题
			res.render('activate', {status: -1, content: email, error: err});
		}else{
			//没问题
			res.render('activate', {status: 0, content: email});
		}
	});
};



