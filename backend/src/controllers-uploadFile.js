// const convertPDF = require('./controllers-convertPDF');

exports.upload = function (req, res) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const fileName = req.files.file.name;

    file.mv('./backend/uploadFile/'+fileName, function(err) {
        if (err) return res.status(500).send(err);

        res.send('File uploaded!');
    });
};


exports.download = function (req, res) {};
