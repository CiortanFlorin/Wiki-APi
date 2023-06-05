const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));









mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles").get(function(req, res){
    Article.find().then(function(foundArticles){
        res.send(foundArticles);
    });
}).post(function(req, res){
    const article = new Article({
        title:req.body.title,
        content:req.body.content
    });
    try{
    Article.create(article);
    res.send("Success");
    }catch(error){
        console.error(error);
        res.send(err);
    }
}).delete(function(req, res){
    try{
    Article.deleteMany().then();
    res.send("Successfully deleted all");
    }catch(error){
        console.error(error);
        res.send(err);
    }
});


app.route("/articles/:article").get(function(req,res){
    Article.findOne({title:req.params.article}).then(function(foundArticle){
        if(foundArticle!==null){
        res.send(foundArticle);}
        else{
            res.send("No article with this title")
        }
    }); 
})
.put(function(req,res){
    Article.replaceOne({title:req.params.article},
                   {title:req.body.title, content:req.body.content})
                   .then(function(changedArticle){
                    
                    if(changedArticle.modifiedCount===1){
                        res.send("Article updated");
                    }else{
                        res.send("Error on update");
                    };
                   })
})
.patch(function(req,res){
    Article.updateOne({title:req.params.article},
        {$set: req.body})
        .then(function(changedArticle){
         
         if(changedArticle.modifiedCount===1){
             res.send("Article updated");
         }else{
             res.send("Error on update");
         };
        })
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.article})
            .then(function(deletedArticle){
                if(deletedArticle.deletedCount===1){
                    res.send("Article deleted");
                }else{
                    res.send("Error on deletion");
                }
            })
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});