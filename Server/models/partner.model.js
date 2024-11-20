const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    zip_code: {
      type: String,
      required: true,
    },
    contact_info: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    address: {
      type: String,
      required: true,
    },
    partner_type: {
      type: String,
      required: true,
      enum: ["Vendor", "Client", "Service Provider", "Other"],
    },
    availability: {
      type: String,
      required: true,
      enum: ["Available", "Unavailable", "On Request"],
    },
    status: {
      type: String,
      enum: ["Active", "Suspended", "Pending", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);
module.exports = Partner;
