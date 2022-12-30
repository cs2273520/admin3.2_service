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
//   mechanismImg: {
//     type: String,
//     required: true,
//   },
//   ownerImg: {
//     type: String,
//     required: true,
//   },
});

module.exports = db.mongoose.model("mechanism", MechanismSchema);
