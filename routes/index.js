var express = require('express');
var router = express.Router();
var isUserLoggedIn = require('../middleware/routeprotector').ifUserLoggedIn;
const {getRecentPosts, getPostById, getCommentsByPostId} = require('../middleware/postsmiddleware');
var db = require("../config/database");

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index', { title: "Home Page"});
});

router.get('/login', (req, res, next) => {
  res.render('login', {title: "Login Page"});
});

router.get('/register', (req, res, next) => {
  res.render('registration', {title: "Registration Page", js: ['validation.js']});
});

router.use('/post', isUserLoggedIn);
router.get('/post', (req, res, next) => {
  res.render('postimage', {title: "Post Image"});
});

router.get("/posts/:id(\\d+)", getPostById, getCommentsByPostId, (req, res, next) => {
  res.render("viewpost", {title: `Post${req.params.id}`});
});

module.exports = router;
