var play       = require('play').Play();
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var fs         = require('fs');
var path       = require("path");
var multipart  = require('connect-multiparty');
var redis      = require('redis');
var multipartMiddleware = multipart();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(express.static("public"));

var redisServer = '127.0.0.1'
var redisPort = '6379';

var soundExt = 'mp3';
var soundDir = './sounds/';
var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.get('/sounds', function(req, res) {
    fs.readdir(soundDir, function(err, files){
        files.sort(function(a, b) {
                       return fs.statSync(soundDir + a).mtime.getTime() - 
                              fs.statSync(soundDir + b).mtime.getTime();
                   });
                   

        redisClient.mget(files, function (err, plays) {
        
            var c = files.map(function (e, i) {
                var playCnt = plays[i];
                if (playCnt == null) playCnt = 0;
                return {id:e, cnt:playCnt};
            });       
            
            var sortedByPlays = c.sort(function(a, b) {
                return a.cnt - b.cnt;
            });
             
            res.json(sortedByPlays);
        });
    });
});

router.get('/play', function(req, res) {
    var id = req.param('id');
	play.sound(soundDir + id);
	
    redisClient.incr(id, function(error, result) {

        if (result) {
            console.log("set " + result);
        }
        else
        {
            console.log("set 0");
        }
    });
    
    res.redirect("back");
});

router.get('/delete', function(req, res) {
    fs.unlink(soundDir + req.param('id') ,function() {
        res.redirect("back");   
    });
});

router.post('/upload', multipartMiddleware,  function(req, res) {
	fs.readFile(req.files.file.path, function (err, data) {
	  var newPath = __dirname +  '/sounds/' + req.files.file.name;
	  fs.writeFile(newPath, data, function (err) {
	    console.log(newPath)
	    res.redirect("back");
	  });
	});
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

var redisClient = redis.createClient(redisPort, redisServer);

redisClient.on('connect', function() {
    console.log('Connected to Redis');
});

app.listen(port);
console.log('Soundboard started on: ' + port);
