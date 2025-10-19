const cloudinary = require("cloudinary");
const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Expresserror = require("../validation/expresserror");
const edituser = async (req, res, next) => {
  var body = req.body;
  if (req.file) {
    var result = await cloudinary.uploader.upload(req.file.path);
    body.image = result.secure_url;
  }
  const id = req.params.id;
  const obj = await userSchema.findById({ _id: id });
  var password = req.body.Oldpassword;
  const comparing = await bcrypt.compare(password, obj.password);
  if (!comparing) {
    next(new Expresserror("500", "Wrong Credentials"));
  } else {
    body.password = await bcrypt.hash(req.body.Newpassword, 10);
    await userSchema.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.redirect("/logout");
  }
};

module.exports = edituser;
