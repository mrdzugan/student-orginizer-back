exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.studentBoard = (req, res) => {
    res.status(200).send("Student Content.");
};

exports.curatorBoard = (req, res) => {
    res.status(200).send("Curator Content.");
};

exports.headmanBoard = (req, res) => {
    res.status(200).send("Headmanz Content.");
};