const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const http = require('http');
var exphbs  = require('express-handlebars');


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function (req, res) {
    // refactoring the code according to the tutorial broke it so I reverted to the old code.
    console.log(req.query.term)
    var queryString = req.query.term;
    // ENCODE THE QUERY STRING TO REMOVE WHITE SPACES AND RESTRICTED CHARACTERS
    var term = encodeURIComponent(queryString);
    // PUT THE SEARCH TERM INTO THE GIPHY API SEARCH URL
    var url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC'
  
    http.get(url, function(response) {
      // SET ENCODING OF RESPONSE TO UTF8
      response.setEncoding('utf8');
  
      var body = '';
  
      response.on('data', function(d) {
        // CONTINUOUSLY UPDATE STREAM WITH DATA FROM GIPHY
        body += d;
      });
  
      response.on('end', function() {
        // WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
        var parsed = JSON.parse(body);
        // RENDER THE HOME TEMPLATE AND PASS THE GIF DATA IN TO THE TEMPLATE
        res.render('home', {gifs: parsed.data})
      });
    });
  })
  
  


app.get('/hello-gif', function (req, res) {
    var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
    res.render('hello-gif', {gifUrl: gifUrl})
  })

app.get('/greetings/:name', function (req, res) {
    var name = req.params.name;
    res.render('greetings', {name: name});
  })


app.get('/:username',(req,res)=>{
    res.send(req.params.username);
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});


