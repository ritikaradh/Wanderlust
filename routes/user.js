const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/user.js");

router.route("/signup")
    .get(UserController.signUp)
    .post(wrapAsync(UserController.userPost));

router.route("/login")
    .get(UserController.userLogin)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), UserController.userAuthentication);

router.get("/logout", UserController.userLogout);

module.exports = router;