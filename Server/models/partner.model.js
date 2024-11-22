const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: [String],
      enum: ["Male", "Female", "Non-binary"],
      required: true,
    },
    age_range: {
      type: [String],
      enum: ["Minors (under 18)", "Adults (18-64)", "Seniors (65 and over)"],
      required: true,
    },
    citizenship_status: {
      type: [String],
      enum: ["Citizen", "Resident", "Non-immigrant (temporary visa)", "Undocumented"],
      required: true,
    },
    insurance: {
      type: [String],
      enum: [
        "Accepts private insurance",
        "Accepts Medicare",
        "Accepts Medicaid",
        "Accepts MAP",
        "Accepts Ryan White Program",
        "Accepts patients/clients without insurance"
      ],
      required: true,
    },
    zip_code: {
      type: [String], 
      required: true,
    },
    physical: {
      type: [String],
      enum: [
        "Physical Care",
        "Health Screenings", 
        "MAP Enrollment", 
        "Public Funded Health Insurance",
      ],
      required: true,
    },
    mental: {
      type: [String],
      enum: [
        "Counseling", 
        "Nutrition Education", 
        "Psychiatric Assessments & Treatment", 
        "Trauma & Post-Traumatic Stress", 
        "Grief Assessments & Processing", 
        "Therapeutic Services for Severe Mental Illnesses", 
        "Counseling & Life Coaching Services", 
        "Medication Management", 
        "Substance Use Disorders", 
        "Coping Skills Improvement",
      ],
      required: true,
    },
    social_determinants_of_health: {
      type: [String],
      enum: [
        "Food", 
        "Diversion", 
        "Transportation", 
        "Workforce (Career Skills)", 
        "Training", 
        "PSH Supportive Services", 
        "Respite Medical Care Support", 
        "Reentry Support Services"
      ],
      required: true,
    },
    offers_transportation: {
      type: [String],
      enum: ["Yes", "No"],
      required: true,
    },
    emergency_room: {
      type: [String],
      enum: ["Yes", "No"],
      required: true,
    }
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);
module.exports = Partner;
