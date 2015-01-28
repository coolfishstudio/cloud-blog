var express = require('express');
var router = express.Router();
var pageUser = require('./pageUser');
var pageBook = require('./pageBook');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { user:req.session.user || ''});
});

router.get('/editor', function(req, res) {
  res.render('editor', { user:req.session.user || ''});
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
/* books 书籍 */
//增加书籍
router.post('/b/add', pageBook.add);
//修改书籍
//删除书籍
//查询书籍
/* article 文章 */
//增加文章
//修改文章
//删除文章
//查询文章
//全部文章


module.exports = router;
