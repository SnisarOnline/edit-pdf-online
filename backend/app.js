const express = require('express');
const path = require('path');
const http = require('http');
const myconfig = require('./src/helpers-myconfig');
const bodyParser = require('body-parser');
const log = require('./src/helpers-log')(module);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false , limit: 52428800}));
app.use(bodyParser.json({limit: 52428800}));
app.use('/static', express.static('public'));


//================================================================//
//********** Routes **********************************************//
//================================================================//
const router = require('./src/routes-api');
app.use('/api', router );

app.get('**', (req,res) => {
  return res.status(500).json({
    message: 'error URL',
    beck: 'i`m working',
    back: 'localhost:3000',
    front: 'localhost:4000'
  });
  // res.sendFile(path.join(myconfig.homePath, '..', 'dist', 'index.html') )
});


//================================================================//
//********** Error ***********************************************//
//================================================================//
app.use((error, req, res, next)=>{
  res.status(error.status || 500);
  res.json({
    title: 'Oops...',
    message: error.message,
    error: myconfig.IS_DEVELOPMENT ? error : {},
  });
});

//================================================================//
//********** Critical error **************************************//
//================================================================//
process.on('uncaughtException', function (err) {
  log.error((new Date).toUTCString() + ' uncaughtException: ', err.message);
  log.error(err.stack);
  process.exit(1);
});

const server = http.createServer(app);

server.listen(myconfig.port, () => {
  log.http( ` Server listening on port = ${myconfig.port}`);
  log.verbose( `Server listening on port = ${myconfig.port}`);
});
