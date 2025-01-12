const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const userRoutes = require('./routes/userRoutes');
const savedDataRoutes = require('./routes/savedDataRouter'); 

const errorHandler = require('./middlewares/errorHandler');

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use routes
app.use(userRoutes);
app.use(savedDataRoutes); 

app.get('/', (req, res) => {
    res.status(200).send({ status: "success", msg: "API is working well." });
});


app.use((req, res, next) => {
    const err = Object.assign(Error("Endpoint not found"), { code: 404 });
    next(err);
});

// Error handler middleware
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    mongoose.connect(process.env.DB_URL)
        .then(() => console.log('Server is running :)'))
        .catch((error) => console.log(error));
});
