const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const userRoutes = require("./routes/user.js")
const schedule = require("./routes/schedule.js")

require('dotenv').config();


const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(helmet())

app.use("/api", userRoutes)
app.use("/api", schedule)

// -------
const mongoose = require('mongoose');

const itemsRouter = require('./routes/schedule.js');

// Connect to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/officehourscheduler', {
  mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

// Routes
app.use('/api/items', itemsRouter);

// -------

app.listen(PORT, () => console.log("Listening"));


