//var db = require("../config/database");
const {getRecentPosts, getPostById} = require("../models/Posts");
const postMiddleware = {}
const {getCommentsForPost} = require("../models/Comments");

postMiddleware.getRecentPosts = async function(req, res, next){
    try {
        let results = await getRecentPosts(8);
        res.locals.results = results;
        if (results.length == 0) {
            req.flash('error', 'There are no posts created yet');
        }
        next();
    }catch(error) {
        next(error)
    }
}

postMiddleware.getPostById = async function(req, res, next) {
    try {
        let postId = req.params.id;
        let results = await getPostById(postId);
        if(results && results.length) {
            res.locals.currentPost = results[0];
            next();
        }else {
            req.flash("error", "Unrecognized post.");
            res.redirect('/');
        }
    }catch(error) {
        next(error);
    }
}

postMiddleware.getCommentsByPostId = async function(req, res, next){
    let postId = req.params.id;
    try {
        let results = await getCommentsForPost(postId);
        res.locals.currentPost.comments = results;
        next();
    }catch(error) {
        next(error);
    }
}

module.exports = postMiddleware;