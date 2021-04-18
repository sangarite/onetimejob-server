const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require('multer');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const publish = require('./controllers/publish');
const jobs = require('./controllers/jobs');
const help = require('./controllers/help');
const jobid = require('./controllers/jobId');
const messages = require('./controllers/messages');
const categories = require('./controllers/categories');
const settings = require('./controllers/userSettings');
const apply = require('./controllers/apply');
const send = require('./controllers/send');
const deleteJobs = require('./controllers/delete');
const creds = require('./config');

var storage = multer.diskStorage({
    destination: './avatars',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const app = express();
const upload = multer({storage: storage, preservePath: true})

app.use(cors())
app.use(express.json())
app.use(express.static('avatars'))
app.use(upload.single('photo'))

const config = {
  user: 'onejob',
  password: 'Al0U4_j-P8wO',
  server: 'den1.mssql8.gear.host',
  database: 'onejob',
  "options": {
    "encrypt": true,
    "enableArithAbort": true
  }
};

var connection = new sql.ConnectionPool(config);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'one11timejob@gmail.com',
    pass: 'ifychentjshjslom'
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Err Transport',error);
  } else {
    console.log('All works fine, congratz!');
  }
});

app.post('/signin', signin.handleSignIn(connection, sql, bcrypt));
app.post('/register', register.handleRegister(connection, sql, bcrypt));
app.post('/publish', publish.handlePublish(connection, sql));
app.get('/jobs', jobs.getJobs(connection, sql));
app.get('/help',help.GetHelp(connection, sql));
app.get('/joblist/:id',jobid.GetJob(connection, sql));
app.post('/job/apply', apply.Apply(connection, sql, transporter))
app.get('/messages/:id',messages.GetMessage(connection, sql));
app.put('/messages/:id',messages.updateMessage(connection, sql));
app.get('/categories', categories.GetCategories(connection, sql));
app.put('/settings/basic', settings.updateBasicSettings(connection, sql));
app.put('/settings/password', settings.updatePassword(connection, sql, bcrypt));
app.delete('/settings/delete', settings.deleteAccount(connection, sql));
app.post('/send', send.Send(transporter, connection, sql));
app.delete('/delete', deleteJobs.DeleteJobs(connection, sql));
app.post('/avatar', function(req, res) { res.send(req.body.photo)});

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT || 3000}`);
})
