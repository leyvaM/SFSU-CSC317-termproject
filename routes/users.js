var express = require('express');
var router = express.Router();
var db = require('../config/database');
const UserModel = require('../models/Users');
const UserError = require("../helpers/error/UserError");
const {errorPrint, successPrint} = require("../helpers/debug/debugprinters");
var bcrypt = require('bcrypt');
const { usernameExists } = require('../models/Users');
//const app = require('../app');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirm_password = req.body.password;

  db.execute("SELECT * FROM users WHERE username=?",[username])
  .then(([results, fields]) => {
    if(results && results.length == 0) {
      return db.execute("SELECT * FROM users WHERE email=?", [email]);
    }else {
      throw new UserError(
        "Registration Failed: Username already exists",
        "/register",
        200
      );
    }
  })
  .then(([results, fields]) => {
    if (results && results.length == 0) {
      return bcrypt.hash(password, 13);
    }else {
      throw new UserError(
        "Registration Failed: Email already exists",
        "/register",
        200
      );
    }
  })
  .then((hashedPassword) => {
      let baseSQL = " INSERT INTO users (username, email, password, created) VALUES (?,?,?,now());"
      return db.execute(baseSQL,[username, email, hashedPassword]);
  })
  .then(([results, fields]) => {
    if (results && results.affectedRows){
      successPrint("User.js - - > User was created!!");
      req.flash('success', 'User account has been created!');
      res.redirect('/login');
    }else {
      throw new UserError(
        "Server Error, user could not be created",
        "/register",
        500
      );
    }
  })
  .catch((error) => {
    errorPrint("user could not be made", error);
    if (error instanceof UserError){
      errorPrint(error.getMessage());
      req.flash('error', error.getMessage());
      res.status(error.getStatus());
      res.redirect(error.getRedirectURL());
    }else {
      next(error);
    }
  });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
  let userId;
  db.execute(baseSQL,[username])
  .then(([results, fields]) => {
    if(results && results.length == 1){
      let hashedPassword = results[0].password;
      userId = results[0].id;
      return bcrypt.compare(password, hashedPassword);
    }else {
      throw new UserError("Invalid username or password!", "/login", 200);
    }
  })
  .then((passwordsMatched) => {
    if(passwordsMatched > 0) {
     successPrint(`User ${username} is logged in`);
     req.session.username = username;
     req.session.userId = userId;
     res.locals.logged = true;
     req.flash('success', 'Login successful!');
     res.redirect('/');
    }else {
      throw new UserError("Invalid username or password!", "/login", 200);
    }
  })
  .catch((error) => {
    errorPrint("user login failed");
    if(error instanceof UserError){
      errorPrint(error.getMessage());
      req.flash('error', error.getMessage());
      res.status(error.getStatus());
      res.redirect('/login');
    }else {
      next(error);
    }
  });
});

router.post('/logout',(req, res, next) => {
  req.session.destroy((error) => {
    if(error) {
      errorPrint('session could not be destroyed');
      next(error);
    }else {
      successPrint('session was destroyed');
      res.clearCookie('csid');
      res.json({status:"OK", message:"user is logged out"});
    }
  })
});

module.exports = router;
