//external modules
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');;
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');

//connect database
var mongoDB = 'mongodb+srv://admin:atlasadmin@cluster0-7udpb.mongodb.net/user-test?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function(){
  console.log('connection successful')
})

//create schema and model

var schema = mongoose.Schema({
  name: String
});
var Model = mongoose.model('model', schema, 'form-data');

//app variables

var app = express();
var PORT = process.env.port || '3000';

//app configuration

app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api', function(request, response){
  console.log(request.body);
  
  var data = request.body;
  delete data._id;
  db.collection('form-data').insertOne(data);

  var doc1 = new Model (data);
                        
  doc1.save(function(err, doc){
    if(err) return console.error(err);
    console.log("Document inserted successfully")
  })
  
  response.send('voilà! your preferences are saved. Have a nice day.');
})


//server activation
// app.listen(8000, function(req, res){
//   console.log(`Listeneing at http://localhost:${PORT}`)
// });

app.listen(PORT, function(){
  console.log(`App is running on ${PORT}`)
});