const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;
mongoose.connect("mongodb://127.0.0.1:27017/filemanage").then(() => {
  console.log(`Mongoose is connected`);
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dr6co6lqx/image/upload/v1719917652/wrnpgs3xrlxtpvnxpo1u.jpg",
  },
});
module.exports = mongoose.model("User", UserSchema);
