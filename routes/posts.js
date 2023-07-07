var express = require('express');
var router = express.Router();
//var db = require("../config/database");
const {successPrint, errorPrint} = require("../helpers/debug/debugprinters");
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostModel = require('../models/Posts');
var PostError = require("../helpers/error/PostError");
const { fileURLToPath } = require('url');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/images/");
    },
    filename: function(req, file, cb){
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(25).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({storage: storage});

router.post('/createPost', uploader.single("image"),(req, res, next) => {
    let uploadedFile = req.file.path;
    let fileAsThumbnail =  `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;

    sharp(uploadedFile)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(() => {
        return PostModel.create(
            title,
            description,
            uploadedFile,
            destinationOfThumbnail,
            fk_userId
        );
    })
    .then((postWasCreated) => {
        if(postWasCreated) {
            req.flash('success', "post was created successfully!");
            res.redirect('/');
        }else {
            throw new PostError('Post could not be created!', '/post', 200);
        }
    })
    .catch((error) => {
        if(error instanceof PostError){
            errorPrint(error.getMessage());
            req.flash('error', error.getMessage());
            res.status(error.getStatus());
            res.redirect(error.getRedirectURL());
        }else {
            next(error);
        }
    })
});

router.get('/search', async (req, res, next) => {
    try {
    let searchTerm = req.query.search;
    if (!searchTerm) {
        res.send({
            resultsStatus: "info",
            message: "No search term given",
            results: []
        });
    }else {
        let results = await PostModel.search(searchTerm);
            if(results.length) {
                res.send({
                    resultsStatus: "info",
                    message: `${results.length} results found`,
                    results: results
                });
            }else {
                let results = await PostModel.getRecentPosts(8);
                    res.send({
                        resultsStatus: "info",
                        messsage:"No results found, displaying 8 most recent posts",
                        results: results
                    });
            }
        }
    }catch(error) {
    next(error);
    }
});

module.exports = router;