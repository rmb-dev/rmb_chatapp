// Setup basic express server
var express = require('express');
var app = express();

var server = require('http').createServer(app);

// This is how we tell our web server where to find the files to serve
app.use(express.static('public'));

var io = require('socket.io')(server);


io.on('connection', function (socket) {

  socket.on('message', function (msg) {
    console.log('Received Message: ', msg);
    
    function isQuestion(msg) {
      return msg.match(/\?$/);
    }
    
    function askingTime(msg) {
      return msg.match(/time/i);
    }
    
    function askingWeather(msg) {
      return msg.match(/weather/i)
    }
    
    function askingCat(msg) {
       return msg.match(/cat/i) 
    }
      
    function getWeather(callback) {
      var request = require('request');
      
      request.get("https://www.metaweather.com/api/location/4118/", function (error, response) {
        if (!error && response.statusCode === 200) {
          console.log(response)
          var data = JSON.parse(response.body);
          
          callback(data.consolidated_weather[0].weather_state_name)
        }
      }
      )
    }
    
    function getCat(callback) {
     var request = require('request');
      var random = Math.floor(Math.random() * 100);
      
      request.get("https://cat-fact.herokuapp.com/facts", function (error, response) {
        if (!error && response.statusCode === 200) {
          console.log(response)
          var data = JSON.parse(response.body);
          
          callback(data.all[random].text)
        }
      })
    }
    
    if(!isQuestion(msg)) {
      io.emit('message', msg);
    } else if (askingTime(msg)) {
      io.emit('message', new Date);
    } else if (askingWeather(msg)) {
        getWeather(function(weather) {
          io.emit('message', weather)
        })
    } else if (askingCat(msg)){
      getCat(function(cat){
        io.emit('message', cat)
      })
    } else {
      io.emit('message', msg)
    }
  });
});

var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});



