const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const dbConfig = require('./app/config/db.config');

require('dotenv').config();

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
//const localMongoPath = `mongodb://${ dbConfig.HOST }:${ dbConfig.PORT }/${ dbConfig.DB }`;
const mongoPath = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.r677w.mongodb.net/student_db`;

db.mongoose
    .connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
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
require('./app/routes/group.routes')(app);
require('./app/routes/faculty.routes')(app);
require('./app/routes/timetable.routes')(app);
require('./app/routes/advertisement.routes')(app);


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
            const roles = ['student', 'headman', 'curator'];
            roles.forEach(roleName => {
                new Role({
                    name: roleName
                }).save(err => {
                    if (err) {
                        console.log('error', err);
                    }

                    console.log(`added '${roleName}' to roles collection`);
                });
            });
        }
    });
}