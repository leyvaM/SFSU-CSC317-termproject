var express = require('express');
var router = express.Router();
const {successPrint, errorPrint} = require("../helpers/debug/debugprinters");
const {create} = require("../models/Comments");

router.post('/create', (req, res, next) => {
    if(!req.session.username) {
        errorPrint("you must be logged in to comment");
        res.json({
            code: -1,
            status:"danger",
            message: "you must be logged in to write a comment"
        });
    }else {
    let {comment, postId} = req.body;
    let username = req.session.username;
    let userId = req.session.userId;
    create(userId, postId, comment)
    .then((wasSuccessful) => {
        if (wasSuccessful !== -1) {
            successPrint(`comment was created for ${username}`);
            res.json({
                code: 1,
                status:"success",
                message:"comment posted",
                comment:comment,
                username: username
            })
        }else {
            errorPrint('comment was not saved');
            res.json({
                code: -1,
                status:"danger",
                message:"comment was not posted"
            })
        }
    })
    .catch((error) => next(error));
    }
})
module.exports = router;