var express = require("express");
var app= express();
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
var ejs= require("ejs");
var request=require("request");
var uri = "mongodb+srv://ashish:aryan@cluster0-ce0bj.mongodb.net/test?retryWrites=true&w=majority&authSource=admin";
//mongoose.connect("mongodb://localhost/campground",{useNewUrlParser:true});
mongoose.connect(uri,{useUnifiedTopology: true,useNewUrlParser: true,useMongoClient:true}).
then(()=>{
    console.log("db connected");
}).catch((err)=>{
    console.log(err);
});
app.use(bodyParser.urlencoded({extended:true}));


app.set("veiw engine","ejs");
app.use('/public',express.static(__dirname+'/public'));

var campSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});
var Camp = mongoose.model("Camp",campSchema);
 /// put data of post request in req.body

app.get("/landing",function(req,res){
    res.render("landing.ejs");
})
app.get("/campgrounds",function(req,res){
     Camp.find({}).then((campgrounds)=>{
        res.render("index.ejs",{camps:campgrounds});
     }).catch((err)=>{
         console.log(err);
     })
    
});
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});

app.post("/campgrounds",function(req,res){ 
   // console.log(req.body.image);
  
  // var name = req.body.name;
  // console.log(name);
var image=req.body.image;
var name= req.body.name;
     //res.send(req.body);
  /// console.log(typeof imag);
  //campgrounds.push({name:name,image:image}); 
  Camp.create({
      name:name,
      image:image,
      description:req.body.description
  }).then((camp)=>{             //////push data to database
      console.log(camp);
      res.redirect("/campgrounds");
  }).catch((err)=>{
      console.log(err);
  })

});

app.get("/campgrounds/:id",function(req,res){
      Camp.findById(req.params.id).then((found)=>{
          //console.log(found);
          res.render("show.ejs",{campground:found});
      }).catch((err)=>{
          console.log(err);
      });
                    ///find the campground with the required id and show it's detail
})
//console.log(process.env.PORT);
app.listen(process.env.PORT,process.env.IP,function(){
    console.log(process.env.PORT+"  "+process.env.IP);
})