const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConfig = require('./app/config/db.config');

const app = express();
const PORT = process.env.PORT || 8000;
/*const corsOptions = {
    origin: "http://localhost:3000"
};*/

app.use(cors(/*corsOptions*/));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
const Role = db.role;
const Faculty = db.faculty;
const Group = db.group;

db.mongoose
    .connect(`mongodb://${ dbConfig.HOST }:${ dbConfig.PORT }/${ dbConfig.DB }`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connect to MongoDB.');
        initial();
    })
    .catch(err => {
        console.error('Connection error', err);
        process.exit();
    });


// routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to student-organizer application.' });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/faculty.routes')(app);


app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }.`);
});

const faculties = require('./app/mocks/faculties.mock');
const groups = require('./app/mocks/groups.mock');

function initial() {
    Faculty.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            faculties.forEach(({ fullName, abbreviation }) => {
                const faculty = new Faculty({
                    _id: new db.mongoose.Types.ObjectId(),
                    fullName,
                    abbreviation,
                    groups: []
                });

                const groupsList = groups.filter(grp => grp.facultyAbbreviation === abbreviation);
                groupsList.forEach(group => {
                    const createdGroup = new Group({
                        name: group.name,
                        faculty: faculty._id,
                        members: []
                    });
                    createdGroup.save(err => {
                        if (err) {
                            console.log('error', err);
                        }

                        console.log(`added '${ group.name }' group`);
                    });
                    faculty.groups.push(createdGroup);
                });

                faculty.save(err => {
                    if (err) {
                        console.log('error', err);
                    }
                    console.log(`added '${ fullName }' (${ abbreviation }) faculty`);
                });
            });
        }
    });
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: 'student'
            }).save(err => {
                if (err) {
                    console.log('error', err);
                }

                console.log('added \'student\' to roles collection');
            });

            new Role({
                name: 'headman'
            }).save(err => {
                if (err) {
                    console.log('error', err);
                }

                console.log('added \'headman\' to roles collection');
            });

            new Role({
                name: 'curator'
            }).save(err => {
                if (err) {
                    console.log('error', err);
                }

                console.log('added \'curator\' to roles collection');
            });
        }
    });
}