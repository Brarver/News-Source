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
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });

            });
            
            res.send("scrape worked")
            });