var express = require("express");
app=express();
var Controller=require('./controllers/controller')

app.set('view engine','ejs')
//app.engine('ejs', require('ejs').__express);


Controller(app);
app.use(express.static(__dirname + '/public'));

app.listen(4000,'127.0.0.1')
console.log("reading")