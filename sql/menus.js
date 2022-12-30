const db = require("./db");

const MenusSchema = new db.mongoose.Schema({
  authName: {
    type: String,
    required: true,
  },
  children: {
    type: Array,
    required: true,
  },
});

module.exports = db.mongoose.model("menus", MenusSchema);
