var play       = require('play').Play();
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs         = require('fs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var soundExt = 'mp3';
var soundDir = './sounds/';
var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

router.get('/', function(req, res) {
    fs.readdir(soundDir, (err, files) => {
        files.sort(function(a, b) {
                       return fs.statSync(soundDir + a).mtime.getTime() - 
                              fs.statSync(soundDir + b).mtime.getTime();
                   });
        res.send(files);
    });
});

router.get('/:sound/', function(req, res) {
	play.sound(soundDir + req.params.sound + soundExt);
    res.send(200)
});

router.delete('/:sound/', function(req, res) {
    fs.unlink(soundDir + req.params.sound + soundExt ,function() {
        res.send(200)   
    });
});



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Soundboard started on: ' + port);
