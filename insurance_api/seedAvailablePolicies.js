const mongoose = require("mongoose");
const AvailablePolicy = require("./models/AvailablePolicy");
require("dotenv").config()

const MONGO_URI = process.env.MONGODB_URI; // change if needed

const policies = [
  {
    crop_type: "Wheat",
    coverage_amount: 10000,
    premium: 500,
    duration_months: 6,
    description: "Coverage for wheat crops against drought and flood"
  },
  {
    crop_type: "Rice",
    coverage_amount: 15000,
    premium: 700,
    duration_months: 6,
    description: "Covers rice paddy fields from pest infestation and water shortage"
  },
  {
    crop_type: "Maize",
    coverage_amount: 12000,
    premium: 600,
    duration_months: 6,
    description: "Protects maize against storm damage and locust attacks"
  },
  {
    crop_type: "Sugarcane",
    coverage_amount: 20000,
    premium: 900,
    duration_months: 9,
    description: "Coverage for sugarcane crops from flood and pest outbreaks"
  },
  {
    crop_type: "Cotton",
    coverage_amount: 18000,
    premium: 800,
    duration_months: 9,
    description: "Protects cotton from whitefly attack and excessive rainfall"
  },
  {
    crop_type: "Soybean",
    coverage_amount: 14000,
    premium: 650,
    duration_months: 6,
    description: "Insurance against fungal disease and unexpected drought"
  },
  {
    crop_type: "Groundnut",
    coverage_amount: 16000,
    premium: 750,
    duration_months: 6,
    description: "Coverage against pest damage and heavy rainfall"
  },
  {
    crop_type: "Barley",
    coverage_amount: 11000,
    premium: 500,
    duration_months: 6,
    description: "Protects barley crops from frost damage and storm winds"
  }
];

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");

    await AvailablePolicy.deleteMany({});
    console.log("Cleared existing policies");

    await AvailablePolicy.insertMany(policies);
    console.log("Inserted policy templates successfully");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error:", err);
    mongoose.connection.close();
  });
