'use strict'
var mongoose = require('mongoose');
var app = require('./app');
mongoose.Promise = global.Promise;

var port = process.env.PORT || 1999;

mongoose.connect('mongodb://localhost:27017/Excel', { useNewUrlParser: true }).then(() => {
    console.log('Se conecto a la base de datos');
    app.listen(port, () => {
        console.log('El servidor local esta corriendo perfectamente');
    });
}).catch(err => console.log(err));
