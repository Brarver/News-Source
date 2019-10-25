var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsSource", { useNewUrlParser: true });

////////////HOME GET ROUTE//////////////////////////////

app.get("/", function (req, res) {

  db.Article.find({})
    .then(function(dbArticle) {
      var hbsObject = {
        articles: dbArticle,
        main: true
      }
      res.render('index', hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
    
})

////////////////////SAVED GET ROUTE///////////////////////////

app.get("/saved", function (req, res) {

  db.Saved.find({})
    .then(function(dbArticle) {
      var hbsObject = {
        articles: dbArticle,
        saved: true
      }
      res.render('index', hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
})

/////////////////////SAVED POST ROUTE//////////////////////////

app.post("/saved", function (req, res) {

  db.Saved.create(req.body)
  .then(function(dbArticle) {
      res.render()
  })
  .catch(function(err) {
      console.log(err);
  });

  db.Article.deleteOne(
    {
      _id: req.body.id
    },
    function(err, suc) {
      if (err) {
        console.log(error)
      } else {
        console.log('success')
      }
    }
  )
  res.send("worked")
});

///////////////////DELETE SAVED ARTICLE///////////////////////////////

app.delete("/saved/:id", function(req, res) {

  db.Saved.deleteOne(
    {
      _id: req.params.id
    },
    function(err, suc) {
      if (err) {
        console.log(error)
      } else {
        // console.log('success')
      }
    }
  )
  res.send("worked")
});

///////////////////SCRAPE ROUTE///////////////////////////////

app.get("/scrape", function(req, res) {

  axios.get("https://rockandice.com/").then(function(response) {
    
            var $ = cheerio.load(response.data);
            
            $("div.news-box").each(function(i, element) {
            
                var results = {};
            
                results.title = $(this)
                        .children("a")
                        .children(".news_cont")
                        .children("h2")
                        .text();
                results.link = $(this)
                        .children("a")
                        .attr("href");
                results.date = $(this)
                        .children("a")
                        .children(".news_cont")
                        .children(".news_date")
                        .text()
                
                        
                console.log(results);
    
            db.Article.create(results)
                .then(function(dbArticle) {
                    res.render()
                })
                .catch(function(err) {
                    console.log(err);
                });

            });
            
            res.send("scrape worked")
            });
});

/////////////////////// Route for getting all Articles from the db///////////////////////////

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//////////////////// Route for grabbing a specific saved Article by id, populate it with it's note///////////////////////////

app.get("/saved/:id", function(req, res) {

  db.Saved.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
      res.send(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

/////////////////////////////Route for saving/updating an Article's associated Note///////////////////////////////

app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
      res.send(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    });
});

/////////////////////ROUTE CLEAR ALL ARTICLES//////////////////////////////////////////

app.get("/clearall", function (req, res) {

  db.Article.deleteMany({}, function(error, response) {
    if (error) {
      console.log(error)
    } else {
      console.log(response)
    }
  })

  db.Saved.deleteMany({}, function(error, response) {
    if (error) {
      console.log(error)
    } else {
      console.log(response)
    }
  })

  res.send("worked")
})

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});