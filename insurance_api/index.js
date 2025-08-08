require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use('/', require('./routes/user_policies'));
app.use("/available-policies", require("./routes/available_policies"))

app.listen(5000, () => console.log('API running on port 5000'));
