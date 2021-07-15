const dotenv = require('dotenv').config({
  path: 'sample.env'
});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')



mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(error => handleError(error))

const app = express();


// Basic Configuration
const port = process.env.PORT || 6688;

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Basic Information

const urlSchema = new mongoose.Schema({
  url: String
});

urlSchema.methods.test = function () {
  const testing = this.url ? "The url is " + this.url : "Failed";
  console.log(testing)
}
const Url = mongoose.model('Url', urlSchema)

const test1 = new Url({
  url: "new url"
});
test1.test();


var allCollect = Url.findById();
// console.log(allCollect)




// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({
    greeting: 'hello API'
  });
});

app.post('/api/shorturl', function (req, res) {
  if (!req.body.url.includes('http')) {
    res.json({
      error: 'invaild url'
    })
  } else {
    var input = req.body.url;
    const url = new Url({
      url: input
    });
    url.test();

    url.save(function (err, url) {
      if (err) return console.error(err);
      res.json({
        original_url: url.url,
        short_url: url._id
      });
    });
  }
});

app.get('/api/shorturl/:shortUrl', function (req, res) {
  
  var id = req.params.shortUrl;
  console.log(id);
  var value = null;
 
  var checker =  Url.findById(id,function(err,data) {
    if (err) {
      console.log(err)
    } else if (data._id == id) {
        res.redirect(data.url)
    }
  })
  
console.log(value,id)

  
    
  

  


  
  



});



app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});