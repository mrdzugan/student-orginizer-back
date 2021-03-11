const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user.model');
db.role = require('./role.model');
db.faculty = require('./faculty.model');
db.group = require('./group.model');

db.ROLES = ['student', 'headman', 'curator'];

module.exports = db;