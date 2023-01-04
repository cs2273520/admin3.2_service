const db = require("./db");

const MechanismSchema = new db.mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  submitDate: {
    type: String,
    required: true,
  },
  auditDate: {
    type: String,
    default: 'null',
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image1: {
    type: String,
    required: true,
  },
  image2: {
    type: String,
    required: true,
  },
});

module.exports = db.mongoose.model("mechanism", MechanismSchema);
