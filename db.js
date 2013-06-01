var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Entry = new Schema({
});

mongoose.model('Entry', Entry);

var mongoUri = process.env.MONGOLAB_URI
    || process.env.MONGOHQ_URL
    || 'mongodb://localhost/whatTheFuckShouldIChange';

mongoose.connect(mongoUri);