const express = require('express');
const User = require('./models//user.model');
const mongoose = require('mongoose');
const connectDB = require('./config/db.js')
const bodyParser = require('body-parser');
const partnerRoutes = require('./routes/partner.routes.js');
const userRoutes = require('./routes/user.routes.js');
require('dotenv').config();

const app = express();

const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());  


connectDB();


app.use('/api/partners', partnerRoutes);
app.use('/api/users', userRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

