const mongoose = require("mongoose");
const model = require("../models/fileschema");
const data = require("./data"); // Corrected import
const ObjectId = require("mongoose").Types.ObjectId;
const userId = new ObjectId("666dc66ffa73fc68d7664148");
mongoose.connect("mongodb://127.0.0.1:27017/filemanage").then(() => {});
// const saving = async () => {
//   await
// };
// saving();
