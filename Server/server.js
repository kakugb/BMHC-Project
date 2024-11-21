const express = require('express');
const User = require('./models//user.model');

const connectDB = require('./config/db.js')
const bodyParser = require('body-parser');
const partnerRoutes = require('./routes/partner.routes.js');
const userRoutes = require('./routes/user.routes.js');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;  


connectDB();


app.use('/api/partners', partnerRoutes);
app.use('/api/users', userRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

