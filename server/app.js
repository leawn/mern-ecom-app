const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// app
const app = express();

// db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
})
    .then(() => {
        console.log('DB CONNECTED.');
    })
    .catch(err => {
        console.log(err);
    });

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(cors());

//routes
app.get('/api', (req, res, next) => {
    res.json({
        data: 'you hit the api endpoint.'
    })
});

//port
const port = process.env.PORT || 8000;

app.listen(port);