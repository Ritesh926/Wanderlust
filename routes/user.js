const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware");

// Signup Routes
router.route("/signup")
    .get(users.renderSignupForm)
    .post(users.signup);

// Login Routes
router.route("/login")
    .get(users.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        users.login
    );

// Logout Route (no chaining needed for single GET)
router.get("/logout", users.logout);

module.exports = router;
