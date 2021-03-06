var express = require('express');
var router = express.Router();
var pageUser = require('./pageUser');
var pageBook = require('./pageBook');
var pageArticle = require('./pageArticle');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { user:req.session.user || ''});
});

//初步定制 需要的路由
/******************** user 用户 ********************/
//注册 post
router.post('/signin', pageUser.signin);
//登录 post
router.post('/login', pageUser.login);
//退出 get
router.get('/logout', pageUser.logout);
//激活
router.get('/activate/:email/:pwdTime', pageUser.activate);
/* books 专辑 */
//增加专辑
router.post('/b/add', pageBook.add);
//修改专辑
router.post('/b/update', pageBook.update);
//删除专辑
router.post('/b/del', pageBook.remove);
//查询专辑
router.get('/editor', pageBook.getByUserID);

//发表专辑
/* article 文章 */


//增加文章
router.post('/p/add', pageArticle.add);
//删除文章
router.post('/p/del', pageArticle.remove);
//查询文章
router.get('/p/:articleID', pageArticle.getByID);
//修改文章
router.post('/p/:articleID', pageArticle.update);
//全部文章
router.get('/b/:bookID', pageArticle.getByBookID);


module.exports = router;
