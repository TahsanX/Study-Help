const express = require("express");
const route = express.Router({ mergeParams: true });
const asyncwrap = require("../utils/wrapasync");
const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Expresserror = require("../validation/expresserror");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const editUserController = require("../controllers/editUserController");
const editUserValidate = require("../utils/userEditValidation");
const verifyToken = require("../utils/verifytoken");
const validaterror = require("../utils/Validateerror");

route.get("/signup", (req, res) => {
  res.render("signup");
});
route.get("/login", (req, res) => {
  res.render("login");
});
route.post(
  "/signup",
  validaterror.userJoi,
  asyncwrap(async (req, res) => {
    let { username, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new userSchema({
      username: username,
      email: email,
      password: hashedpassword,
    });
    try {
      await newUser.save();
    } catch (error) {
      throw new Expresserror("409", "Username or email exsists please login");
    }
    res.redirect("/login");
  })
);
// middleware gula use korar shomoy midware() = eita holo middleware executing
// middleware gula shadharonto pass by reference kora hoy
route.post(
  "/login",
  asyncwrap(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await userSchema.findOne({ username });
    if (!user) {
      next(new Expresserror("500", "Wrong credentials"));
    } else {
      const comparing = await bcrypt.compare(password, user.password);
      if (!comparing) {
        next(new Expresserror("500", "Wrong credentials"));
      } else {
        const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
        req.session.token = token;
        jwt.verify(token, "secretkey", (err, decoded) => {
          req.user = decoded;
          req.flash("success", `${req.user.username} you are logged in`);
        });

        res.redirect(req.session.redirectTo || "/all");
      }
    }
  })
);
route.get("/logout", verifyToken, (req, res) => {
  req.session.destroy();
  res.redirect("/all");
});
route.post(
  "/:id/edit-user",
  verifyToken,
  upload.single("image"),
  editUserValidate,
  asyncwrap(editUserController)
);
module.exports = route;
