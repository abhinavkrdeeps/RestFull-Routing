var express=require("express");
var bodyParser=require("body-parser");
var methodOveride=require("method-override");
var mongoose=require("mongoose");


// mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/restful_blog_app",{useMongoClient: true});


var app=express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.use(methodOveride("_method"));

app.set("view engine","ejs");

//  define schema for our blog

var blogSchema= new mongoose.Schema({
    title: String,
    image: String,
    body : String,
    created: {type: Date,default: Date.now()}
});

/// create model for our schema
var Blog= mongoose.model("Blog",blogSchema);


/// Restful routes

app.get("/blog",function(req,res)
{
    //getting data from db and sending to blog page
   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("blog", {blogs: blogs}); 
       }
   });

});


//new route


app.get("/blog/new",function(req,res)
{
    res.render("new");
    
});
/// create blog

app.post("/blog",function(req,res)
{
    Blog.create(req.body.blog,function(err,newBlog)
    {
        if(err)
        {
            res.redirect("/blog/new");
        }else{
            res.redirect("/blog");
        }
    });
});


//show  each blog 

app.get("/blog/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           console.log(err);
           res.redirect("/blog");
       } else {
           console.log(req.body);
           res.render("show", {blog: foundBlog});
       }
   })
});

app.get("/blog/:id/edit",function(req,res){
    
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err)
       {
           console.log(err);
       }else{
           res.render("edit",{blog: foundBlog});
       }
    });
    
});
app.put("/blog/:id",function(req,res){
    
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
       if(err)
       {
           console.log(err);
       }else{
           res.redirect("/blog/" + req.params.id);
       }
    });
});
   
   
   //delete 
   
   
   app.delete("/blog/:id",function(req,res){
       Blog.findByIdAndRemove(req.params.id,function(err){
          if(err){
              res.redirect("/blog");
          } else{
              res.redirect("/blog");
          }
       });
   });

app.get("/",function(req,res){
    res.redirect("/blog");
});
app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("server connected");
});