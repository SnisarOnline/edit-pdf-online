const express = require('express');
const router = express.Router();

const convertPDF = require('./controllers-convertPDF');
const uploadExpressFile = require('./controllers-uploadFile');


//================================================================//
//********** API Server ******************************************//
//================================================================//
router.post( '/getPdf',   convertPDF.createPdfFromHtml);


//************ 404 ****************//
router.use(function(req, res, next){
    console.log( 'req.path = ', req.path );
    console.log( 'req.patch = ', req.patch );
    const err = new Error('Not Found Api');
    err.status = 404;
    next(err);
});

module.exports = router;
