const { default: mongoose } = require("mongoose");
const review = require("./reviewSchema");
const user = require("./userSchema");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/filemanage").then(() => {
  console.log(`Mongoose is connected `);
});
const FileSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
FileSchema.post("findOneAndDelete", async (File) => {
  if (File) {
    await review.deleteMany({ _id: { $in: File.review } });
  }
});
const File = mongoose.model("File", FileSchema);
module.exports = File;
