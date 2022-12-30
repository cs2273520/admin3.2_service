const db = require("./db");

const UserSchema = new db.mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = db.mongoose.model("users", UserSchema);
