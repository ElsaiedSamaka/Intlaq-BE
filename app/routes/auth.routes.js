const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const { verifySignUp } = require("../middleware");
const checkUser = require( "../middleware/checkUser" );
const upload = require("../utils/multer.config");

router.post(
  "/signup",
  [
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkPasswordConfirmation,
  ],
  authController.signup
);
router.post("/signin", [passport.authenticate('local')], authController.signin);
router.post("/signout", authController.signout);
router.get( "/signedin", [ checkUser.isLoggedIn ], authController.signedin );
router.put('/update-password',[  verifySignUp.checkPasswordConfirmation ], authController.updatePassword)
router.put('/update-avatar',[ checkUser.isLoggedIn, upload.single("file_img") ], authController.updateAvatar)
module.exports = router