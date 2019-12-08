const log = require('./helpers-log.js')(module);
let pathFiles = 'public/';

const puppeteer = require('puppeteer');

/**
 * save in pdf of the whole page
 * @Info https://github.com/GoogleChrome/puppeteer#readme
 */
exports.createPdfFromHtml = function (req, res) {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.goto('http://coolwanglu.github.io/pdf2htmlEX/doc/tb108wang.html', {waitUntil: 'networkidle2'});
    await page.setContent(req.body.html, {waitUntil: 'networkidle2'});
    await page.pdf({path: pathFiles + 'test-Puppeteer.pdf', format: 'A4'});

    await browser.close();
    await res.json({file: 'http://localhost:3000/static/test-Puppeteer.pdf'});
  })();
};
